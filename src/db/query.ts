import { getDb } from "./client";

// --- TYPES ---
type EventFilters = {
  limit?: number;
  offset?: number;
  category?: string | null;
  blockchain?: string | null;
  type?: string | null;
  asset?: string | null;
};

type RawEventRow = {
  id: string;
  txHash: string;
  blockchain: string;
  category: string;
  type: string;
  aux: string;
  time: number;
};

type ParsedEvent = Omit<RawEventRow, 'aux'> & {
  aux: Record<string, unknown>;
};

type GroupedEvents = Record<string, ParsedEvent[]>;

type GetAllEventsResult = {
  events: GroupedEvents;
  totalCount: number;
};

// --- QUERY BUILDER ---
function buildWhereClause(filters: EventFilters): {
  where: string;
  params: (string | number)[];
} {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.category) {
    clauses.push('category = $category');
    params.push(filters.category);
  }
  if (filters.blockchain) {
    clauses.push('blockchain = $blockchain');
    params.push(filters.blockchain);
  }
  if (filters.type) {
    clauses.push('type = $type');
    params.push(filters.type);
  }
  if (filters.asset && filters.asset !== 'null') {
    // ✅ json_extract for filtering inside aux JSON
    clauses.push(`LOWER(json_extract(aux, '$.asset')) = LOWER($asset)`);
    params.push(filters.asset);
  }

  return {
    where: clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}

// --- MAIN QUERY ---
export async function getAllEvents(filters: EventFilters = {}): Promise<GetAllEventsResult> {
  const {
    limit = 50,
    offset = 0,
    category = null,
    blockchain = null,
    type = null,
    asset = null,
  } = filters;

  try {
    const { db } = await getDb();
    const { where, params } = buildWhereClause({ category, blockchain, type, asset });

    // ✅ single prepared count query
    const countRow = db.prepare<{ total: number }, (string | number)[]>(
      `SELECT COUNT(*) as total FROM events${where}`
    ).get(...params) as { total: number } | null;

    const totalCount = countRow?.total ?? 0;

    // ✅ single prepared data query
    const rows = db.prepare<RawEventRow, (string | number)[]>(
      `SELECT * FROM events${where} ORDER BY time DESC LIMIT $limit OFFSET $offset`
    ).all(...params, limit, offset) as RawEventRow[];

    // ✅ group and parse aux JSON in one pass
    const events = rows.reduce<GroupedEvents>((acc, row) => {
      const key = row.category.includes(':')
        ? row.category.split(':')[1]
        : row.category;

      if (!acc[key]) acc[key] = [];

      acc[key].push({
        ...row,
        aux: JSON.parse(row.aux) as Record<string, unknown>,
      });

      return acc;
    }, {});

    return { events, totalCount };

  } catch (err) {
    console.error("[DB] getAllEvents failed:", err);
    return { events: {}, totalCount: 0 };
  }
}
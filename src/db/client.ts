import type { Database as BunDatabase, Statement, SQLQueryBindings  } from "bun:sqlite";
import { parseSupraEventAux } from "../lib/chains/supra";
import { parseEvmEventAux } from "../lib/chains/evm";
import { mkdirSync } from "fs";
import { join } from "path";

// ✅ import.meta.dir is Bun-only, import.meta.url works everywhere
const ROOT = join(
  new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), // ✅ fix Windows paths
  '../data'
);

const DB_DIR  = ROOT;
const DB_PATH = join(ROOT, 'database.db');

// --- TYPES ---
type DB = InstanceType<typeof BunDatabase>;

type Blockchain = 'supra' | 'sui' | 'base' | 'monad';

type RawSupraEvent = {
  event?: { data?: { aux?: unknown; name?: string } };
  transaction_hash?: string;
};

type RawSuiEvent = {
  parsedJson?: { aux?: unknown; name?: string };
  id?: { txDigest?: string };
  type: string;
  timestampMs?: string;
};

type RawEvmEvent = {
  args?: [string?, unknown?];
  transactionHash?: string;
};

type RawEvent = RawSupraEvent | RawSuiEvent | RawEvmEvent;

type DbRow = {
  id: string;
  txHash: string;
  blockchain: Blockchain;
  category: string;
  type: string;
  aux: string;
  time: number;
};

type Stmts = {
  insertEvent: Statement;
  updateCursor: Statement;
  getCursor: Statement;
};

// --- DB SINGLETON ---
let db: DB | null = null;
let stmts: Stmts | null = null;

export async function getDb(): Promise<{ db: DB; stmts: Stmts }> {
  if (db && stmts) return { db, stmts };

  const { Database } = await import("bun:sqlite");
  mkdirSync(DB_DIR, { recursive: true });
  console.log("[DB] Opening database at:", DB_PATH);
    db = new Database(DB_PATH, { create: true });
  console.log("[DB] Opening at:", DB_PATH);  // add this

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA cache_size = -64000');
  db.run('PRAGMA temp_store = MEMORY');

  db.run(`
    CREATE TABLE IF NOT EXISTS sync_state (
      id TEXT PRIMARY KEY,
      cursor TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      txHash TEXT NOT NULL,
      blockchain TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      aux TEXT NOT NULL,
      time INTEGER NOT NULL
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_events_chain_cat ON events (blockchain, category)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_events_time ON events (time DESC)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_events_type ON events (type)`);

  // ✅ prepared statements created after db is ready
  stmts = {
    insertEvent: db.prepare(`
      INSERT OR IGNORE INTO events (id, txHash, blockchain, category, type, aux, time)
      VALUES ($id, $txHash, $blockchain, $category, $type, $aux, $time)
    `),
    updateCursor: db.prepare(`
      INSERT INTO sync_state (id, cursor)
      VALUES ($id, $cursor)
      ON CONFLICT(id) DO UPDATE SET cursor = excluded.cursor
    `),
    getCursor: db.prepare(`
      SELECT cursor FROM sync_state WHERE id = $id
    `),
  };

  return { db, stmts };
}

// --- PARSERS ---
function parseEvent(blockchain: Blockchain, item: RawEvent, index: number): DbRow | null {
  let txHash: string | undefined;
  let typeName: string;
  let eventTime: number;
  let parsedAux: Record<string, unknown> = {};

  if (blockchain === 'supra') {
    const e = item as RawSupraEvent;
    const d = e.event?.data ?? {};
    //console.log(d);
    parsedAux = parseSupraEventAux(d.aux) ?? {};
    txHash = e.transaction_hash;
    typeName = (d.name ?? 'unknown').toLowerCase();
    eventTime = parsedAux.timestamp
      ? (parsedAux.timestamp as number) * 1000
      : Date.now();

  } else if (blockchain === 'sui') {
    const e = item as RawSuiEvent;
    parsedAux = parseSupraEventAux(e.parsedJson?.aux) ?? {};
    txHash = e.id?.txDigest;
    typeName = e.parsedJson?.name?.toLowerCase() ?? e.type.split('::').pop()!.toLowerCase();
    eventTime = e.timestampMs ? parseInt(e.timestampMs) : Date.now();

  } else {
    const e = item as RawEvmEvent;
    parsedAux = parseEvmEventAux(e.args?.[1]) ?? {};
    txHash = e.transactionHash;
    typeName = e.args?.[0]?.toLowerCase() ?? 'unknown';
    eventTime = parsedAux.timestamp
      ? (parsedAux.timestamp as number) * 1000
      : Date.now();
  }

  if (!txHash) return null;
 // console.log(parsedAux);
  return {
    id: `${blockchain}-${txHash}-${typeName}-${eventTime}-${index}`,
    txHash,
    blockchain,
    category: '',
    type: typeName,
    time: eventTime,
    aux: JSON.stringify(parsedAux),
  };
}

// --- CURSOR FUNCTIONS ---
export async function getSavedCursor(blockchain: Blockchain, category: string): Promise<string | null> {
  const { stmts } = await getDb();
  const row = stmts.getCursor.get({ $id: `${blockchain}:${category}` }) as { cursor: string } | null;
  return row?.cursor ?? null;
}

export async function updateSavedCursor(blockchain: Blockchain, category: string, cursor: unknown): Promise<void> {
  if (!cursor) return;
  const { stmts } = await getDb();
    stmts.updateCursor.run({
    $id:     `${blockchain}:${category}`,
    $cursor: typeof cursor === 'object' ? JSON.stringify(cursor) : String(cursor),
    });
}

// --- STORE EVENTS ---
export async function store_db(
  blockchain: Blockchain,
  category: string,
  events: unknown[],
  cursor?: unknown
): Promise<void> {
  if (!events.length) return;
  if (cursor) await updateSavedCursor(blockchain, category, cursor);
  
  const { db, stmts } = await getDb();

  const rows = events
    .map((item, i) => parseEvent(blockchain, item as RawEvent, i))
    .filter((row): row is DbRow => row !== null)
    .map(row => ({ ...row, category }));

  //console.log(`[DB] Inserting ${rows.length} rows for ${blockchain}:${category}`);
  //console.log(`[DB] DB file:`, db.filename); // ✅ shows actual path
  
    const insertMany = db.transaction((data: DbRow[]) => {
    for (const row of data) {
        stmts.insertEvent.run({
        $id:         row.id,
        $txHash:     row.txHash,
        $blockchain: row.blockchain,
        $category:   row.category,
        $type:       row.type,
        $aux:        row.aux,
        $time:       row.time,
        });
    }
    });

  insertMany(rows);
  //console.log(`[DB] Done inserting`); // ✅ confirms transaction completed
}

export async function getCategories(): Promise<string[]> {
  const { db } = await getDb();
  const rows = db.prepare(
    'SELECT DISTINCT category FROM events WHERE category IS NOT NULL'
  ).all() as { category: string }[];
  return rows.map(row => row.category);
}

export async function getEventTypes(): Promise<string[]> {
  const { db } = await getDb();
  const rows = db.prepare(
    'SELECT DISTINCT type FROM events WHERE type IS NOT NULL'
  ).all() as { type: string }[];
  return rows.map(row => row.type);
}

export async function getBlockchains(): Promise<string[]> {
  const { db } = await getDb();
  const count = db.prepare('SELECT COUNT(*) as n FROM events').get() as { n: number };
  console.log("[DB] Total events:", count.n);  // ← add this
  const rows = db.prepare(
    'SELECT DISTINCT blockchain FROM events WHERE blockchain IS NOT NULL'
  ).all() as { blockchain: string }[];
  return rows.map(row => row.blockchain);
}

export async function getAllEvents(
  limit = 50,
  offset = 0,
  category: string | null = null,
  blockchain: string | null = null,
  type: string | null = null,
  asset: string | null = null
): Promise<{ events: Record<string, EventRow[]>; totalCount: number }> {
  const { db } = await getDb();

  let dataQuery  = `SELECT * FROM events`;
  let countQuery = `SELECT COUNT(*) as total FROM events`;
  const whereClauses: string[] = [];
  const params: unknown[] = [];

  if (category)               { whereClauses.push(`category = ?`);   params.push(category); }
  if (blockchain)             { whereClauses.push(`blockchain = ?`);  params.push(blockchain); }
  if (type)                   { whereClauses.push(`type = ?`);        params.push(type); }
  if (asset && asset !== "null") {
    whereClauses.push(`LOWER(json_extract(json(aux), '$.asset')) = LOWER(?)`);
    params.push(asset);
  }

  if (whereClauses.length > 0) {
    const filter = ` WHERE ` + whereClauses.join(" AND ");
    dataQuery  += filter;
    countQuery += filter;
  }

const countResult = db.prepare(countQuery).get(...params as SQLQueryBindings[]) as { total: number } | null;
  const totalCount  = countResult?.total ?? 0;

  dataQuery += ` ORDER BY CAST(time AS INTEGER) DESC LIMIT ? OFFSET ?`;
  const dataParams = [...params, limit, offset];

const rows = db.prepare(dataQuery).all(...dataParams as SQLQueryBindings[]) as DbRow[];

  const events = rows.reduce<Record<string, EventRow[]>>((acc, row) => {
    const key = row.category.includes(":")
      ? row.category.split(":")[1]
      : row.category;

    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...row, aux: JSON.parse(row.aux) });
    return acc;
  }, {});

  return { events, totalCount };
}

export async function getSharedEvents(
  shared: string,
  limit = 50,
  offset = 0,
  category: string | null = null,
  blockchain: string | null = null,
  type: string | null = null,
): Promise<{ events: Record<string, EventRow[]>; totalCount: number }> {
  const { db } = await getDb();

  let dataQuery  = `SELECT * FROM events`;
  let countQuery = `SELECT COUNT(*) as total FROM events`;
  const whereClauses: string[] = [];
  const params: unknown[] = [];

  // always filter by shared storage name inside aux JSON
  whereClauses.push(`LOWER(json_extract(json(aux), '$.shared')) = LOWER(?)`);
  params.push(shared);

  if (category)   { whereClauses.push(`category = ?`);  params.push(category); }
  if (blockchain) { whereClauses.push(`blockchain = ?`); params.push(blockchain); }
  if (type)       { whereClauses.push(`type = ?`);       params.push(type); }

  const filter = ` WHERE ` + whereClauses.join(" AND ");
  dataQuery  += filter;
  countQuery += filter;

  const countResult = db.prepare(countQuery).get(...params as SQLQueryBindings[]) as { total: number } | null;
  const totalCount  = countResult?.total ?? 0;

  dataQuery += ` ORDER BY CAST(time AS INTEGER) DESC LIMIT ? OFFSET ?`;
  const dataParams = [...params, limit, offset];

  const rows = db.prepare(dataQuery).all(...dataParams as SQLQueryBindings[]) as DbRow[];

  const events = rows.reduce<Record<string, EventRow[]>>((acc, row) => {
    const key = row.category.includes(":")
      ? row.category.split(":")[1]
      : row.category;

    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...row, aux: JSON.parse(row.aux) });
    return acc;
  }, {});

  return { events, totalCount };
}

export type EventRow = Omit<DbRow, "aux"> & {
  aux: Record<string, unknown>;
};
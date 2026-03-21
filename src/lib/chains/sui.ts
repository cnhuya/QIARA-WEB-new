type FetchResult<T> = {
  data: T | null;
  cursor: string | null;
};

type SuiEventOptions = {
  cursor?: string | null;
  limit?: number;
  descending?: boolean;
};

// --- SUI ---
type SuiRpcResponse = {
  result: {
    data: unknown[];
    nextCursor: string | null;
    hasNextPage: boolean;
  };
};

export async function fetchSuiEvents(
  fullEventPath: string,
  options: SuiEventOptions = {}
): Promise<FetchResult<unknown[]>> {
  const { cursor = null, limit = 100, descending = true } = options;

  try {
    const response = await fetch("https://fullnode.testnet.sui.io:443", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "suix_queryEvents",
        params: [{ MoveEventType: fullEventPath }, cursor, limit, descending],
      }),
    });

    const result = await response.json() as SuiRpcResponse;
    const { data, nextCursor, hasNextPage } = result.result;

    return {
      data,
      cursor: hasNextPage ? nextCursor : null,
    };

  } catch (err) {
    console.error("Error fetching Sui events:", err);
    return { data: null, cursor: null };
  }
}

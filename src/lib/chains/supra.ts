import { getConfig } from "../extractor";

type FetchRPCOptions = {
  signal?: AbortSignal;
};

export async function fetchRPC(
  function_name: string,
  type_args: string[] = [],
  args: unknown[] = [],
  options: FetchRPCOptions = {}
): Promise<unknown[] | null> {
  const { signal } = options;

  try {
    const response = await fetch("https://rpc-testnet.supra.com/rpc/v1/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        function: function_name,
        type_arguments: type_args,
        arguments: args,
      }),
      signal,
    });

    const data = await response.json();
    console.log(`Response from ${function_name}:`, data);
    return data.result;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return null;
    console.error("Error fetching data:", err);
    return null;
  }
}

type AuxType = 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'bool' | 'string' | 'address' | string;

type AuxItem = {
  name: string;
  type?: AuxType;
  type_name?: AuxType;
  value?: string | number[];
};

type ParsedAux = Record<string, string>;

export function parseSupraEventAux(auxArray: unknown): Record<string, unknown> | null {
  if (!Array.isArray(auxArray)) return null; // ✅ was returning unknown input as-is

  const readable: Record<string, unknown> = {};

  for (const item of auxArray as AuxItem[]) {
    const type = item.type_name ?? item.type;
    readable[item.name] = formatValue(item.value, type);
  }

  return readable;
}

export function formatValue(value: string | number[] | undefined | null, type: AuxType | undefined): string {
  if (value === undefined || value === null) return "—";

  let bytes: Uint8Array;

  if (typeof value === 'string') {
    const cleanHex = value.startsWith('0x') ? value.slice(2) : value;
    const pairs = cleanHex.match(/.{1,2}/g) ?? [];
    bytes = new Uint8Array(pairs.map(byte => parseInt(byte, 16)));
  } else {
    bytes = new Uint8Array(value);
  }

  try {
    switch (type) {
      case 'u8':
      case 'u16':
      case 'u32':
      case 'u64':
      case 'u128':
      case 'u256':
        return decodeLittleEndian(bytes);

      case 'bool':
        return bytes[0] === 1 ? 'true' : 'false';

      case 'string':
        return new TextDecoder().decode(bytes).replace(/^[\x00-\x1F\x7F]+/, '');

      case 'address':
        return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;

      default:
        return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    }
  } catch {
    return String(value);
  }
}

export function decodeLittleEndian(bytes: Uint8Array): string {
  let result = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    result = (result << 8n) + BigInt(bytes[i]);
  }
  return result.toString();
}


type SupraResponse = {
  data: unknown[];
};
type FetchResult<T> = {
  data: T | null;
  cursor: string | null;
};

type SupraEventOptions = {
  start_height?: number;
  end_height?: number;
  limit?: number;
  start?: string;
};

export async function fetchSupraEvents(
  event_type: string | { event: string },
  options: SupraEventOptions = {}
): Promise<FetchResult<unknown[]>> {
  const { start_height, end_height, limit = 100, start } = options;

  try {
    const queryParams = new URLSearchParams();

    if (start) {
      queryParams.append("start", start);
    } else if (start_height && start_height > 0) {
      queryParams.append("start_height", String(start_height));
    }

    if (end_height) queryParams.append("end_height", String(end_height));
    if (limit)      queryParams.append("limit", String(limit));

    const typeStr = typeof event_type === 'object' ? event_type.event : event_type;
    const url = `https://rpc-testnet.supra.com/rpc/v3/events/${typeStr}?${queryParams.toString()}`;

    console.log("Fetching:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status} for URL: ${url}`);
      return { data: null, cursor: null };
    }

    const cursor =
      response.headers.get("x-supra-cursor") ??
      response.headers.get("x_supra_cursor");

    const json = await response.json() as { data?: unknown[] };
    const data = json.data ?? []; // ✅ return the whole array, not [0]
    return { data, cursor };

  } catch (err) {
    console.error("Error fetching Supra events:", err);
    return { data: null, cursor: null };
  }
}
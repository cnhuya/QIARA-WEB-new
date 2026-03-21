import { ethers } from "ethers";
import { getConfig } from "../extractor";

const abiCoder = new ethers.AbiCoder();

// --- TYPES ---
type EvmAuxItem =
  | { name: string; typeName?: string; type?: string; value?: string }
  | [string, string, string];

type ParsedEvmAux = Record<string, string>;

type SolidityType = 'address' | 'uint256' | 'string' | 'bytes' | 'bool' | string;

const TYPE_ALIASES: Record<string, SolidityType> = {
  u256: 'uint256',
  uint: 'uint256',
  timestamp: 'uint256',
};

// --- PARSERS ---
export function parseEvmEventAux(auxArray: unknown): Record<string, unknown> | null {
  if (!Array.isArray(auxArray)) return null;

  const readable: ParsedEvmAux = {};

  for (const item of auxArray as EvmAuxItem[]) {
    const name  = Array.isArray(item) ? item[0] : item.name;
    const type  = Array.isArray(item) ? item[1] : (item.typeName ?? item.type ?? '');
    const value = Array.isArray(item) ? item[2] : (item.value ?? '');

    readable[name] = formatEvmValue(value, type);
  }

  return readable;
}

function formatEvmValue(hexValue: string | undefined, type: string): string {
  if (!hexValue || hexValue === '0x') return '—';

  try {
    const normalized: SolidityType = TYPE_ALIASES[type.toLowerCase()] ?? type.toLowerCase();

    switch (normalized) {
      case 'address':
        return abiCoder.decode(['address'], hexValue)[0] as string;

      case 'uint256':
        return (abiCoder.decode(['uint256'], hexValue)[0] as bigint).toString();

      case 'string':
      case 'bytes':
        return abiCoder.decode([normalized], hexValue)[0] as string;

      case 'bool':
        return (abiCoder.decode(['bool'], hexValue)[0] as boolean) ? 'true' : 'false';

      default:
        return hexValue;
    }
  } catch (e) {
    console.error(`EVM decoding error (${type}):`, e);
    return hexValue;
  }
}

type EvmEventOptions = {
  limitBlocks?: number;
};

type EvmDecodedEvent = {
  args: ethers.Result;
  name: string;
  transactionHash: string;
  blockNumber: number;
  address: string;
  topics: ReadonlyArray<string>; // ✅ was string[]
  data: string;
};


// --- EVM ---
export async function fetchEvmEvents(
  blockchain: string,
  contractAddress: string,
  eventSignature: string,
  options: EvmEventOptions = {}
): Promise<{ data: EvmDecodedEvent[] }> {
  const { limitBlocks = 100 } = options;

  try {
    const config = getConfig() as unknown as Record<string, string>;
    const rpcUrl = config[`${blockchain.toUpperCase()}_RPC`];

    if (!rpcUrl) throw new Error(`No RPC URL configured for ${blockchain}`);

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = latestBlock - limitBlocks;

    const cleanSignature = eventSignature.startsWith('event ')
      ? eventSignature
      : `event ${eventSignature}`;

    const eventInterface = new ethers.Interface([cleanSignature]);

    const logs = await provider.getLogs({
      address: contractAddress,
      fromBlock,
      toBlock: "latest",
    });

    const decodedEvents = logs
      .map((log): EvmDecodedEvent | null => {
        try {
          const parsed = eventInterface.parseLog(log);
          if (!parsed) return null;
          return {
            ...log,
            args: parsed.args,
            name: parsed.name,
          };
        } catch {
          return null;
        }
      })
      .filter((e): e is EvmDecodedEvent => e !== null);

    return { data: decodedEvents };

  } catch (err) {
    console.error("Error fetching EVM events:", err);
    return { data: [] };
  }
}
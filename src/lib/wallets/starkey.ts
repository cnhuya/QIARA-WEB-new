
import { notify } from "../notify";

type SupraProvider = {
  createRawTransactionData: (payload: unknown[]) => Promise<string>;
  sendTransaction: (params: { data: string }) => Promise<string>;
  connect: () => Promise<string[] | string>;
  account: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
};

declare global {
  interface Window {
    starkey?: {
      supra?: SupraProvider;
    };
  }
}

type StarKeyConnectResult = {
  provider: SupraProvider | null;
  account: string | null;
};

type SendTxArgs = {
  account: string;
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  type_args?: unknown[];
  args?: unknown[];
};

const getProvider = (): SupraProvider => {
  const provider = window.starkey?.supra;
  if (!provider) throw new Error("Provider not found");
  return provider;
};

export async function connectWithStarKey(
  chain: string,
  onConnect: (account: string, chain: string, type: string, provider: SupraProvider) => void
): Promise<StarKeyConnectResult> {
  if (typeof window === "undefined") return { provider: null, account: null };

  if (!window.starkey?.supra) {
    console.warn("Starkey not installed! Opening website...");
    notify("warning", "Wallet Not Found", "Starkey is not installed. Redirecting to starkey.app...");
    setTimeout(() => window.open("https://starkey.app/", "_blank"), 1500);
    return { provider: null, account: null };
  }

  const provider = window.starkey.supra;

  try {
    const accounts = await provider.connect();
    const account = Array.isArray(accounts) ? accounts[0] : accounts;

    if (!account) {
      notify("warning", "No Account", "No Starkey account found. Connection aborted.");
      return { provider, account: null };
    }

    onConnect(account, chain, "starkey", provider);
    notify("success", "Connected", `Connected with ${account.slice(0, 6)}...${account.slice(-4)}`);
    return { provider, account };
  } catch (err) {
    notify("error", "Connection Failed", `${err instanceof Error ? err.message : "Unknown error"}`);
    return { provider: null, account: null };
  }
}

export const send_tx = async ({
  account,
  moduleAddress,
  moduleName,
  functionName,
  type_args = [],
  args = [],
}: SendTxArgs): Promise<string> => {
  const provider = getProvider();

  const rawTxPayload: unknown[] = [
    account,
    0,
    moduleAddress,
    moduleName,
    functionName,
    type_args,
    args,
    {},
  ];

  const timeout = (ms: number): Promise<never> =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    );

  try {
    const data = await Promise.race([
      provider.createRawTransactionData(rawTxPayload),
      timeout(5000),
    ]);

    if (!data) throw new Error("Failed to create raw transaction data");

    const txHash = await provider.sendTransaction({ data });
    notify("success", "Transaction Sent", `Hash: ${txHash.slice(0, 10)}...`);
    return txHash;
  } catch (err) {
    notify("error", "Transaction Failed", `${err instanceof Error ? err.message : "Unknown error"}`);
    throw err;
  }
};
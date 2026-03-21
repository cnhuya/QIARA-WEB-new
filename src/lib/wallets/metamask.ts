type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type ConnectResult = {
  account: string | null;
  connected: boolean;
};

export async function connectWithMetaMask(
  chain: string,
  onConnect: (account: string, chain: string, provider: EthereumProvider) => void
): Promise<ConnectResult> {
  if (typeof window === "undefined" || !window.ethereum) {
    window?.open("https://metamask.io/download.html", "_blank");
    return { account: null, connected: false };
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    }) as string[];

    const account = accounts[0];
    if (!account) return { account: null, connected: false };

    onConnect(account, chain, window.ethereum);

    return { account, connected: true };
  } catch (err) {
    console.error("Metamask connection failed:", err);
    return { account: null, connected: false };
  }
}
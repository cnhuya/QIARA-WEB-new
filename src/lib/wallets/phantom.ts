type PhantomSuiProvider = {
  isPhantom: boolean;
  requestAccount: () => Promise<{ address: string } | null>;
};

declare global {
  interface Window {
    phantom?: {
      sui?: PhantomSuiProvider;
    };
  }
}

type PhantomConnectResult = {
  provider: PhantomSuiProvider | null;
  account: string | null;
};

export async function connectWithPhantomSui(
  chain: string,
  onConnect: (account: string, chain: string, provider: PhantomSuiProvider) => void
): Promise<PhantomConnectResult> {
  if (typeof window === "undefined") return { provider: null, account: null };

  const provider = window.phantom?.sui;
  if (!provider?.isPhantom) {
    console.warn("Phantom Sui not available! Opening website...");
    window.open("https://phantom.com/", "_blank");
    return { provider: null, account: null };
  }

  try {
    const resp = await provider.requestAccount();
    const account = resp?.address;

    if (!account) {
      console.warn("No Phantom account available. Connection aborted.");
      return { provider, account: null };
    }

    onConnect(account, chain, provider);

    return { provider, account };
  } catch (err) {
    console.error("Phantom connection failed:", err);
    return { provider: null, account: null };
  }
}
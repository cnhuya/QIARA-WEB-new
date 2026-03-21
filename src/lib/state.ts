import { createSignal } from "solid-js";

export type Chain = "supra" | "sui" | "base" | "ethereum" | "monad";
export type WalletKey = "starkey" | "metamask" | "phantom" | "slush";

export type ConnectedWallet = {
  chain: Chain;
  wallet: WalletKey;
  account: string;
};

// Per-chain connections: { supra: { wallet: "starkey", account: "0x..." }, ... }
const [connections, setConnections] = createSignal<Partial<Record<Chain, { wallet: WalletKey; account: string }>>>({});

export const getConnection = (chain: Chain) => connections()[chain] ?? null;
export const getAllConnections = () => connections();

export const setConnection = (chain: Chain, wallet: WalletKey, account: string) => {
  setConnections(prev => ({ ...prev, [chain]: { wallet, account } }));
  sessionStorage.setItem(`connected_${chain}`, JSON.stringify({ wallet, account }));
};

export const clearConnection = (chain: Chain) => {
  setConnections(prev => { const next = { ...prev }; delete next[chain]; return next; });
  sessionStorage.removeItem(`connected_${chain}`);
};

// Load from sessionStorage on init
const loadConnections = () => {
  const chains: Chain[] = ["supra", "sui", "base", "ethereum", "monad"];
  const loaded: Partial<Record<Chain, { wallet: WalletKey; account: string }>> = {};
  for (const chain of chains) {
    try {
      const raw = sessionStorage.getItem(`connected_${chain}`);
      if (raw) loaded[chain] = JSON.parse(raw);
    } catch {}
  }
  setConnections(loaded);
};

if (typeof window !== "undefined") loadConnections();

// Active shared panel
export const [activeShared, setActiveShared] = createSignal<string>("Shared");
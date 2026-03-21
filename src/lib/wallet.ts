import { connectWithMetaMask } from "./wallets/metamask";
import { connectWithPhantomSui } from "./wallets/phantom";
import { connectWithStarKey, send_tx as starkeySendTx } from "./wallets/starkey";
import { notify } from "./notify";
type WalletConnectCallback = (account: string, chain: string, provider: unknown) => void;

type WalletDefinition = {
  name: string;
  icon: string;
  website: string;
  chrome: string;
  connect?: (chain: string, onConnect: WalletConnectCallback) => Promise<{ account: string | null }>;
};

type ChainWallets = Record<string, WalletDefinition>;
type WalletDefinitions = Record<string, ChainWallets>;

export const walletDefinitions: WalletDefinitions = {
  supra: {
    starkey: {
      name: "Starkey",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/starkey.webp",
      website: "https://starkey.app",
      chrome: "https://chromewebstore.google.com/detail/starkey-wallet-the-offici/hcjhpkgbmechpabifbggldplacolbkoh",
      connect: (chain, onConnect) => connectWithStarKey(chain, onConnect as Parameters<typeof connectWithStarKey>[1]),
    },
  },
  base: {
    metamask: {
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/metamask.webp",
      website: "https://metamask.io",
      chrome: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      connect: (chain, onConnect) => connectWithMetaMask(chain, onConnect as Parameters<typeof connectWithMetaMask>[1]),
    },
  },
  monad: {
    metamask: {
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/metamask.webp",
      website: "https://metamask.io",
      chrome: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      connect: (chain, onConnect) => connectWithMetaMask(chain, onConnect as Parameters<typeof connectWithMetaMask>[1]),
    },
  },
  ethereum: {
    metamask: {
      name: "MetaMask",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/metamask.webp",
      website: "https://metamask.io",
      chrome: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      connect: (chain, onConnect) => connectWithMetaMask(chain, onConnect as Parameters<typeof connectWithMetaMask>[1]),
    },
  },
  sui: {
    slush: {
      name: "Slush",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/slush.webp",
      website: "https://slush.app",
      chrome: "https://chromewebstore.google.com/detail/slush-—-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
    },
    phantom: {
      name: "Phantom",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/phantom.webp",
      website: "https://phantom.app",
      chrome: "https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
      connect: (chain, onConnect) => connectWithPhantomSui(chain, onConnect as Parameters<typeof connectWithPhantomSui>[1]),
    },
  },
};

export async function connectWallet(
  chain: string,
  walletKey: string,
  onUserConnected: (account: string) => void,
  onHighlight?: (chain: string, walletKey: string) => void,
): Promise<string | null> {
  const walletDef = walletDefinitions[chain]?.[walletKey];
  if (!walletDef?.connect) return null;

  console.log(`Connecting to ${walletKey} on ${chain}...`);

  try {
    const result = await walletDef.connect(chain, (account, connectedChain, provider) => {
      console.log(`Connected: ${account} on ${connectedChain}`, provider);
    });

    if (!result.account) return null;

    onHighlight?.(chain, walletKey);
    onUserConnected(result.account);

    return result.account;
  } catch (err) {
    console.error(`${walletDef.name} connection error:`, err);
    return null;
  }
}


export const shortenString = (str: string, start = 4, end = 4): string =>
  str.length <= start + end ? str : `${str.slice(0, start)}...${str.slice(-end)}`;

type Chain = "supra" | "base";
type Provider = "starkey" | "metamask";

export type SendTxArgs = {
  account: string;
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  type_args?: unknown[];
  args?: unknown[];
};

export async function sendTx(
  chain: Chain,
  provider: Provider,
  txArgs: SendTxArgs
): Promise<string | null> {
  let result: string | null = null;

  if (chain === "supra" && provider === "starkey") {
    result = await starkeySendTx(txArgs);
  } else if (chain === "base" && provider === "metamask") {
    // const { send_tx } = await import("~/wallets/metamask");
    // result = await send_tx(txArgs);
  }

  if (result) {
    notify("success", "Transaction Sent Successfully",
      `Transaction sent: ${shortenString(result, 3, 3)}`
    );
  } else {
    notify("error", "Declined", "You have declined the transaction submit request.");
  }

  return result;
}
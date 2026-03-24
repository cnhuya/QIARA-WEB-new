import { Bg } from "./Bg";
import { Button } from "./Button";
import { JSX, createSignal, For, Show } from "solid-js";
import { connectWithMetaMask } from "../lib/wallets/metamask";
import { connectWithPhantomSui } from "../lib/wallets/phantom";
import { connectWithPetra } from "../lib/wallets/petra";
import { Dropdown } from "./Dropdown";
import { WalletKey } from "~/lib/state";
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
  aptos: {
    petra: {
      name: "Petra",
      icon: "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/petra.webp",
      website: "https://petra.app",
      chrome: "https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=encategory=extensions",
      connect: (chain, onConnect) => connectWithPetra(chain, onConnect as Parameters<typeof connectWithPetra>[1]),
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

const chainItems = Object.keys(walletDefinitions).map(chain => ({
  value: chain,
  label: chain.charAt(0).toUpperCase() + chain.slice(1),
  iconPath: "chains",
  iconType: "webp",
}));

export async function connectWallet(
  chain: string,
  walletKey: string,
  onUserConnected: (account: string) => void,
  onHighlight?: (chain: string, walletKey: string) => void,
): Promise<string | null> {
  const walletDef = walletDefinitions[chain]?.[walletKey];
  if (!walletDef?.connect) return null;

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

// --- DynamicWallets ---

type DynamicWalletsProps = {
  chain: string;
  onConnected: (account: string, wallet: WalletKey) => void;
};

export function DynamicWallets(props: DynamicWalletsProps) {
  const wallets = () => Object.entries(walletDefinitions[props.chain] ?? {});

  return (
    <div class="column" style="width:100%; gap: var(--gap25);">
      <For each={wallets()}>
        {([key, wallet]) => {
          const [connected, setConnected] = createSignal(false);
          const [loading,   setLoading]   = createSignal(false);

        const handleConnect = async () => {
          if (!wallet.connect) {
            window.open(wallet.chrome, "_blank");
            return;
          }
          setLoading(true);
          const account = await connectWallet(
            props.chain,
            key as WalletKey,
            (acc) => {
              setConnected(true);
              props.onConnected(acc, key as WalletKey);
            },
          );
          if (account) {
            setConnected(true);
            props.onConnected(account, key as WalletKey);
          } else {
            setConnected(false);
          }
          setLoading(false);
        };

          return (
            <div
              class={`row hover border width ${connected() ? "active" : ""}`}
              style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50); cursor: pointer;"
              onClick={handleConnect}
            >
              <img
                src={wallet.icon}
                alt={wallet.name}
                style="width:1.5rem; height:1.5rem; border-radius: 30%;"
              />
              <div class="column" style="gap: 0.1rem;">
                <p style="text-align:left; font-weight:600;">{wallet.name}</p>
                <p style="text-align:left; font-size:0.7rem; opacity:0.5;">
                  {connected() ? "Connected" : loading() ? "Connecting..." : wallet.connect ? "Click to connect" : "Not installed"}
                </p>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

// --- Wallets modal ---

type WalletsProps = {
  chain: string;
  onClose: () => void;
  onConnected: (account: string, wallet: WalletKey) => void; // add wallet here
};

export function Wallets(props: WalletsProps) {
  const [selectedChain, setSelectedChain] = createSignal(props.chain);

  return (
    <Bg
      header="Wallet Connect"
      onClose={props.onClose}
      width="20rem"
      height="auto"
      content={
        <div class="column" style="width:100%; gap: var(--gap25);">
          <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border);">
          <Dropdown
            type="blockchain"
            items={chainItems}
            defaultValue={selectedChain()}
            onSelect={(val) => setSelectedChain(val ?? chainItems[0].value)}
          />
          </div>
          <div style="padding: var(--pad25); width: 100%;">
            <DynamicWallets chain={selectedChain()} onConnected={props.onConnected} />
          </div>
        </div>
      }
    />
  );
}
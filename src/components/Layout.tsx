import { createSignal, Show, For } from "solid-js";
import { NavLink } from "./Navlink";
import { HeaderButton, HeaderButton2, Button } from "./Button";
import { Settings } from "./Settings";
import { Wallets } from "./Wallets";
import { clientOnly } from "@solidjs/start";
import { useNavigate } from "@solidjs/router";
import { isServer } from "solid-js/web";
import { truncate } from "~/lib/util";
import {
  activeShared, setActiveShared,
  getConnection, setConnection,
  Chain, WalletKey,
} from "~/lib/state";

const SharedClient = clientOnly(() => import("./Shared").then(m => ({ default: m.Shared })));

export function Header() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = createSignal(false);
  const [walletChain, setWalletChain] = createSignal<Chain | null>(null);

  // Derive account from global state for the active chain being viewed
  const supraAccount = () => getConnection("supra")?.account ?? null;

  const handleConnected = (account: string, chain: Chain, wallet: WalletKey) => {
    setConnection(chain, wallet, account);
    setWalletChain(null);
  };

  const connectedAccount = () => {
    // Show first connected account for header display
    const chain = walletChain();
    if (chain) return getConnection(chain)?.account ?? null;
    return supraAccount(); // fallback to supra as primary
  };

  return (
    <div style="gap: var(--gap25); width: 100%; padding: var(--pad25); border-bottom: var(--border);" class="header row">
      <NavLink folder="" name="icon" icon_type="webp" path="Welcome" label="" />
      <HeaderButton
        main_link={{ folder: "menu", name: "perps", icon_type: "svg", path: "perps", label: "Trade", isLink: false }}
        navlinks={[
          { folder: "menu", name: "swap",  icon_type: "svg", path: "Swap",  label: "Swap" },
          { folder: "menu", name: "perps", icon_type: "svg", path: "Perps", label: "Perpetuals" },
        ]}
      />
      <NavLink folder="menu" name="bank" icon_type="svg" path="vaults" label="Vaults" />
      <HeaderButton
        main_link={{ folder: "menu", name: "token", icon_type: "svg", path: "perps", label: "Qiara", isLink: false }}
        navlinks={[
          { folder: "menu", name: "dashboard",  icon_type: "svg", path: "dashboard",  label: "Dashboard" },
          { folder: "menu", name: "governance", icon_type: "svg", path: "governance", label: "Governance" },
          { folder: "menu", name: "config",     icon_type: "svg", path: "config",     label: "Config" },
        ]}
      />
      <HeaderButton
        main_link={{ folder: "menu", name: "build", icon_type: "svg", path: "perps", label: "Build", isLink: false }}
        navlinks={[
          { folder: "menu", name: "crosschain", icon_type: "svg", path: "Swap",  label: "Node Setup" },
          { folder: "menu", name: "CLI",        icon_type: "svg", path: "Perps", label: "CLI" },
          { folder: "menu", name: "api",        icon_type: "svg", path: "Perps", label: "Public API" },
        ]}
      />
      <HeaderButton
        main_link={{ folder: "menu", name: "participate", icon_type: "svg", path: "perps", label: "Other", isLink: false }}
        navlinks={[
          { folder: "menu", name: "contact",        icon_type: "svg", path: "Swap",     label: "Contact Us" },
          { folder: "menu", name: "dolar",          icon_type: "svg", path: "Perps",    label: "Get Paid" },
          { folder: "menu", name: "join_us",        icon_type: "svg", path: "Perps",    label: "Join Us" },
          { folder: "menu", name: "protocol_stats", icon_type: "svg", path: "Perps",    label: "Protocol Stats" },
          { folder: "menu", name: "search",         icon_type: "svg", path: "Explorer", label: "Explorer" },
          { folder: "menu", name: "upcoming",       icon_type: "svg", path: "Perps",    label: "Roadmap" },
          { folder: "menu", name: "docs",           icon_type: "svg", path: "Perps",    label: "Documentation" },
        ]}
      />

      <span class="right" />

      <Show when={supraAccount()}>
        {account => (
          <SharedClient
            account={account()}
            active_shared={activeShared()}
            onSelect={setActiveShared}
          />
        )}
      </Show>

      <HeaderButton2
        class="min-width-10"
        main_button={{
          folder: "menu",
          name: "account",
          icon_type: "svg",
          label: connectedAccount() ? truncate(connectedAccount()!) : "User",
          onClick: connectedAccount()
            ? () => navigate(`/profile?address=${connectedAccount()}`)
            : undefined,
        }}
        buttons={[
          { folder: "chains", name: "supra",    icon_type: "webp", label: "Supra",    onClick: () => setWalletChain("supra")    },
          { folder: "chains", name: "sui",      icon_type: "webp", label: "Sui",      onClick: () => setWalletChain("sui")      },
          { folder: "chains", name: "base",     icon_type: "webp", label: "Base",     onClick: () => setWalletChain("base")     },
          { folder: "chains", name: "ethereum", icon_type: "webp", label: "Ethereum", onClick: () => setWalletChain("ethereum") },
          { folder: "chains", name: "monad",    icon_type: "webp", label: "Monad",    onClick: () => setWalletChain("monad")    },
          { folder: "menu",   name: "settings", icon_type: "svg",  label: "Settings", onClick: () => setShowSettings(true)      },
        ]}
      />

      <Show when={showSettings()}>
        <Settings onClose={() => setShowSettings(false)} />
      </Show>

      <Show when={walletChain()}>
        {chain => (
          <Wallets
            chain={chain()}
            onClose={() => setWalletChain(null)}
            onConnected={(account, wallet) => handleConnected(account, chain(), wallet)}
          />
        )}
      </Show>
    </div>
  );
}

export function Footer() {
  return (
    <div style="gap: var(--gap25); width: 100%; padding: var(--pad25); border-top: var(--border);" class="footer row">
      <Button folder="menu" name="participate" icon_type="svg" label="Operational" class="positive" />
      <Button folder="menu" name="faucet"      icon_type="svg" label="Faucet"      class="right"    />
      <Button folder="menu" name="gas"         icon_type="svg" label="Gas"                          />
    </div>
  );
}
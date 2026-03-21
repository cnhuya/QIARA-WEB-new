import { Title } from "@solidjs/meta";
import { Header, Footer } from "~/components/Layout";
import { Page } from "~/components/Page";
import { clientOnly } from "@solidjs/start";
import { createSignal, Show, Component } from "solid-js";
import type { ChainVaultEntry } from "~/components/vaults/Vaults";
import { sendTx } from "~/lib/wallet";
const TripleDropdown = clientOnly(() => import("~/components/TripleDropdown").then(m => ({ default: m.TripleDropdown })));
const Vaults = clientOnly(() => import("~/components/vaults/Vaults").then(m => ({
  default: m.Vaults as unknown as Component<{
    filterToken?:    () => string | null;
    filterChain?:    () => string | null;
    filterProvider?: () => string | null;
    onSelect?:       (token: string, chainEntries: ChainVaultEntry[]) => void;
  }>
})));
const SelectedVault = clientOnly(() => import("~/components/vaults/Vaults").then(m => ({ default: m.SelectedVault })));

type VaultSelection = {
  token:        string;
  chainEntries: ChainVaultEntry[];
} | null;

export default function Vault() {
  const [filterProvider, setFilterProvider] = createSignal<string | null>(null);
  const [filterChain,    setFilterChain]    = createSignal<string | null>(null);
  const [filterToken,    setFilterToken]    = createSignal<string | null>(null);
  const [selected,       setSelected]       = createSignal<VaultSelection>(null);

  const normalize = (val: string | null) => (val === "all" || val === "" ? null : val);

  return (
    <main>
      <Header />
      <Title>Qiara | Vaults</Title>
      <Page
        name="Vaults"
        description="Lend, Borrow or Stake your assets, freely across wide range of Blockchains and Protocols, all in one place."
        header="Vaults"
        content={
          <div class="panel">

            {/* Stats bar */}
            <div class="border row width" style="height: 3rem; justify-content: flex-start; padding: var(--pad25); gap: var(--gap100);">
              {[
                { label: "Available",   icon: "dolar",      value: "0" },
                { label: "Deposited",   icon: "deposit",    value: "0" },
                { label: "Borrowed",    icon: "borrow",     value: "0" },
                { label: "Staked",      icon: "stake",      value: "0" },
                { label: "Utilization", icon: "percentage", value: "0" },
              ].map(stat => (
                <div class="row" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
                  <img style="scale: 1.25" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${stat.icon}.svg`} />
                  <div class="column">
                    <h4 style="text-align: left; opacity: 0.75;">{stat.label}</h4>
                    <h4 style="text-align: left; width: 100%;">{stat.value}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div class="row width" style="height: 100%; justify-content: flex-start; padding: var(--pad25); gap: var(--gap100);">
              <div class="border column width" style="height: 100%; justify-content: flex-start;">

                {/* ── Vault list view ── */}
<div style={`${selected() ? "display: none;" : ""} height: 100%; width: 100%;`}>
                  <TripleDropdown
                    onSelect={(provider, chain, token) => {
                      setFilterProvider(normalize(provider));
                      setFilterChain(normalize(chain));
                      setFilterToken(normalize(token));
                    }}
                  />
                  <div class="row border" style="justify-content: flex-start; width: 100%; padding: 0.5rem; gap: 0;">
                    <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">Asset</h4>
                    <h4 style="width: 7rem; text-align: start;">Liquidity</h4>
                    <h4 style="min-width: 7rem; text-align: start;">Borrows</h4>
                    <h4 style="min-width: 7rem; text-align: start;">Utilization</h4>
                    <h4 style="margin-left: 5rem; min-width: 7rem; text-align: start;">Deposit Ratio</h4>
                    <h4 style="min-width: 7rem; text-align: start;">Borrow Ratio</h4>
                  </div>
                  <Vaults
                    filterProvider={filterProvider}
                    filterChain={filterChain}
                    filterToken={filterToken}
                    onSelect={(token, chainEntries) => setSelected({ token, chainEntries })}
                  />
</div>

                {/* ── Selected vault detail view ── */}
                <Show when={selected()}>
                  <div class="row" style="justify-content: flex-start; width: 100%; padding: var(--pad25);">
                    <button onClick={() => setSelected(null)}>← Go Back</button>
                  </div>
                  <SelectedVault
                    token={selected()!.token}
                    chainEntries={selected()!.chainEntries}
                  />
                </Show>
              </div>
            </div>
          </div>
        }
      />
      <Footer />
    </main>
  );
}
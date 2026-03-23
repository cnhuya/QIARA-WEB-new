import { fetchRPC } from "~/lib/chains/supra";
import { createResource, createSignal, createMemo, For, Show, JSX, } from "solid-js";
import { isServer } from "solid-js/web";
import { formatNumber } from "~/lib/util";
import { Bg } from "../Bg";
import { Button } from "../Button";
import { ActionMenu } from "./ActionMenu";
import type { ActiveTab } from "./ActionMenu";
import { D } from "../../../dist/client/_build/assets/index-yPgyhMff";
const DENOM = 1e18;
const DENOM1 = BigInt(1e9); // or 1_000_000_000_000_000_000n
type VaultData = {
  incentive: { end: string; per_second: string; start: string };
  last_update: string;
  storage: { inner: string };
  total_accumulated_interest: string;
  total_accumulated_rewards: string;
  total_borrowed: string;
  total_deposited: string;
  total_staked: string;
  virtual_borrowed: string;
  virtual_deposited: string;
  w_tracker: { amount: string; day: number; limit: string };
};

type ProviderVaultEntry = { key: string; value: VaultData };
export type ChainVaultEntry    = { key: string; value: { data: ProviderVaultEntry[] } };
type TokenVaultEntry    = { key: string; value: { data: ChainVaultEntry[] } };

type ChainData  = { tokens: string[]; vault_address: string };
type ProviderEntry = { key: string; value: ChainData };
type Provider      = { key: string; value: { data: ProviderEntry[] } };

type LinkProps = {
  filterToken?:    () => string | null;
  filterChain?:    () => string | null;
  filterProvider?: () => string | null;
  onSelect?:       (token: string, chainEntries: ChainVaultEntry[]) => void;
};


export function prepareVaults() {
  const [providers] = createResource(
    () => !isServer ? true : null,
    async () => {
      const data = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraProviderTypesV1::return_all_providers",
        [], [], {}
      ) as [{ data: Provider[] }] | null;
      return data?.[0]?.data ?? [];
    }
  );

  // Derive unique tokens from providers first
  const allTokens = createMemo(() => {
    const all = providers() ?? [];
    const tokens = new Set<string>();
    all.forEach(p => p.value.data.forEach(c => c.value.tokens.forEach(t => tokens.add(t))));
    return [...tokens];
  });

  // Now vaults depends on allTokens — re-fetches when tokens resolve
  const [vaults] = createResource(
    () => allTokens().length > 0 ? allTokens() : null,
    async (tokens) => {
      const data = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraLiquidityV2::return_vaults",
        [], [tokens], {}
      ) as [{ data: TokenVaultEntry[] }] | null;
      return data?.[0]?.data ?? [];
    }
  );

  return { vaults, providers, allTokens };
}

export function Vaults(props: LinkProps) {
 const { vaults, providers, allTokens } = prepareVaults();
  //console.log(vaults);
  // all unique tokens from providers definition

  const rows = createMemo(() => {
    const vaultData   = vaults()   ?? [];
    const tokenFilter    = props.filterToken?.();
    const chainFilter    = props.filterChain?.();
    const providerFilter = props.filterProvider?.();
    console.log(vaultData);
    return allTokens()
      .filter(token => !tokenFilter || token === tokenFilter)
      .map(token => {
        const tokenEntry = vaultData.find(v => v.key === token);
        const chains     = new Set<string>();
        const provs      = new Set<string>();
        let totalDeposited = 0n;
        let totalBorrowed  = 0n;
        let totalStaked    = 0n;
        let totalRewards   = 0n;
        let hasData        = false;

        if (tokenEntry) {
          tokenEntry.value.data
            .filter(c => !chainFilter || c.key === chainFilter)
            .forEach(chain => {
              chain.value.data
                .filter(p => !providerFilter || p.key === providerFilter)
                .forEach(provider => {
                  hasData = true;
                  chains.add(chain.key);
                  provs.add(provider.key);
                  totalDeposited += BigInt(provider.value.total_deposited);
                  totalBorrowed  += BigInt(provider.value.total_borrowed);
                  totalStaked    += BigInt(provider.value.total_staked);
                  totalRewards   += BigInt(provider.value.total_accumulated_rewards);
                });
            });
        }

        const utilization = totalDeposited > 0n
          ? Math.round(Number(totalBorrowed * 100n / totalDeposited))
          : 0;

        return {
          token,
          hasData,
          deposited:   formatNumber(String(totalDeposited / DENOM1), DENOM.toString()),
          borrowed:    formatNumber(String(totalBorrowed),  DENOM.toString()),
          staked:      formatNumber(String(totalStaked),    DENOM.toString()),
          rewards:     formatNumber(String(totalRewards),   DENOM.toString()),
          utilization,
          chains:      [...chains],
          providers:   [...provs],
        };
      })
.filter(row => {
  const chainFilter    = props.filterChain?.();
  const providerFilter = props.filterProvider?.();
  if (!chainFilter && !providerFilter) return true;

  // Check providers data to see if this token is supported on the filtered chain/provider
  const providerData = providers() ?? [];
  return providerData.some(provider => {
    if (providerFilter && provider.key !== providerFilter) return false;
    return provider.value.data.some(chain => {
      if (chainFilter && chain.key !== chainFilter) return false;
      return chain.value.tokens.includes(row.token);
    });
  });
})
  });

  return (
    <Show when={!vaults.loading && !providers.loading} fallback={<p style="padding: var(--pad25); opacity: 0.5;">Loading...</p>}>
      <For each={rows()}>
        {(row) => (
          <div
            class={`row hover ${!row.hasData ? "opacity-50" : ""}`}
            style="position: relative; justify-content: flex-start; padding: var(--pad25); border-bottom: var(--border); cursor: pointer;"
onClick={() => {
  const tokenEntry = vaults()?.find(v => v.key === row.token);
  
  // Build chainEntries from providers data (works even if vault not initialized)
  const providerData = providers() ?? [];
  
  // Find all chains that support this token, grouped by chain
  const chainMap = new Map<string, ProviderVaultEntry[]>();
  
  providerData.forEach(provider => {
    provider.value.data.forEach(chain => {
      if (chain.value.tokens.includes(row.token)) {
        if (!chainMap.has(chain.key)) chainMap.set(chain.key, []);
        
        // Use real vault data if it exists, otherwise use zeroed placeholder
        const realVaultEntry = tokenEntry?.value.data
          .find(c => c.key === chain.key)?.value.data
          .find(p => p.key === provider.key);

        chainMap.get(chain.key)!.push({
          key: provider.key,
          value: realVaultEntry?.value ?? {
            incentive: { end: "0", per_second: "0", start: "0" },
            last_update: "0",
            storage: { inner: "0" },
            total_accumulated_interest: "0",
            total_accumulated_rewards: "0",
            total_borrowed: "0",
            total_deposited: "0",
            total_staked: "0",
            virtual_borrowed: "0",
            virtual_deposited: "0",
            w_tracker: { amount: "0", day: 0, limit: "0" },
          },
        });
      }
    });
  });

  const chainEntries: ChainVaultEntry[] = [...chainMap.entries()].map(([chainKey, providerEntries]) => ({
    key: chainKey,
    value: { data: providerEntries },
  }));

  props.onSelect?.(row.token, chainEntries);
}}
          >
            {/* Token */}
            <div class="row" style="width: 8.5rem; gap: var(--gap25); justify-content: flex-start;">
              <img
                src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${row.token.toLowerCase()}.webp`}
                alt={row.token}
                style="width: 1.25rem; height: 1.25rem; border-radius: 50%;"
              />
              <p>{row.token}</p>
            </div>

            {/* Liquidity */}
            <p style="text-align: start; width: 7rem;">{row.hasData ? `${row.deposited}$` : formatNumber("0", DENOM.toString())+"$"}</p>

            {/* Borrows */}
            <p style="text-align: start;  width: 7rem;">{row.hasData ? `${row.borrowed}$` : formatNumber("0", DENOM.toString())+"$"}</p>

            {/* Utilization */}
            <div style="min-width: 7rem;">
              {row.hasData
                ? <p style="text-align: start;">{formatNumber(String(row.utilization), DENOM.toString(), 2)}%</p>
                : <p style="text-align: start;">0.00%</p>
              }
            </div>

            {/* Deposit Ratio placeholder */}
            <p style="text-align: start;  min-width: 7rem; margin-left: 5rem;">{row.hasData ? "0.00%" : "0.00%"}</p>

            {/* Borrow Ratio placeholder */}
            <p style="text-align: start; min-width: 7rem;">{row.hasData ? "0.00%" : "0.00%"}</p>
          </div>
        )}
      </For>
    </Show>
  );
}

type ProviderRowData = {
  name: string;
  liquidity: string;
  borrows: string;
  utilization: string;
  depositAPR: string;
  borrowAPR: string;
};

type ChainRowData = {
  name: string;
  liquidity: string;
  borrows: string;
  utilization: string;
  depositAPR: string;
  borrowAPR: string;
  providers: ProviderRowData[];
};

type SelectedVaultProps = {
  token:        string;
  price?:       string;
  chainEntries: ChainVaultEntry[];
};

export function SelectedVault(props: SelectedVaultProps) {
  const [openChain, setOpenChain] = createSignal<string | null>(null);
  const toggle = (chain: string) => setOpenChain(prev => prev === chain ? null : chain);
type OpenAction = { token: string; chain: string; provider: string; initialTab: ActiveTab } | null;
  const [openAction, setOpenAction] = createSignal<OpenAction>(null);
  const chainRows = createMemo(() =>
    props.chainEntries.map(chain => {
      let totalDeposited = 0n;
      let totalBorrowed  = 0n;

      chain.value.data.forEach(p => {
        totalDeposited += BigInt(p.value.total_deposited);
        totalBorrowed  += BigInt(p.value.total_borrowed);
      });

      const utilization = totalDeposited > 0n
        ? Math.round(Number(totalBorrowed * 100n / totalDeposited))
        : 0;

      return {
        name:        chain.key,
        liquidity:   formatNumber(String(totalDeposited / DENOM1), DENOM.toString()),
        borrows:     formatNumber(String(totalBorrowed / DENOM1),  DENOM.toString()),
        utilization: `${utilization}%`,
        depositAPR:  "0.00%",
        borrowAPR:   "0.00%",
        providers:   chain.value.data.map(p => {
          const dep = BigInt(p.value.total_deposited);
          const bor = BigInt(p.value.total_borrowed);
          const util = dep > 0n ? Math.round(Number(bor * 100n / dep)) : 0;
          return {
            name:        p.key,
            liquidity:   formatNumber(String(dep / DENOM1), DENOM.toString()),
            borrows:     formatNumber(String(bor / DENOM1), DENOM.toString()),
            utilization: `${util}%`,
            depositAPR:  "0.00%",
            borrowAPR:   "0.00%",
          };
        }),
      };
    })
  );

const isActiveAction = (chain: string, provider: string, tab: ActiveTab) =>
  openAction()?.chain === chain &&
  openAction()?.provider === provider &&
  openAction()?.initialTab === tab;

  return (
    <div class="column width" style="gap: 0;">

      {/* Vault Header */}
      <div class="row width border" style="height: 3rem; justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
        <img
          style="width: 1.5rem; height: 1.5rem; border-radius: 50%;"
          src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${props.token.toLowerCase()}.webp`}
          alt={props.token}
        />
        <h4>{props.token}</h4>
        <Show when={props.price}>
        <div style="margin-left: 2rem;">
          <h5 style="width: 6rem; opacity: 0.75; text-align: left;">Price</h5>
          <h5 style="width: 6rem; text-align: left;">${props.price}</h5>
        </div>
        </Show>

        <div style="margin-left: 2rem;">
          <h5 style="width: 6rem; opacity: 0.75; text-align: left;">Oracle ID</h5>
          <h5 style="width: 6rem; text-align: left;">49</h5>
        </div>

        <div>
          <h5 style="width: 6rem; opacity: 0.75; text-align: left;">Tier</h5>
          <h5 style="width: 6rem; text-align: left;">Emerald</h5>
        </div>
    
        <div>
          <h5 style="width: 6rem; opacity: 0.75; text-align: left;">Credits</h5>
          <h5 style="width: 6rem; text-align: left;">21 014 983</h5>
        </div>

        <div>
          <h5 style="width: 7rem; opacity: 0.75; text-align: left;">Circ / Total Supply</h5>
          <h5 style="width: 7rem; text-align: left;">314,97k / 314,94k</h5>
        </div>

          <div>
          <h5 style="width: 6rem; opacity: 0.75; text-align: left;">Market Cap</h5>
          <h5 style="width: 6rem; text-align: left;">$10,74M</h5>
        </div>

      </div>

{/* Column Headers */}
<div class="row width border" style=" justify-content: flex-start; padding: var(--pad50); gap: 0; margin-top : var(--gap50); margin-bottom: var(--gap50);">
  <p style="width: 10rem; text-align: start;">Chain / Provider</p>
  <p style="width: 7rem; text-align: start;">Liquidity</p>
  <p style="width: 7rem; text-align: start;">Borrows</p>
  <p style="width: 8rem; text-align: center;">Utilization</p>
  <p style="width: 8rem; text-align: center;">Deposit APR</p>
  <p style="width: 8rem; text-align: center;">Borrow APR</p>
  <p style="margin-left: auto; width: 15rem; text-align: center;">Actions</p>
</div>

      {/* Chain Rows */}
      <For each={chainRows()}>
        {(chain) => {
          const isOpen = () => openChain() === chain.name;

          return (
            <>
              {/* Chain Row */}
              <div
                class="row hover width"
                style={`justify-content: flex-start; padding: var(--pad50); cursor: pointer;`}
                onClick={() => toggle(chain.name)}
              >
                <div class="row" style="width: 10rem; gap: var(--gap25); justify-content: flex-start;">
                  <img
                    src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${chain.name.toLowerCase()}.webp`}
                    alt={chain.name}
                    style="width: 1.25rem; height: 1.25rem; border-radius: 50%;"
                  />
                  <p>{chain.name}</p>
                </div>
                <p style="width: 7rem;text-align: start;">{chain.liquidity}</p>
                <p style="width: 7rem;text-align: start ;">{chain.borrows}</p>
                <p style="width: 8rem;">{chain.utilization}</p>
                <p style="width: 8rem;">{chain.depositAPR}</p>
                <p style="width: 8rem;">{chain.borrowAPR}</p>
                {/* Chevron */}
                <div style="margin-left: auto; opacity: 0.5; transition: transform 0.2s;" >
                  {isOpen() ? "▲" : "▼"}
                </div>
              </div>
              <Show when={isOpen()}>
              <div class="width column border" style="padding: var(--pad50);">
                <For each={chain.providers}>
                  {(provider) => (
                    <div
                      class="row hover width"
                      style="justify-content: flex-start; padding: 0; height: 2.5rem; cursor: pointer;"
                    >
<div class="row" style="width: 10rem; gap: var(--gap25); justify-content: flex-start;">
                        <img
                          src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/providers/${provider.name.toLowerCase()}.webp`}
                          alt={provider.name}
                          style="width: 1.25rem; height: 1.25rem; border-radius: 50%;"
                        />
                        <p>{provider.name}</p>
                      </div>
                      {/* Two-line liquidity: token amount + USD */}
                      <div class="column" style="width: 7rem; gap: 0.1rem; align-items: flex-start;">
                        <p>{provider.liquidity}</p>
                        <p style="opacity: 0.4; font-size: 0.75rem;">{provider.liquidity}$</p>
                      </div>
                      <div class="column" style="width: 7rem; gap: 0.1rem; align-items: flex-start;">
                        <p>{provider.borrows}</p>
                        <p style="opacity: 0.4; font-size: 0.75rem;">{provider.borrows}$</p>
                      </div>
                      <p style="width: 8rem;">{provider.utilization}</p>
                      <p style="width: 8rem;">{provider.depositAPR}</p>
                      <p style="width: 8rem;">{provider.borrowAPR}</p>
                      {/* Actions */}
                      <div class="row" style="gap: var(--gap25); justify-content: flex-end; margin-left: auto; width: 15rem;">
<button
  class={isActiveAction(chain.name, provider.name, "deposit") ? "active" : ""}
  onClick={(e) => { e.stopPropagation(); setOpenAction({ token: props.token, chain: chain.name, provider: provider.name, initialTab: "deposit" }); }}
>Deposit</button>

<button
  class={isActiveAction(chain.name, provider.name, "withdraw") ? "active" : ""}
  onClick={(e) => { e.stopPropagation(); setOpenAction({ token: props.token, chain: chain.name, provider: provider.name, initialTab: "withdraw" }); }}
>Withdraw</button>

<button
  class={isActiveAction(chain.name, provider.name, "stake") ? "active" : ""}
  onClick={(e) => { e.stopPropagation(); setOpenAction({ token: props.token, chain: chain.name, provider: provider.name, initialTab: "stake" }); }}
>Stake</button>
                      </div>
                    </div>
                  )}
                </For>

              </div>
              </Show>
              {/* Provider Rows (expanded) */}
            </>
          );
        }}
      </For>
      <Show when={openAction()}>
<ActionMenu
  token={openAction()!.token}
  chain={openAction()!.chain}
  provider={openAction()!.provider}
  initialTab={openAction()!.initialTab}
  onTabChange={(tab) => setOpenAction(prev => prev ? { ...prev, initialTab: tab } : null)}
  onClose={() => setOpenAction(null)}
/>
</Show>
    </div>
  );
}

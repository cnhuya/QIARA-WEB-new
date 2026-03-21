import { createResource, createMemo, For, Show } from "solid-js";
import { fetchRPC } from "~/lib/chains/supra";
import { isServer } from "solid-js/web";
import { formatNumber } from "~/lib/util";

type ProviderBalance = {
  borrowed: string;
  deposited: string;
  interest: string;
  rewards: string;
  staked: string;
  price: string;
};

type ProviderEntry = {
  key: string; // provider name
  value: ProviderBalance;
};

type ChainEntry = {
  key: string; // chain name
  value: {
    data: ProviderEntry[];
  };
};

type AssetEntry = {
  key: string; // token name
  value: {
    data: ChainEntry[];
  };
};

type AssetsProps = {
  shared: () => string | null;
  filterToken?: () => string | null;
  filterChain?: () => string | null;
  filterProvider?: () => string | null;
};

const DENOM = 1e18;
let price = 0n;


export function Assets(props: AssetsProps) {
  const [data] = createResource(
    () => isServer ? null : props.shared() || null,
    async (shared) => {
      console.log("[Assets] fetching for:", shared);
      const result = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraMarginV1::get_user_all_balances",
        [], [shared], {}
      ) as [{ data: AssetEntry[] }] | null;
      console.log("[Assets] result:", result);
      return result?.[0]?.data ?? [];
    }
  );

const assets = createMemo(() =>
  (data() ?? [])
    .filter(asset =>
      !props.filterToken?.() || asset.key === props.filterToken()
    )
    .map(asset => {
      const chains    = new Set<string>();
      const providers = new Set<string>();
      let totalDeposited = 0n;
      let totalBorrowed  = 0n;
      let totalStaked    = 0n;
      let totalRewards   = 0n;
      let price          = 0n;  // ✅ declare here
      asset.value.data
        .filter(chain => !props.filterChain?.() || chain.key === props.filterChain())
        .forEach(chain => {
          chains.add(chain.key);
          chain.value.data
            .filter(provider => !props.filterProvider?.() || provider.key === props.filterProvider())
          .forEach(provider => {
            providers.add(provider.key);
            totalDeposited += BigInt(provider.value.deposited);
            totalBorrowed  += BigInt(provider.value.borrowed);
            totalStaked    += BigInt(provider.value.staked);
            totalRewards   += BigInt(provider.value.rewards);
            if (provider.value.price) price = BigInt(provider.value.price); // take last non-zero price
          });
        });

      return {
        token:      asset.key,
        deposited:  formatNumber(String(totalDeposited), DENOM.toString()),
        borrowed:   formatNumber(String(totalBorrowed),  DENOM.toString()),
        staked:     formatNumber(String(totalStaked),    DENOM.toString()),
        rewards:    formatNumber(String(totalRewards),   DENOM.toString()),
        price:      formatNumber(String(price),          DENOM.toString()),
        marginRatio: totalDeposited > 0n
          ? Math.round(Number((totalDeposited - totalBorrowed) * 100n / totalDeposited))
          : 100,
        chains:    [...chains],
        providers: [...providers],
      };
    })
    // ✅ hide assets with no matching chains/providers after filtering
    .filter(asset =>
      (props.filterChain?.() || props.filterProvider?.())
        ? asset.chains.length > 0 || asset.providers.length > 0
        : true
    )
);

  return (
      <Show when={!data.loading} fallback={<p style="padding: var(--pad25); opacity: 0.5;">Loading...</p>}>
        <For each={assets()}>
          {(asset) => (
            <div class="row hover width" style="justify-content: flex-start; padding: var(--pad25); border-bottom: var(--border);">
              <div class="row" style="width: 8rem; gap: var(--gap25); justify-content: flex-start;">
                <img
                  src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${asset.token.toLowerCase()}.webp`}
                  alt={asset.token}
                  style="width: 1.25rem; height: 1.25rem; border-radius: 50%;"
                />
                <p>{asset.token}</p>
              </div>
              <p style="width: 7rem; text-align: left;">{asset.price}$ </p>
              <div class="column" style="width: 7rem; align-items: flex-start;">
                <p>{asset.deposited}$</p>
                <p style="opacity: 0.5; font-size: 0.75rem;">{asset.borrowed}$</p>
              </div>
              <p style="width: 7rem; text-align: left;">{asset.marginRatio}%</p>
              <div class="row" style="width: 10rem; gap: var(--gap25); justify-content: flex-start;">
                <For each={asset.chains}>
                  {(chain) => (
                    <img
                      src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${chain.toLowerCase()}.webp`}
                      alt={chain} title={chain}
                      style="width: 1.25rem; height: 1.25rem; border-radius: 30%;"
                    />
                  )}
                </For>
              </div>
              <div class="row" style="width: 10rem; gap: var(--gap25); justify-content: flex-start;">
                <For each={asset.providers}>
                  {(provider) => (
                    <img
                      src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/providers/${provider.toLowerCase()}.webp`}
                      alt={provider} title={provider}
                      style="width: 1.25rem; height: 1.25rem; border-radius: 30%;"
                    />
                  )}
                </For>
              </div>
              <div class="row right" style="width: 10rem; gap: var(--gap25); justify-content: flex-end;">
                <button onClick={() => console.log("deposit", asset.token)}>Deposit</button>
                <button onClick={() => console.log("withdraw", asset.token)}>Withdraw</button>
                <button onClick={() => console.log("stake", asset.token)}>Stake</button>
              </div>
            </div>
          )}
        </For>
      </Show>
  );
}
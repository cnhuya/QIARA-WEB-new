import { For, createSignal } from "solid-js";
import { prepareVaults } from "~/components/vaults/Vaults";

const ecosystem = [
  { name: "Tokens",    icon: "token"  },
  { name: "Chains",    icon: "chains" },
  { name: "Providers", icon: "bank"   },
] as const;

const chains = [
  { name: "Sui", },
  { name: "Base", },
  { name: "Monad", },
  { name: "Ethereum", },
  { name: "Supra", },
] as const;

type Tab = typeof ecosystem[number]["name"];

const gridStyle = "display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; width: 100%; align-content: start;";
const itemStyle = "display: flex; flex-direction: row; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: var(--color-background-secondary); border: 0.5px solid var(--color-border); border-radius: 0.5rem; min-width: 0; overflow: hidden;";

export default function Ecosystem() {
  const { vaults, providers, allTokens } = prepareVaults();
  const [active, setActive] = createSignal<Tab>("Tokens");

  return (
    <div class="column" style="height: 100%; width: 100%; padding: 0.5rem; gap: 0.5rem;">

      {/* Tabs */}
      <div class="row" style="width: 100%; justify-content: start; gap: 0; align-items: center; border-bottom: 0.5px solid var(--color-border);">
        <For each={ecosystem}>
          {eco => (
            <button
              onClick={() => setActive(eco.name)}
              style={{
                display: "flex",
                "align-items": "center",
                gap: "0.35rem",
                opacity: active() === eco.name ? "1" : "0.4",
                "border-bottom": active() === eco.name ? "2px solid currentColor" : "2px solid transparent",
                "margin-bottom": "-0.5px",
                "border-radius": "0",
                padding: "0.4rem 0.75rem",
                "font-size": "0.8rem",
              }}
            >
              <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${eco.icon}.svg`} style="width: 0.875rem; height: 0.875rem; opacity: 0.8;" />
              {eco.name}
            </button>
          )}
        </For>
      </div>

      {/* Content */}
      <div class="border" style={`${gridStyle} flex: 1; overflow-y: auto;`}>

        {/* Tokens */}
        {active() === "Tokens" && (
          <For each={allTokens()}>
            {token => (
              <div style={itemStyle}>
                <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${token.toLowerCase()}.webp`} style="width: 1.25rem; height: 1.25rem; border-radius: 50%; flex-shrink: 0;" />
                <h4 style="font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{token}</h4>
              </div>
            )}
          </For>
        )}

        {/* Chains */}
        {active() === "Chains" && (
          <For each={chains}>
            {chain => (
              <div style={itemStyle}>
                <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${chain.name.toLowerCase()}.webp`} style="width: 1.25rem; height: 1.25rem; border-radius: 50%; flex-shrink: 0;" />
                <h4 style="font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{chain.name}</h4>
              </div>
            )}
          </For>
        )}

        {/* Providers */}
        {active() === "Providers" && (
          <For each={providers()}>
            {provider => (
              <div style={itemStyle}>
                <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/providers/${provider.key.toLowerCase()}.webp`} style="width: 1.25rem; height: 1.25rem; border-radius: 50%; flex-shrink: 0;" />
                <h4 style="font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{provider.key}</h4>
              </div>
            )}
          </For>
        )}

      </div>

    </div>
  );
}
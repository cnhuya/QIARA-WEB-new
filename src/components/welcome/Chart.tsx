import { For } from "solid-js";
import s from "../../routes/welcome0.module.css";
const series = [
  { name: "Stable",   color: "#4ade80", key: "stable"   },
  { name: "Bitcoin",  color: "#f59e0b", key: "bitcoin"  },
  { name: "Ethereum", color: "#60a5fa", key: "ethereum" },
] as const;

const categories = [
  { name: "Qiara",       stable: 99, bitcoin: 95, ethereum: 95 },
  { name: "Binance",     stable: 95, bitcoin: 95, ethereum: 85 },
  { name: "Bybit",       stable: 95, bitcoin: 90, ethereum: 85 },
  { name: "Hyperliquid", stable: 95, bitcoin: 90, ethereum: 80 },
  { name: "Lighter",     stable: 95, bitcoin: 90, ethereum: 75 },
];

const MAX = 100;
const HEIGHT = 200;

export default function ExchangeChart() {
  return (
    <div class="column" style="height: 100%; width: 100%; padding: 0.5rem; gap: 0.5rem;">

      {/* Legend */}
      <div class="row" style="height: 2rem; width: 100%; justify-content: start; gap: 1rem; align-items: center;">
        <For each={series}>
          {token => (
            <div class="row" style="gap: 0.35rem; padding: 0; height: 100%; align-items: center;">
              <span style={{ "background-color": token.color, width: "0.75rem", height: "0.75rem", "border-radius": "25%", "flex-shrink": "0" }} />
              <h4 style="margin: 0;">{token.name}</h4>
            </div>
          )}
        </For>
      </div>

      {/* Chart area */}
      <div class="column" style="flex: 1; width: 100%; gap: 0;">

{/* Bars */}
<div class="row" style={`height: ${HEIGHT}px; width: 100%; align-items: flex-end; gap: 0.5rem;`}>
  <For each={categories}>
    {(category, x) => (
      <div class={s.scrollReveal + " row" + " bar-with-label"} style={{
        flex: "1",
        height: "100%",
        "align-items": "flex-end",
        gap: "2px",
        "transition-delay": `${x() * 0.2}s`,
      }}>
        <For each={series}>
          {(token, i) => {
            const value = category[token.key];
            const barHeight = (value / MAX) * HEIGHT;
            const delay = (x() * 0.2) + (i() * 0.1);
            return (
              <div
                class={s.scrollReveal}
                style={{
                  flex: "1",
                  height: `${barHeight}px`,
                  "background-color": token.color,
                  "border-radius": "3px 3px 0 0",
                  position: "relative",
                  "transition-delay": `${delay}s`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    "font-size": "10px",
                    "white-space": "nowrap",
                    opacity: "0",
                    transition: "opacity 0.15s",
                    "pointer-events": "none",
                    "padding-bottom": "2px",
                  }}
                  class="bar-label"
                >
                  {value}%
                </span>
              </div>
            );
          }}
        </For>
      </div>
    )}
  </For>
</div>

        {/* X axis line */}
        <div style="width: 100%; height: 1px; background: var(--color-border, #e5e7eb);" />

        {/* X labels */}
        <div class="row" style="width: 100%; height: 2rem; align-items: center;">
          <For each={categories}>
            {exchange => (
              <div style="flex: 1; text-align: center;">
                <h4 style="margin: 0; font-size: 0.75rem;">{exchange.name}</h4>
              </div>
            )}
          </For>
        </div>

      </div>

      <style>{`

        .bar-label{
          color: var(--muted);
        }

        .bar-with-label:hover .bar-label {
          opacity: 1 !important;
        }
      `}</style>

    </div>
  );
} 
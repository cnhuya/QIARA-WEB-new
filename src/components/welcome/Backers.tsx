import { For } from "solid-js";

const backers = [
  { name: "Backer #1", icon: "token"  },
  { name: "Backer #2", icon: "chains" },
  { name: "Backer #3", icon: "bank"   },
  { name: "Backer #4", icon: "bank"   },
  { name: "Backer #5", icon: "bank"   },
  { name: "Backer #6", icon: "bank"   },
] as const;

export default function Backers() {
const repeated = [...backers, ...backers, ...backers, ...backers];
  return (
    <div class="column" style="height: 100%; width: 100%; padding: 0.5rem; gap: 0.5rem; overflow: hidden;">

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 16s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div style="width: 100%; overflow: hidden; position: relative;">
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3rem; background: linear-gradient(to right, var(--color-background-primary), transparent); z-index: 1; pointer-events: none;" />
        <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 3rem; background: linear-gradient(to left, var(--color-background-primary), transparent); z-index: 1; pointer-events: none;" />

        <div class="ticker-track">
          <For each={repeated}>
            {backer => (
              <div class="row" style="gap: 0.5rem; padding: 0.25rem 1.5rem; align-items: center; flex-shrink: 0;">
                <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${backer.icon}.svg`} style="width: 1.5rem; height: 1.5rem;" />
                <h4 style="margin: 0; white-space: nowrap;">{backer.name}</h4>
              </div>
            )}
          </For>
        </div>
      </div>

    </div>
  );
}
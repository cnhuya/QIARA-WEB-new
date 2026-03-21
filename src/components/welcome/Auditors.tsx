import { For } from "solid-js";

const auditors = [
  { name: "Auditer #1", icon: "token"  },
  { name: "Auditer #2", icon: "chains" },
  { name: "Auditer #3", icon: "bank"   },
  { name: "Auditer #4", icon: "bank"   },
  { name: "Auditer #5", icon: "bank"   },
  { name: "Auditer #6", icon: "bank"   },
] as const;

export default function Auditors() {
const repeated = [...auditors, ...auditors, ...auditors, ...auditors];
  return (
    <div class="column" style="height: 100%; width: 100%; padding: 0.5rem; gap: 0.5rem; overflow: hidden;">

      <style>{`
@keyframes ticker2 {
  0%   { transform: translateX(-25%); }
  100% { transform: translateX(0); }
}
        .ticker2-track {
          display: flex;
          width: max-content;
          animation: ticker2 16s linear infinite;
        }
        .ticker2-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div style="width: 100%; overflow: hidden; position: relative;">
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3rem; background: linear-gradient(to right, var(--color-background-primary), transparent); z-index: 1; pointer-events: none;" />
        <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 3rem; background: linear-gradient(to left, var(--color-background-primary), transparent); z-index: 1; pointer-events: none;" />

        <div class="ticker2-track">
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
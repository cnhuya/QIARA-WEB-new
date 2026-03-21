import { createResource, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { fetchRPC } from "~/lib/chains/supra";
import { activeShared } from "~/lib/state";

type Ownership = {
  owner: string;
  sub_owners: string[];
};

type SharedEntry = {
  key: string;
  value: unknown;
};

type RankEntry = {
  key: string;
  value: {
    custom_rank: string;
    experience: string;
    experience_to_next_level: string;
    experience_to_this_level: string;
    fee_deduction: string;
    level: string;
    ltv_increase: string;
    ownership: Ownership;
    rank: string;
    withdraval_over_limit: string;
  };
};

const RANK_CLASS: Record<string, string> = {
  Iron:     "iron",
  Bronze:   "bronze",
  Silver:   "silver",
  Gold:     "gold",
  Platinum: "platinum",
  Diamond:  "diamond",
};

type LevelProps = {
  account: () => string | null;
};

export function Level(props: LevelProps) {
  const [sharedEntries] = createResource(
    () => !isServer && props.account() ? props.account() : null,
    async (account) => {
      const data = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraSharedV1::return_shared_storages",
        [], [account], {}
      ) as [{ data: SharedEntry[] }] | null;
      return data?.[0]?.data ?? [];
    }
  );

  const [data] = createResource(
    () => {
      const shared = activeShared();
      const entries = sharedEntries();
      if (!isServer && shared && entries?.length) {
        const found = entries.find(e => e.key === shared);
        return found ? [found.key] : null;
      }
      return null;
    },
    async (keys) => {
      const result = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraRanksV1::return_multiple_shared_rank",
        [], [keys], {}
      ) as [{ data: RankEntry[] }] | null;
      return result?.[0]?.data?.[0] ?? null;
    }
  );

  return (
    <Show when={!data.loading && data()} fallback={<p style="padding: var(--pad25); opacity: 0.5;">Loading...</p>}>
      {(entry) => {
        const v = entry().value;
        const expProgress = Number(v.experience) - Number(v.experience_to_this_level);
        const expNeeded   = Number(v.experience_to_next_level) - Number(v.experience_to_this_level);
        const pct         = expNeeded > 0 ? Math.round((expProgress / expNeeded) * 100) : 0;

        return (
          <div class="column width" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
            <div class="row width" style="justify-content: flex-start; gap: var(--gap50);">
              <img
                class={RANK_CLASS[v.rank] ?? "iron"}
                src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/rank_new.svg"
                alt={v.rank}
                style="width: 1.5rem; height: 1.5rem;"
              />
              <div class="column" style="gap: 0; align-items: flex-start;">
                <h4>{entry().key}</h4>
                <p style="opacity: 0.5; font-size: 0.75rem;">
                  {v.rank}{v.custom_rank !== "None" ? ` · ${v.custom_rank}` : ""}
                </p>
              </div>
              <p class="right" style="opacity: 0.5;">Level {v.level}</p>
            </div>

            {/* Address */}
            <div class="row width" style="gap: var(--gap25); border-bottom: var(--border); padding-bottom: var(--pad25);">
              <p style="opacity: 0.5; font-size: 0.75rem;">Address</p>
              <p style="font-size: 0.8rem; margin-left: auto;">{props.account()}</p>
            </div>

            {/* XP bar */}
            <div class="column width" style="gap: var(--gap25);">
              <div class="row width" style="justify-content: space-between;">
                <p style="font-size: 0.75rem; opacity: 0.5;">Experience</p>
                <p style="font-size: 0.75rem; opacity: 0.5;">{v.experience} / {v.experience_to_next_level}</p>
              </div>
              <div style="width: 100%; height: 0.35rem; background: var(--bg-highlight, rgba(255,255,255,0.08)); border-radius: 1rem; overflow: hidden;">
                <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent, #5eead4)", "border-radius": "1rem", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Stats */}
            <div class="row width" style="justify-content: flex-start; gap: var(--gap100);">
              {[
                { label: "Fee Deduction", value: `${v.fee_deduction}%` },
                { label: "LTV Increase",  value: `${v.ltv_increase}%` },
                { label: "Over Limit",    value: `${v.withdraval_over_limit}%` },
              ].map(s => (
                <div class="column" style="gap: 0; align-items: flex-start;">
                  <p style="opacity: 0.5; font-size: 0.75rem;">{s.label}</p>
                  <p style="font-weight: 600;">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Show>
  );
}
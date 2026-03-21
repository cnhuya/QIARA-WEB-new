import { createResource, For, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { fetchRPC } from "~/lib/chains/supra";
import { truncate } from "~/lib/util";

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

type SharedProps = {
  account: () => string | null;
};

export function Shared(props: SharedProps) {
  console.log("[Shared] mounted, account:", props.account());
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
    () => !isServer && sharedEntries()?.length ? sharedEntries()!.map(e => e.key) : null,
    async (keys) => {
      const result = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraRanksV1::return_multiple_shared_rank",
        [], [keys], {}
      ) as [{ data: RankEntry[] }] | null;
      return result?.[0]?.data ?? [];
    }
  );

  return (
    <Show when={!data.loading} fallback={<p style="padding: var(--pad25); opacity: 0.5;">Loading...</p>}>
      <For each={data() ?? []}>
        {(entry) => {
          const v = entry.value;
          const expProgress = Number(v.experience) - Number(v.experience_to_this_level);
          const expNeeded   = Number(v.experience_to_next_level) - Number(v.experience_to_this_level);
          const pct         = expNeeded > 0 ? Math.round((expProgress / expNeeded) * 100) : 0;

          return (
                <div class="row border" style="width: 100%; padding: 0.5rem; gap:0">
                  <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">{entry.key}</h4>
                  <h4 class="row" style="justify-content: flex-start; width: 7rem; text-align: start">
                  <img
                    class={RANK_CLASS[v.rank] ?? "iron"}
                    src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/rank_new.svg"
                    alt={v.rank}
                    style="width: 1.5rem; height: 1.5rem;"
                    />{v.rank}</h4>
<div style="position: relative; width: 10rem; height: 1rem; background: rgba(255,255,255,0.08); border-radius: 1rem; overflow: hidden;">
  <div style={{
    width: `${pct}%`,
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
    "border-radius": "1rem",
    transition: "width 0.4s ease",
    "box-shadow": "0 0 8px rgba(139,92,246,0.6)",
  }} />
  <p style="position: absolute; left: 0.4rem; top: 50%; transform: translateY(-50%); font-size: 0.65rem; opacity: 0.9;">
    Lv.{v.level}
  </p>
  <p style="position: absolute; right: 0.4rem; top: 50%; transform: translateY(-50%); font-size: 0.65rem; opacity: 0.9;">
    {v.experience} / {v.experience_to_next_level}
  </p>
</div>
                  <h4 style="margin-left: 2rem; min-width: 7rem; text-align: start">{truncate(v.ownership.owner, 10)}</h4>
                  <h4 style="min-width: 10rem; margin-left: auto;">{v.ownership.sub_owners.length}</h4>
                </div>
          );
        }}
      </For>
    </Show>
  );
}
import { createResource, For, Show } from "solid-js";
import { fetchRPC } from "~/lib/chains/supra";
import { Button } from "./Button";
import { isServer } from "solid-js/web";

type SharedEntry = {
  key: string;
  value: {
    custom_rank: string;
    experience: string;
    experience_to_next_level: string;
    experience_to_this_level: string;
    fee_deduction: string;
    level: string;
    ltv_increase: string;
    ownership: {
      owner: string;
      sub_owners: string[];
    };
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
type LinkProps = {
  active_shared: string;
  account: string;
  onSelect: (name: string) => void;
};

export function Shared(props: LinkProps) {
  const [sharedEntries] = createResource(() => !isServer && props.account, async (account) => {
    if (!account) return null;
    const data = await fetchRPC(
      "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraSharedV1::return_shared_storages",
      [], [account], {}
    ) as [{ data: SharedEntry[] }] | null;

    return data?.[0]?.data ?? [];
  });

  // second fetch depends on first — only runs when sharedEntries is ready
  const [rankEntries] = createResource(
    () => !isServer && sharedEntries()?.length ? sharedEntries()!.map(e => e.key) : null,
    async (keys) => {
      if (!keys?.length) return null;
      const data = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraRanksV1::return_multiple_shared_rank",
        [], [keys], {}  // pass keys array directly
      ) as [{ data: SharedEntry[] }] | null;

      console.log("[Shared] rank entries:", data);
      return data?.[0]?.data ?? [];
    }
  );

  return (
    <div class="menu-button">
      <Button label={props.active_shared} onClick={() => {}} />
      <div class="menu">
        <Show when={rankEntries()} fallback={<p>Loading...</p>}>
          {(entries) => (
            <For each={entries()}>
              {(entry) => (
              <button onClick={() => props.onSelect(entry.key)}>
                <img  class={RANK_CLASS[entry.value.rank] ?? "iron"} src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/rank_new.svg" alt="Rank" />
                {entry.key}
              </button>
              )}
            </For>
          )}
        </Show>
        <button>
        <img class="positive" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/plus.svg" alt="Plus" />
          Create New
        </button>
      </div>
    </div>
  );
}
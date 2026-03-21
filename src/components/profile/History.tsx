import { createResource, For, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { capitalize, truncate } from "~/lib/util";
import type { EventRow } from "~/db/client";

type HistoryProps = {
  shared: () => string | null;
};

export function History(props: HistoryProps) {
  const [data] = createResource(
    () => isServer ? null : props.shared() || null,
    async (shared) => {
      const params = new URLSearchParams({ shared, limit: "50", offset: "0" });
      const result = await fetch(`/api/shared_events?${params}`).then(r => r.json()) as {
        events: Record<string, EventRow[]>;
        totalCount: number;
      };
      return Object.entries(result.events ?? {})
        .flatMap(([category, rows]) => rows.map(row => ({ ...row, category })))
        .sort((a, b) => b.time - a.time);
    }
  );

  return (
    <Show when={!data.loading} fallback={<p style="padding: var(--pad25); opacity: 0.5;">Loading...</p>}>
      <For each={data() ?? []}>
        {(row) => (
          <div class="row hover width" style="justify-content: flex-start; padding: var(--pad25); border-bottom: var(--border);">
            <img
              style="width: 0.8rem; height: 0.8rem; scale: 1.25; border-radius: 30%; transform: translateX(-0.15rem);"
              src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${row.blockchain.toLowerCase()}.webp`}
              alt={row.blockchain}
            />
            <p style="width: 7rem; text-align: left;">{String(row.aux.timestamp ?? "")}</p>
            <p style="width: 7rem; text-align: left;">{capitalize(row.category)}</p>
            <p style="width: 7rem; text-align: left;">{capitalize(row.type)}</p>
            <p style="margin-left: auto; width: 5rem; text-align: center;">{Object.keys(row.aux).length}</p>
            <p style="width: 7rem; text-align: center;">{truncate(row.txHash)}</p>
          </div>
        )}
      </For>
    </Show>
  );
}
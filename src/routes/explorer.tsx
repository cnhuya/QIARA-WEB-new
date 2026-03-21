import { Title } from "@solidjs/meta";
import { Header, Footer } from "~/components/Layout";
import { Page } from "~/components/Page";
import { onMount, createResource, Show, For, createSignal, createEffect } from "solid-js";
import { Dropdown } from "~/components/Dropdown";
import { useDataSource } from "~/hooks/useStream";
import { query } from "@solidjs/router";
import type { EventRow } from "~/db/client";
import { capitalize, truncate } from "~/lib/util";

const CHAIN_ICON: Record<string, { iconPath: string; iconType: string }> = {
  supra:    { iconPath: "chains", iconType: "webp" },
  sui:      { iconPath: "chains", iconType: "webp" },
  base:     { iconPath: "chains", iconType: "webp" },
  monad:    { iconPath: "chains", iconType: "webp" },
  ethereum: { iconPath: "chains", iconType: "webp" },
};

const CATEGORY_ICON: Record<string, { iconPath: string; iconType: string }> = {
  market:     { iconPath: "menu", iconType: "svg" },
  perps:      { iconPath: "menu", iconType: "svg" },
  governance: { iconPath: "menu", iconType: "svg" },
  vault:      { iconPath: "menu", iconType: "svg" },
};

type DropdownItem = { value: string; label: string; iconPath?: string; iconType?: string; };
type BuiltDropdowns = { blockchains: DropdownItem[]; categories: DropdownItem[]; eventTypes: DropdownItem[]; };

const getDropdowns = query(async (): Promise<BuiltDropdowns> => {
  "use server";
  const [blockchains, categories, eventTypes] = await Promise.all([
    fetch("http://localhost:3001/blockchains").then(r => r.json()) as Promise<string[]>,
    fetch("http://localhost:3001/categories").then(r => r.json()) as Promise<string[]>,
    fetch("http://localhost:3001/event-types").then(r => r.json()) as Promise<string[]>,
  ]);

  return {
    blockchains: blockchains.map(b => ({
      value: b, label: capitalize(b),
      ...(CHAIN_ICON[b.toLowerCase()] ?? { iconPath: "chains", iconType: "webp" }),
    })),
    categories: categories.map(c => ({
      value: c, label: capitalize(c),
      ...(CATEGORY_ICON[c.toLowerCase()] ?? { iconPath: "menu", iconType: "svg" }),
    })),
    eventTypes: eventTypes.map(t => ({
      value: t, label: capitalize(t),
      iconPath: "menu", iconType: "svg",
    })),
  };
}, "dropdowns");

export default function Explorer() {
  const [dropdowns] = createResource(() => getDropdowns());

  const [blockchain, setBlockchain] = createSignal<string | null>(null);
  const [category,   setCategory]   = createSignal<string | null>(null);
  const [eventType,  setEventType]  = createSignal<string | null>(null);

  return (
    <main>
      <Header />
      <Title>Qiara | Explorer</Title>
      <Page
        name="Explorer"
        description="Explore Any Permissioneless Transactions, Overall Statistics, and more..."
        header="Vaults"
        content={
          <div class="panel">
            <div class="border row" style="height: 3rem; justify-content: flex-start; padding: var(--pad25); gap: var(--gap100);">
              <div class="row" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
                <img style="scale: 1.25" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/transaction.svg" />
                <div class="column">
                  <h4 style="text-align: left; opacity: 0.75;">Transactions</h4>
                  <h4 style="text-align: left; width: 100%;">0</h4>
                </div>
              </div>
              <div class="row" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
                <img style="scale: 1.25" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/per_second.svg" />
                <div class="column">
                  <h4 style="text-align: left;  opacity: 0.75;">TPS</h4>
                  <h4 style="text-align: left; width: 100%;">0</h4>
                </div>
              </div>
              <div class="row" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
                <img style="scale: 1.25" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/account.svg" />
                <div class="column">
                  <h4 style="text-align: left;  opacity: 0.75;">Validators</h4>
                  <h4 style="text-align: left; width: 100%;">0</h4>
                </div>
              </div>
            </div>
            <div class="border row" style="justify-content: flex-start; padding: var(--pad25);">
              <Show when={dropdowns()}>
                {(d) => (
                  <>
                  <Dropdown type="blockchain" items={d().blockchains} onSelect={(val) => setBlockchain(val === "all" || val === "" ? null : val)} />
                  <Dropdown type="category"   items={d().categories}  onSelect={(val) => setCategory(val === "all" || val === "" ? null : val)}   />
                  <Dropdown type="type"       items={d().eventTypes}  onSelect={(val) => setEventType(val === "all" || val === "" ? null : val)} />
                  </>
                )}
              </Show>
            </div>
            <Table blockchain={blockchain} category={category} eventType={eventType} />
          </div>
        }
      />
      <Footer />
    </main>
  );
}

type TableProps = {
  blockchain: () => string | null;
  category:   () => string | null;
  eventType:  () => string | null;
};

export function Table(props: TableProps) {
  const [newIds,  setNewIds]  = createSignal(new Set<string>());
  const [allRows, setAllRows] = createSignal<(EventRow & { category: string })[]>([]);

  const { data, start } = useDataSource<{ events: Record<string, EventRow[]>; totalCount: number }>({
    type: "poll",
    fn: (signal) => {
      const params = new URLSearchParams({ limit: "50", offset: "0" });
      if (props.blockchain()) params.set("blockchain", props.blockchain()!);
      if (props.category())   params.set("category",   props.category()!);
      if (props.eventType())  params.set("type",        props.eventType()!);
      return fetch(`/api/events?${params}`, { signal }).then(r => r.json());
    },
    intervalMs: 5000,
  });

  const toRows = (d: { events: Record<string, EventRow[]> }) =>
    (Object.entries(d.events) as [string, EventRow[]][])
      .flatMap(([category, rows]) => rows.map(row => ({ ...row, category })));

  const fetchEvents = () => {
    const params = new URLSearchParams({ limit: "50", offset: "0" });
    if (props.blockchain()) params.set("blockchain", props.blockchain()!);
    if (props.category())   params.set("category",   props.category()!);
    if (props.eventType())  params.set("type",        props.eventType()!);

    fetch(`/api/events?${params}`)
      .then(r => r.json())
      .then(d => setAllRows(toRows(d)));
  };

  onMount(() => { start?.(); });

  // filter change — clear + fetch immediately
  createEffect(() => {
    props.blockchain(); props.category(); props.eventType();
    setAllRows([]);
    fetchEvents();
    start?.();
  });

  // poll update — append only new rows
  createEffect(() => {
    const d = data();
    if (!d) return;
    const incoming = toRows(d);
    if (incoming.length === 0) return;

    setAllRows(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const fresh = incoming.filter(r => !existingIds.has(r.id));
      if (fresh.length === 0) return prev;

      setNewIds(new Set<string>(fresh.map(r => r.id)));
      setTimeout(() => setNewIds(new Set<string>()), 1000);

      return [...fresh, ...prev];
    });
  });

  const TableHeader = () => (
    <div class="row width" style="justify-content:flex-start;border-bottom:var(--border);padding:var(--pad25);padding-left:1rem;">
      <h4 style="width:7rem;text-align:left">Time</h4>
      <h4 style="width:7rem;text-align:left">Category</h4>
      <h4 style="width:7rem;text-align:left">Type</h4>
      <h4 class="right" style="width:5rem;text-align:center">Aux Data</h4>
      <h4 style="width:5rem;text-align:center">Hash</h4>
    </div>
  );

  return (
    <div class="border column" style="justify-content: flex-start; height: 100%; overflow-y: auto;">
      <TableHeader />
      <For each={allRows()}>
        {(row) => (
          <div
            class={`row hover width ${newIds().has(row.id) ? "new" : ""}`}
            style="justify-content:flex-start;padding:var(--pad25);"
          >
            <img
              style="width:0.8rem; height:0.8rem; scale:1.25; border-radius:30%; transform:translateX(-0.15rem);"
              src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${row.blockchain.toLowerCase()}.webp`}
              alt={row.blockchain}
            />
            <p style="width:7rem;text-align:left">{capitalize(String(row.aux.timestamp ?? ""))}</p>
            <p style="width:7rem;text-align:left">{capitalize(row.category)}</p>
            <p style="width:7rem;text-align:left">{capitalize(row.type)}</p>
            <p class="right" style="width:5rem;text-align:center">{Object.keys(row.aux).length}</p>
            <p style="width:5rem;text-align:center">{truncate(row.txHash)}</p>
          </div>
        )}
      </For>
    </div>
  );
}
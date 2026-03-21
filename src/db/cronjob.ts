import { fetchEvmEvents } from "~/lib/chains/evm";
import { fetchSuiEvents } from "~/lib/chains/sui";
import { fetchSupraEvents } from "~/lib/chains/supra";
import { store_db, getSavedCursor, updateSavedCursor } from "./client";
import { getEventsConfig } from "~/lib/extractor";

// --- TYPES ---
type Blockchain = 'supra' | 'sui' | 'base' | 'monad';

type SupraEventDetails = string | { event: string };
type SuiEventDetails = { event: string };
type EvmEventDetails = { contract_addresses: string[]; contract_abi: string[] };
type EventDetails = SupraEventDetails | SuiEventDetails | EvmEventDetails;

type SyncResult = {
  data: unknown[] | null;
  cursor: string | number | null;
};

// --- CONFIG ---
const SYNC_INTERVAL_MS = 100_000; // ✅ 10s — tune as needed
const MAX_PARALLEL = 4;          // ✅ max concurrent chain syncs

// --- GUARDS ---
const isEvmDetails = (d: EventDetails): d is EvmEventDetails =>
  typeof d === 'object' && 'contract_addresses' in d;

const isSuiDetails = (d: EventDetails): d is SuiEventDetails =>
  typeof d === 'object' && 'event' in d;

// --- SYNC SINGLE CHAIN ---
async function syncChain(
  blockchain: Blockchain,
  category: string,
  details: EventDetails
): Promise<void> {
  const currentCursor = await getSavedCursor(blockchain, category); // ✅ await
  let result: SyncResult = { data: null, cursor: null };

    if (blockchain === 'supra') {
    result = await fetchSupraEvents(details as SupraEventDetails, {
        start: currentCursor ?? undefined,
    }); // ✅ data is already the flat array, no unwrapping needed

  } else if (blockchain === 'sui' && isSuiDetails(details)) {
    result = await fetchSuiEvents(details.event, {
      cursor: currentCursor,
    });

  } else if ((blockchain === 'base' || blockchain === 'monad') && isEvmDetails(details)) {
    const evmResult = await fetchEvmEvents(
      blockchain,
      details.contract_addresses[0],
      details.contract_abi[0].replace('event ', ''),
      { limitBlocks: 100 }
    );
    result = {
      data: evmResult.data,
      cursor: evmResult.data.at(-1)?.blockNumber ?? null,
    };
  }

  const eventsArray = result.data ?? [];
  const nextCursor = result.cursor;

   // console.log(`[Cronjob] Synced ${blockchain} ${category} with`, JSON.stringify(eventsArray, null, 2));
    console.log(`[Cronjob] Synced ${blockchain} ${category} with`, eventsArray.length, 'events');
  if (eventsArray.length > 0) {
    await store_db(blockchain, category, eventsArray, nextCursor ?? undefined); // ✅ await
  } else if (nextCursor) {
    await updateSavedCursor(blockchain, category, nextCursor); // ✅ await
  }
}

// --- BATCH RUNNER (respects MAX_PARALLEL) ---
async function runAllSyncs(): Promise<void> {
  const eventConfig = getEventsConfig() as Record<string, Record<string, EventDetails>>;

  // ✅ flatten into a list of tasks
  const tasks = Object.entries(eventConfig).flatMap(([blockchain, categories]) =>
    Object.entries(categories).map(([category, details]) => ({
      blockchain: blockchain as Blockchain,
      category,
      details,
    }))
  );

  // ✅ run in batches of MAX_PARALLEL
  for (let i = 0; i < tasks.length; i += MAX_PARALLEL) {
    const batch = tasks.slice(i, i + MAX_PARALLEL);
    await Promise.allSettled(
      batch.map(({ blockchain, category, details }) =>
        syncChain(blockchain, category, details).catch(err => {
          console.error(
            `Failed sync for ${blockchain}:${category}:`,
            err instanceof Error ? err.message : String(err)
          );
        })
      )
    );
  }
}

// --- PERIODIC RUNNER ---
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;

async function tick(): Promise<void> {
  if (running) return; // ✅ skip if previous run still in progress
  running = true;

  const start = Date.now();
  console.log(`[Cronjob] Sync started at ${new Date(start).toISOString()}`);

  try {
    await runAllSyncs();
  } finally {
    running = false;
    const elapsed = Date.now() - start;
    console.log(`[Cronjob] Sync finished in ${elapsed}ms`);
    // ✅ schedule next run after interval, not wall-clock
    syncTimer = setTimeout(tick, SYNC_INTERVAL_MS);
  }
}

export const startCronjob = (): void => {
  if (syncTimer) return; // ✅ prevent double-start
  console.log(`[Cronjob] Starting — interval ${SYNC_INTERVAL_MS}ms`);
  tick(); // run immediately, then schedule
};

export const stopCronjob = (): void => {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
    console.log("[Cronjob] Stopped");
  }
};

// ✅ keep runCronjob for one-shot manual use
export const runCronjob = runAllSyncs;
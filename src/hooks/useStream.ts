import { createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

type DataSourceOptions<T> =
  | { type: "sse"; url: string }
  | { type: "poll"; fn: (signal: AbortSignal) => Promise<T | null>; intervalMs?: number };

export function useDataSource<T extends object>(options: DataSourceOptions<T>) {
  const [data, setData] = createSignal<T | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [connected, setConnected] = createSignal(false);
  const [active, setActive] = createSignal(false);

  if (options.type === "sse") {
    // ✅ only run on client
    if (!isServer) {
      let es: EventSource;
      let retryTimeout: ReturnType<typeof setTimeout>;
      let retryDelay = 1000;

      const connect = () => {
        es = new EventSource(options.url);
        es.onopen = () => { setConnected(true); setError(null); retryDelay = 1000; };
        es.onmessage = (e) => {
          try { setData(() => JSON.parse(e.data) as T); }
          catch { setError("Failed to parse stream data"); }
        };
        es.onerror = () => {
          setConnected(false);
          setError(`Connection lost, retrying in ${retryDelay / 1000}s...`);
          es.close();
          retryTimeout = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 30000);
            connect();
          }, retryDelay);
        };
      };

      connect();
      onCleanup(() => { clearTimeout(retryTimeout); es.close(); });
    }
  } else {
    // polling is fine — fetch works on both server and client
    // but we only want to poll on the client
    if (!isServer) {
      const { fn, intervalMs = 1000 } = options;
      let controller: AbortController | null = null;
      let timeout: ReturnType<typeof setTimeout> | null = null;

      const stop = () => {
        setActive(false);
        setConnected(false);
        controller?.abort();
        if (timeout) clearTimeout(timeout);
      };

      const tick = async () => {
        controller = new AbortController();
        try {
          const result = await fn(controller.signal);
          if (result !== null) {
            setData(() => result as Exclude<T, Function>);
            setConnected(true);
            setError(null);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            setError(err.message);
            setConnected(false);
          }
        }
        if (active()) timeout = setTimeout(tick, intervalMs);
      };

      const start = () => {
        if (active()) return;
        setActive(true);
        tick();
      };

      onCleanup(stop);
      return { data, error, connected, active, start, stop };
    }
  }

  return { data, error, connected, active, start: undefined, stop: undefined };
}
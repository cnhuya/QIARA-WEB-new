import { useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { Header, Footer } from "~/components/Layout";
import { Button } from "~/components/Button";
import { useDataSource } from "~/hooks/useStream";
import { getCSSVar, formatNumber } from "~/lib/util";
import { fetchRPC } from "~/lib/chains/supra";
import { createChart, Time, LineData, IChartApi, ISeriesApi, LineSeries, ColorType } from 'lightweight-charts';
import { onMount, createEffect, createSignal, For, createMemo } from "solid-js";

type MenuButtonProps = {
  onSelect: (asset: string) => void;
  selectedAsset: string; // ✅ receive selected asset from parent
};

type AssetData = {
  prices: Record<string, number>;
  timestamp: number;
};

type ChartContainer = HTMLDivElement & {
  _chartInstance?: IChartApi;
  _seriesInstance?: ISeriesApi<"Line">;
};
type DataPoint = LineData<Time> | LineData<Time>[];

export default function Perps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const asset = () => (searchParams.asset as string) ?? "Bitcoin";

  const { data, error, connected } = useDataSource<AssetData>({type: "sse",url: "/api/stream"});
  const price = () => data()?.prices[asset()];

  // ✅ init chart after DOM is ready
  onMount(() => initChart());

  // ✅ feed new prices into chart whenever stream emits
  createEffect(() => {
    const p = price();
    const d = data();
    if (p == null || d == null) return;

    updateChartData({
      time: Math.floor(d.timestamp / 1000) as Time, // lightweight-charts uses seconds
      value: p,
    });
  });

  // ✅ reinit chart when asset changes (clear old data)
  createEffect(() => {
    asset(); // track signal
    initChart();
  });

  return (
    <main>
      <Header />
      <Title>Qiara | Perps | {asset()}</Title>

      <div class="row" style="width: 100%; height: 100%; gap: var(--gap25); padding: var(--pad25);">
        <div class="column" style="width: 85%; height: 100%; gap: var(--gap25);">

          <div class="border row" style="width: 100%; height: 7.5%; gap: var(--gap25); padding: var(--pad25);">
            <MenuButton
              selectedAsset={asset()}
              onSelect={(a) => setSearchParams({ asset: a })}
            />
            <div style="margin-left: auto; display: flex; align-items: center; gap: var(--gap25);">
              <p>{connected() ? "● Live" : "● Reconnecting..."}</p>
              {price() && <h4>${price()!.toFixed(2)}</h4>}
            </div>
          </div>

          <div id="perp_chart" class="border" style="width: 100%; height: 75%;">
            {error() && <p>{error()}</p>}
          </div>

          <div class="border column" style="width: 100%; height: 30%; justify-content: flex-start; padding: var(--pad25); gap:0;">
          <div class="row" style="width: 100%; height: 2.25rem; gap: var(--gap25); padding: var(--pad25); border-bottom: var(--border); justify-content: flex-start;">
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/positions.svg" alt="Trade"></img>
              Positions</button>
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/history.svg" alt="History"></img>
              History</button>
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/orders.svg" alt="Info"></img>
              Orders</button>
          </div>
          <Bottom type="positions" />
          </div>
        </div>

        <div class="column border" style="padding: 0rem; width: 15%; height: 100%; justify-content: flex-start;">
          <div class="row" style="width: 100%; height: 2.25rem; gap: var(--gap25); padding: var(--pad25); border-bottom: var(--border);">
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/perps.svg" alt="Trade"></img>
              Trade</button>
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/history.svg" alt="History"></img>
              History</button>
            <button>
              <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/info.svg" alt="Info"></img>
              Info</button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

type HeaderUIProps = {
  asset: string;
  price: string;
  change: string;
  volume: string;
  leverage: string;
  funding: string;
  is_positive: boolean;
};


export function HeaderUI(props: HeaderUIProps) {
  return (
    <>
      <div class="column">
        <h5 style="width: 6rem; text-align: left; opacity: 0.75;">Price</h5>
        <h5 style="width: 6rem; text-align: left;">{props.price}</h5>
      </div>
      <div class="column">
        <h5 style="width: 6rem; text-align: left; opacity: 0.75;">OI</h5>
        <h5 style="width: 6rem; text-align: left;">{props.volume}</h5>
      </div>
      <div class="column">
        <h5 style="width: 6rem; text-align: left; opacity: 0.75;">Leverage</h5>
        <h5 style="width: 6rem; text-align: left;">{props.leverage}x</h5>
      </div>
<div class="column">
  <h5 style="width: 6rem; text-align: left; opacity: 0.75;" >Funding</h5>
  <h5 style={{ width: "6rem", color: props.is_positive ? "var(--positive)" : "var(--negative)", "text-align": "left" }}>
    {props.is_positive ? "+" : "-"}{props.funding}%
  </h5>
</div>
    </>
  );
}


export function MenuButton(props: MenuButtonProps) {
  const [open, setOpen] = createSignal(false);
  let btnRef!: HTMLButtonElement;
  let menuRef!: HTMLDivElement;
  const { data, start } = useDataSource<Market[][]>({
    type: "poll",
    fn: (signal) => fetchRPC("0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraPerpsV2::get_all_markets", [], [], { signal }) as Promise<Market[][] | null>,
    intervalMs: 5000
  });


  const markets = createMemo(() =>           // ✅ cached
    (data() as Market[][] | null)?.[0] ?? []
  );

  const selectedMarket = createMemo(() =>    // ✅ cached, depends on markets + selectedAsset
    markets().find((m) => m.asset === props.selectedAsset) ?? null
  );

  const fundingDenom = createMemo(() => {    // ✅ cached, only recomputes when selectedMarket changes
    const m = selectedMarket();
    return m ? String(BigInt(m.denom) * 10n ** 19n) : "1";
  });

  onMount(() => start?.());

  const toggleMenu = () => {
    setOpen(!open());
    const rect = btnRef.getBoundingClientRect();
    menuRef.style.top = `${rect.bottom}px`;
    menuRef.style.left = `${rect.left}px`;
  };

  const selectMarket = (asset: string) => {
    props.onSelect(asset);
    setOpen(false);
  };

  return (
    <>
    <button ref={btnRef} onClick={toggleMenu}>
      <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${props.selectedAsset.toLowerCase()}.webp`} alt={props.selectedAsset}/>
      {props.selectedAsset}
    </button>

      {selectedMarket() && (
        <HeaderUI
          asset={selectedMarket()!.asset}
          price={`$${formatNumber(selectedMarket()!.price, selectedMarket()!.denom)}`}
          volume={`$${formatNumber(selectedMarket()!.oi, selectedMarket()!.denom)}`}
          change="0"
          leverage={selectedMarket()!.leverage}
          funding={formatNumber(selectedMarket()!.funding.rate, fundingDenom())}
          is_positive={selectedMarket()!.funding.is_positive}
        />
      )}

      <div
        ref={menuRef}
        style={{ display: open() ? "flex" : "none", position: "fixed", "z-index": "1000", background: "var(--bg)" }}
        class="border column"
      >
        <div class="row" style="justify-content: flex-start; border-bottom: var(--border); padding: var(--pad25);">
          <h4 style="width: 7rem; text-align: left;">Asset</h4>
          <h4 style="width: 7rem; text-align: left;">Price</h4>
          <h4 style="width: 7rem; text-align: left;">OI</h4>
          <h4 style="width: 5rem; text-align: left;">Funding</h4>
          <h4 style="width: 5rem; text-align: left;">Leverage</h4>
          <h4 style="width: 5rem; text-align: left;">L/S</h4>
        </div>

        <For each={markets()}>
          {(market) => (
            <div
              class={`row hover ${market.asset === props.selectedAsset ? "active" : ""}`}
              style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap25); cursor: pointer;"
              onClick={() => selectMarket(market.asset)}
            >
              <p class="row" style="width: 7rem; text-align: left; justify-content: flex-start; gap: var(--gap25);">
                <img
                  src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/tokens/${market.asset.toLowerCase()}.webp`}
                  alt={market.asset}
                />
                {market.asset}
              </p>
              <p style="width: 7rem; text-align: left;">${formatNumber(market.price, market.denom)}</p>
              <p style="width: 7rem; text-align: left;">${formatNumber(market.oi, market.denom)}</p>
              <p style={{ width: "5rem", "text-align": "left", color: market.funding.is_positive ? "var(--positive)" : "var(--negative)" }}>
                {market.funding.is_positive ? "+" : "-"}{formatNumber(market.funding.rate, String(BigInt(market.denom) * 10n ** 19n))}%
              </p>
              <p style="width: 5rem; text-align: left;">{market.leverage}x</p>
              <p style="width: 5rem; text-align: left;">{market.longs}/{market.shorts}</p>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

type bottomProps = {
  type: string
}
export function Bottom(props: bottomProps) {
  if(props.type === "positions") {
    return (
      <>
      <div class="column  width" style="padding: 0;">
                <div class="row width" style="justify-content: flex-start; border-bottom: var(--border); padding: var(--pad50); padding-left: var(--pad100);">
          <h4 style="width: 7rem; text-align: left;">Asset</h4>
          <h4 style="width: 7rem; text-align: left;">Price</h4>
          <h4 style="width: 7rem; text-align: left;">OI</h4>
          <h4 style="width: 5rem; text-align: left;">Funding</h4>
          <h4 style="width: 5rem; text-align: left;">Leverage</h4>
          <h4 style="width: 5rem; text-align: left;">L/S</h4>
        </div>
      </div>
      </>
    )
  } else if (props.type === "funding") {
    
  } else {
    return (
      <>
      <p>Unknown type, please select a valid type</p>
      </>
    )
  }
}
export function initChart() {
  const container = document.querySelector('#perp_chart') as ChartContainer | null;
  if (!container) return;

  container._chartInstance?.remove();

  const chart = createChart(container, {
    width: container.clientWidth,
    height: container.clientHeight - 50,
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: getCSSVar('--muted'),
    },
    grid: {
      vertLines: { color: getCSSVar('--bg-highlight') },
      horzLines: { color: getCSSVar('--bg-highlight') },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  });

  container._chartInstance = chart;
  container._seriesInstance = chart.addSeries(LineSeries);

  const resizeHandler = () => {
    chart.applyOptions({
      width: container.clientWidth,
      height: container.clientHeight - 50,
    });
  };

  window.addEventListener('resize', resizeHandler);
}

export function updateChartData(dataPoints: DataPoint) {
  const container = document.querySelector('#perp_chart') as ChartContainer | null;
  const series = container?._seriesInstance;
  if (!series || !dataPoints) return;

  if (Array.isArray(dataPoints)) {
    series.setData(dataPoints);
  } else {
    series.update(dataPoints);
  }
}
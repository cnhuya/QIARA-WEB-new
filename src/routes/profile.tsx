import { Title } from "@solidjs/meta";
import { Header, Footer } from "~/components/Layout";
import { Page } from "~/components/Page";
import { useSearchParams } from "@solidjs/router";
import { Dropdown } from "~/components/Dropdown";
import { createSignal, Show } from "solid-js";
import { Table } from "~/components/Table";
import { clientOnly } from "@solidjs/start";
import { activeShared } from "~/lib/state";
import { History } from "~/components/profile/History";
import type { Component, JSX } from "solid-js";
import { Shared } from "~/components/profile/Shared";

type TabKey = "assets" | "shared" | "orders" | "history" | "statistics" | "level";
const Assets = clientOnly(() => import("~/components/profile/Assets").then(m => ({ default: m.Assets })));
const TripleDropdown = clientOnly(() => import("~/components/TripleDropdown").then(m => ({ default: m.TripleDropdown })))
const Level       = clientOnly(() => import("~/components/profile/Level").then(m => ({ default: m.Level as unknown as Component<{ account: () => string | null }> })));
export default function Profile() {
  const [params] = useSearchParams();
  const address = () => {
    const a = params.address;
    return Array.isArray(a) ? a[0] : (a ?? "Unknown");
  };
  const [activeTab, setActiveTab] = createSignal<TabKey>("assets");
  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "assets",     label: "Assets",     icon: "token" },
    { key: "shared",     label: "Shared",     icon: "shared" },
    { key: "orders",     label: "Orders",     icon: "orders" },
    { key: "history",    label: "History",    icon: "history" },
    { key: "statistics", label: "Statistics", icon: "protocol_stats" },
    { key: "level",      label: "Level",      icon: "rank_new" },
  ];

  return (
    <main>
      <Header />
      <Title>Qiara | Profile</Title>
      <Page
        name="Profile"
        description={`View Account History, Shared Storage Administration, Overall Statistics for account ${address()}, and more...`}
        header="Vaults"
        content={
          <div class="panel">
            <div class="border row" style="height: 3rem; justify-content: flex-start; padding: var(--pad25); gap: var(--gap100);">
              {[
                { label: "Account",     icon: "transaction", value: "0" },
                { label: "Balance",     icon: "dolar",       value: "0" },
                { label: "Deposited",   icon: "deposit",     value: "0" },
                { label: "Borrowed",    icon: "borrow",      value: "0" },
                { label: "Staked",      icon: "stake",       value: "0" },
                { label: "Utilization", icon: "utilization",  value: "0" },
                { label: "Rewards",     icon: "reward",      value: "0" },
                { label: "Rank",        icon: "rank_new",    value: "Iron" },
              ].map(stat => (
                <div class="row" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap50);">
                  <img style="scale: 1.25" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${stat.icon}.svg`} />
                  <div class="column">
                    <h4 style="text-align: left; opacity: 0.75;">{stat.label}</h4>
                    <h4 style="text-align: left; width: 100%;">{stat.value}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div class="border row" style="height: 3rem; justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
              {tabs.map(tab => (
                <button
                  class={activeTab() === tab.key ? "active" : ""}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <img style="scale: 1.25" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${tab.icon}.svg`} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div class="border column" style="height: 100%; justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
            <Tab active={activeTab} address={address} selectedShared={activeShared} />
            </div>
          </div>
        }
      />
      <Footer />
    </main>
  );
}

function Tab(props: { active: () => TabKey; address: () => string; selectedShared: () => string | null }) {
  const [filterProvider, setFilterProvider] = createSignal<string | null>(null);
  const [filterChain,    setFilterChain]    = createSignal<string | null>(null);
  const [filterToken,    setFilterToken]    = createSignal<string | null>(null);
  const normalize = (val: string | null) => (val === "all" || val === "" ? null : val);

  return (
    <>
      <div style={{ display: props.active() === "assets" ? "contents" : "none" }}>
        <TripleDropdown
          account={props.address()}
          onSelect={(provider, chain, token) => {
            setFilterProvider(normalize(provider));
            setFilterChain(normalize(chain));
            setFilterToken(normalize(token));
          }}
        />
        <Table
          header={
            <div class="row border" style="width: 100%; padding: 0.5rem; gap:0">
              <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">Asset</h4>
              <h4 style="width: 7rem; text-align: start">Price</h4>
              <h4 style="min-width: 7rem; text-align: start">Balance</h4>
              <h4 style="min-width: 7rem; text-align: start">Margin Ratio</h4>
              <h4 style="min-width: 10rem; text-align: start;">Supported Chains</h4>
              <h4 style="min-width: 10rem; text-align: start;">Supported Providers</h4>
              <h4 style="min-width: 10rem; margin-left: auto;">Actions</h4>
            </div>
          }
          contentFn={() => (
            <Assets
              shared={props.selectedShared}
              filterToken={filterToken}
              filterChain={filterChain}
              filterProvider={filterProvider}
            />
          )}
        />
      </div>
<div style={{ display: props.active() === "shared" ? "flex" : "none", "flex-direction": "column", width: "100%", padding: "0.25rem", gap: "0.5rem" }}>
  <div class="row border" style="width: 100%; padding: 0.5rem; gap:0;">
    <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">Name</h4>
    <h4 style="width: 7rem; text-align: start">Rank</h4>
    <h4 style="width: 10rem; text-align: start">Level</h4>
    <h4 style="margin-left: 2rem; min-width: 7rem; text-align: start">Owner</h4>
    <h4 style="min-width: 10rem; margin-left: auto;">Sub Owners</h4>
  </div>
  <Shared account={props.address} />
</div>
      <div style={{ display: props.active() === "orders" ? "contents" : "none" }}>
      <Table
          header={
            <div class="row border" style="width: 100%; padding: 0.5rem; gap:0">
              <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">Time</h4>
              <h4 style="width: 7rem; text-align: start">Market Type</h4>
              <h4 style="min-width: 7rem; text-align: start">Asset</h4>
              <h4 style="min-width: 7rem; text-align: start">Amount</h4>
              <h4 style="min-width: 7rem; text-align: start">Price</h4>
              <h4 style="min-width: 7rem; text-align: start">Leverage</h4>
              <h4 style="min-width: 10rem; margin-left: auto;">Sub Owners</h4>
            </div>
          }
          content={(
            <div>Orders</div>
          )}
        />
      </div>
<div style={{ display: props.active() === "history" ? "flex" : "none", "flex-direction": "column", width: "100%", height: "100%", padding: "0.25rem", gap: "0.5rem", overflow: "auto" }}>
      <div class="row border" style="width: 100%; padding: 0.5rem; gap:0; justify-content:flex-start">
        <h4 style="transform: translateX(0.5rem); width: 8rem; text-align: start;">Time</h4>
        <h4 style="width: 7rem; text-align: start">Type</h4>
        <h4 style="margin-left: auto; min-width: 5rem; text-align: center">Aux Data</h4>
        <h4 style="min-width: 7rem; text-align: center">TX Hash</h4>
      </div>
      <History shared={() => props.selectedShared()} />
    </div>
      <div style={{ display: props.active() === "statistics" ? "contents" : "none" }}>
      <Table
          header={
            <div class="row border" style="width: 100%; padding: 0.5rem; gap:0">
              <h4 style="width: 8rem; text-align: start; transform: translateX(0.5rem);">Name</h4>
              <h4 style="width: 7rem; text-align: start">Rank</h4>
              <h4 style="min-width: 7rem; text-align: start">Owner</h4>
              <h4 style="min-width: 10rem; margin-left: auto;">Sub Owners</h4>
            </div>
          }
          content={(
            <div>Statistics</div>
          )}
        />
      </div>
      <div style={{ display: props.active() === "level" ? "contents" : "none" }}>

      <Level account={props.address} />
      </div>
    </>
  );
}
import { fetchRPC } from "~/lib/chains/supra";
import { createResource, createMemo } from "solid-js";
import { isServer } from "solid-js/web";
import { Dropdown } from "./Dropdown";
import { createSignal } from "solid-js";

type ChainData = {
  tokens: string[];
  vault_address: string;
};

type ProviderEntry = {
  key: string; // chain name
  value: ChainData;
};

type Provider = {
  key: string; // provider name
  value: {
    data: ProviderEntry[];
  };
};

type LinkProps = {
  account?: string | null;
  onSelect?: (provider: string | null, chain: string | null, token: string | null) => void;
};

function toDropdownItem(value: string, folder = "menu") {
  return { value, label: value, iconPath: folder, iconType: "webp" };
}

export function prepareData(account: () => string | null) {
  const [providers] = createResource(
    () => !isServer ? true : null,  // just needs to be client-sid
    async () => {
      const data = await fetchRPC(
        "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6::QiaraProviderTypesV1::return_all_providers",
        [], [], {}
      ) as [{ data: Provider[] }] | null;
      return data?.[0]?.data ?? [];
    }
  );
  return providers;
}

export function TripleDropdown(props: LinkProps) {
  const raw = prepareData(() => props.account ?? null);

  const [selectedProvider, setSelectedProvider] = createSignal<string | null>(null);
  const [selectedChain,    setSelectedChain]    = createSignal<string | null>(null);
  const [selectedToken,    setSelectedToken]    = createSignal<string | null>(null);

// all unique tokens across all providers and chains
// all unique tokens — always show all
const tokenItems = createMemo(() => {
  const all = raw() ?? [];
  const tokens = new Set<string>();
  all.forEach(p => p.value.data.forEach(c => c.value.tokens.forEach(t => tokens.add(t))));
  return [...tokens].map(t => toDropdownItem(t, "tokens"));
});

// all unique chains — always show all, not dependent on token
const chainItems = createMemo(() => {
  const all = raw() ?? [];
  const chains = new Set<string>();
  all.forEach(p => p.value.data.forEach(c => chains.add(c.key)));
  return [...chains].map(c => ({ value: c, label: c, iconPath: "chains", iconType: "webp" }));
});

// all unique providers — always show all, not dependent on chain/token
const providerItems = createMemo(() => {
  const all = raw() ?? [];
  return all.map(p => toDropdownItem(p.key, "providers"));
});

// each handler is now independent
const handleTokenSelect = (val: string | null) => {
  setSelectedToken(val);
  props.onSelect?.(selectedProvider(), selectedChain(), val);
};

const handleChainSelect = (val: string | null) => {
  setSelectedChain(val);
  props.onSelect?.(selectedProvider(), val, selectedToken());
};

const handleProviderSelect = (val: string | null) => {
  setSelectedProvider(val);
  props.onSelect?.(val, selectedChain(), selectedToken());
};
return (
    <div class="row width" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
      <Dropdown type="token"    items={tokenItems()}    onSelect={handleTokenSelect}    />
      <Dropdown type="chain"    items={chainItems()}    onSelect={handleChainSelect}    />
      <Dropdown type="provider" items={providerItems()} onSelect={handleProviderSelect} />
    </div>
  );
}

export function TripleDropdown2(props: LinkProps) {
  const raw = prepareData(() => props.account ?? null);

  const [selectedProvider, setSelectedProvider] = createSignal<string | null>(null);
  const [selectedChain,    setSelectedChain]    = createSignal<string | null>(null);
  const [selectedToken,    setSelectedToken]    = createSignal<string | null>(null);

// all unique tokens across all providers and chains
// all unique tokens — always show all
const tokenItems = createMemo(() => {
  const all = raw() ?? [];
  const tokens = new Set<string>();
  all.forEach(p => p.value.data.forEach(c => c.value.tokens.forEach(t => tokens.add(t))));
  return [...tokens].map(t => toDropdownItem(t, "tokens"));
});

// all unique chains — always show all, not dependent on token
const chainItems = createMemo(() => {
  const all = raw() ?? [];
  const chains = new Set<string>();
  all.forEach(p => p.value.data.forEach(c => chains.add(c.key)));
  return [...chains].map(c => ({ value: c, label: c, iconPath: "chains", iconType: "webp" }));
});

// all unique providers — always show all, not dependent on chain/token
const providerItems = createMemo(() => {
  const all = raw() ?? [];
  return all.map(p => toDropdownItem(p.key, "providers"));
});

// each handler is now independent
const handleTokenSelect = (val: string | null) => {
  setSelectedToken(val);
  props.onSelect?.(selectedProvider(), selectedChain(), val);
};

const handleChainSelect = (val: string | null) => {
  setSelectedChain(val);
  props.onSelect?.(selectedProvider(), val, selectedToken());
};

const handleProviderSelect = (val: string | null) => {
  setSelectedProvider(val);
  props.onSelect?.(val, selectedChain(), selectedToken());
};
return (
    <div class="column width" style="justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
        <div class="row width">
          <h4 style="margin-right: auto;">Token</h4>
          <Dropdown type="token"    items={tokenItems()}    onSelect={handleTokenSelect}    />
        </div>
        <div class="row width">
          <h4 style="margin-right: auto;">Chain</h4>
          <Dropdown type="chain"    items={chainItems()}    onSelect={handleChainSelect}    />
        </div>
        <div class="row width">
          <h4 style="margin-right: auto;">Provider</h4>
          <Dropdown type="provider" items={providerItems()} onSelect={handleProviderSelect} />
        </div>
    </div>
  );
}
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";

// --- TYPES ---
type DropdownItem = {
  value: string | null;
  label: string;
  iconPath?: string;
  iconType?: string;
  isHeader?: boolean;
  isStable?: boolean;
};

type DropdownProps = {
  type: string;
  defaultValue?: string | null;
  items: DropdownItem[];
  showAll?: boolean;
  onSelect: (value: string | null) => void;
  class?: string;
};

// --- HELPERS ---
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const truncate = (s: string, max = 12) => s.length > max ? s.slice(0, max) + "…" : s;
const CDN = "https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main";

function getIconUrl(item: DropdownItem): string | null {
  if (!item.iconPath) return null;
  return `${CDN}/${item.iconPath}/${item.value?.toLowerCase()}.${item.iconType ?? "webp"}`;
}

// --- DROPDOWN COMPONENT ---
export function Dropdown(props: DropdownProps) {
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<DropdownItem | null>(null);

  let triggerRef!: HTMLButtonElement;
  let menuRef!: HTMLDivElement;

  const allItems = (): DropdownItem[] => [
    { value: null, label: capitalize(props.type), isHeader: true },
    ...(props.showAll !== false
      ? [{ value: "all", label: "All", iconPath: "menu", iconType: "svg", isStable: true }]
      : []),
    ...props.items,
  ];

    const handleSelect = (item: DropdownItem) => {
        if (item.isHeader) return;
        setSelected(item);
        props.onSelect(item.value);
        setOpen(false);
    };

  const toggleMenu = () => {
    if (isServer) return; // ✅ guard
    if (!open()) {
      const rect = triggerRef.getBoundingClientRect();
      menuRef.style.top = `${rect.bottom + window.scrollY}px`;
      menuRef.style.left = `${rect.left}px`;
      menuRef.style.width = `${rect.width}px`;
    }
    setOpen(!open());
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (!triggerRef.contains(e.target as Node) &&
        !menuRef.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  // ✅ onMount only runs on client, no isServer check needed here
  onMount(() => {
    window.addEventListener("click", handleOutsideClick);
  });

  onCleanup(() => {
    if (!isServer) window.removeEventListener("click", handleOutsideClick);
  });

  const displayItem = () => selected() ?? { value: "all", label: "All", iconPath: "menu", iconType: "svg" };

  return (
    <>
      <button
        ref={triggerRef}
        class={`${props.class ?? ""} hover row`}
        onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
        style={{ height: "2rem", gap: "var(--gap25)", "justify-content": "flex-start" }}
      >
        <Show when={getIconUrl(displayItem())}>
          <img
            src={getIconUrl(displayItem())!}
            alt={displayItem().label}
            style={{ width: "1rem", }}
          />
        </Show>
        <h5>{truncate(capitalize(displayItem().label.toLowerCase()))}</h5>
        <img class="right" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/arrow_down.svg" alt="arrow down"></img>
      </button>

      <div
        ref={menuRef}
        class="border column"
        style={{
          display: open() ? "flex" : "none",
          position: "fixed",
          "z-index": "1000",
          background: "var(--bg)",
          "flex-direction": "column",
          padding: "var(--pad25)",
        }}
      >
        <For each={allItems()}>
          {(item) => (
                <div
                class={item.isHeader ? "" : "hover row"}
                style={{
                    padding: "var(--pad25)",
                    gap: "var(--gap25)",
                    "justify-content": "flex-start",
                    cursor: item.isHeader ? "default" : "pointer",
                    width: "100%",
                    "border-bottom": item.isHeader ? "var(--border)" : "none", // ✅
                }}
                onClick={(e) => { e.stopPropagation(); handleSelect(item); }}
                >
              <Show when={!item.isHeader && getIconUrl(item)}>
                <img
                  src={getIconUrl(item)!}
                  alt={item.label}
                  style={{ width: "1rem" }}
                />
              </Show>
              <h4>{item.isHeader ? capitalize(props.type) : item.label}</h4>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

// --- MULTI DROPDOWN ---
type DropdownConfig = {
  type: string;
  items: DropdownItem[];
  showAll?: boolean;
  onSelect: (value: string | null) => void;
  class?: string;
};

type MultiDropdownProps = {
  configs: DropdownConfig[];
};

export function MultiDropdown(props: MultiDropdownProps) {
  return (
    <For each={props.configs}>
      {(config) => (
        <Dropdown
          type={config.type}
          items={config.items}
          showAll={config.showAll}
          onSelect={config.onSelect}
          class={config.class}
        />
      )}
    </For>
  );
}
import { createSignal, createEffect, onMount  } from "solid-js";
import { JSX } from "solid-js";
import { Bg } from "./Bg";
import { Button } from "./Button";

type SettingsProps = { onClose: () => void };
type Tab = "overall" | "rpc";
type SettingsData = {
  overall: {
    refreshPeriod: number;
    theme: "dark" | "light";
    notifications: boolean;
  };
  rpc: {
    [chain: string]: string;
  };
};

const defaultSettings: SettingsData = {
  overall: {
    refreshPeriod: 1000,
    theme: "dark",
    notifications: true
  },
  rpc: {
    Supra: "https://supra.devnet.sui.io:9000",
    Sui: "https://supra.devnet.sui.io:9000",
    Ethereum: "https://supra.devnet.sui.io:9000",
    Base: "https://supra.devnet.sui.io:9000",
    Monad: "https://supra.devnet.sui.io:9000",
  },
};

function loadSettings(): SettingsData {
  try {
    const stored = localStorage.getItem("settings");
    return stored ? (JSON.parse(stored) as SettingsData) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: SettingsData) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

export function Settings(props: SettingsProps) {
  const [activeTab, setActiveTab] = createSignal<Tab>("overall");
  const [settings, setSettings] = createSignal<SettingsData>(loadSettings());
  const [checked, setChecked] = createSignal(false);
  
  onMount(() => {
    const saved = loadSettings();
    document.documentElement.setAttribute("data-theme", saved.overall.theme);
  });

  createEffect(() => {
    document.documentElement.setAttribute("data-theme", settings().overall.theme);
  });

  const updateOverall = <K extends keyof SettingsData["overall"]>(
    key: K,
    value: SettingsData["overall"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      overall: { ...prev.overall, [key]: value },
    }));
  };

  const updateRpc = (chain: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      rpc: { ...prev.rpc, [chain]: value },
    }));
  };

  const tabContent: Record<Tab, () => JSX.Element> = {
    overall: () => (
      <div class="column width">
        <div class="row width hover" style="padding: var(--pad25);">
          <h4>Refresh Period</h4>
          <input
            type="number"
            style="margin-left: auto;"
            min="100" max="5000" step="100"
            value={settings().overall.refreshPeriod}
            onInput={(e) => updateOverall("refreshPeriod", Number(e.currentTarget.value))}
          />
        </div>
        <div class="row width hover" style="padding: var(--pad25);">
          <h4>Theme</h4>
          <select
            style="margin-left: auto;"
            value={settings().overall.theme}
            onChange={(e) => updateOverall("theme", e.currentTarget.value as "dark" | "light")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div class="row width hover" style="padding: var(--pad25);">
        <h4>Notifications</h4>
        <input
          type="checkbox"
          style="margin-left: auto;"
          checked={settings().overall.notifications}
          onChange={(e) => updateOverall("notifications", e.currentTarget.checked)}
        />
        </div>
      </div>
    ),
    rpc: () => (
      <div class="column width">
        {Object.entries(settings().rpc).map(([chain, value]) => (
          <div class="row width hover" style="padding: var(--pad25);">
            <h4>{chain} RPC</h4>
            <input
              type="text"
              style="margin-left: auto; width: 12.5rem;"
              value={value}
              onInput={(e) => updateRpc(chain, e.currentTarget.value)}
            />
          </div>
        ))}
      </div>
    ),
  };

  const handleSave = () => {
    saveSettings(settings());
    props.onClose();
  };

  return (
    <Bg
      header="Settings"
      onClose={props.onClose}
      width="20rem"
      height="20rem"
      content={
        <div class="column" style={{ width: "100%", gap: "0.5rem" }}>
          <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border);">
            <Button
              folder="menu" name="all" icon_type="svg" label="Overall"
              class={activeTab() === "overall" ? "active" : ""}
              onClick={() => setActiveTab("overall")}
            />
            <Button
              folder="menu" name="website" icon_type="svg" label="RPC"
              class={activeTab() === "rpc" ? "active" : ""}
              onClick={() => setActiveTab("rpc")}
            />
          </div>
          {tabContent[activeTab()]()}
          <Button label="Save" class="right" onClick={handleSave} />
        </div>
      }
    />
  );
}

export function notificationsEnabled(): boolean {
  try {
    const stored = localStorage.getItem("settings");
    if (!stored) return false;
    return (JSON.parse(stored) as SettingsData).overall.notifications ?? false;
  } catch {
    return false;
  }
}
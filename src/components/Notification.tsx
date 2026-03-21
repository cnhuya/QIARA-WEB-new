import { Show } from "solid-js";
import { notification, dismiss } from "~/lib/notify";

const TYPE_ICON = {
  error:   "negative",
  success: "positive",
  info:    "info",
  warning: "warning",
} as const;

export function Notification() {
  return (
    <Show when={notification()}>
      {n => (
        <div style="position: fixed; bottom: 1rem; right: 1rem; z-index: 9999; max-width: 20rem; width: 100%;">
          <div class="notification column border" style={{ height: "auto", "justify-content": "flex-start", background: "var(--bg)", gap: 0 }}>
            <div class="row width" style={{ "border-bottom": "var(--border)", padding: "var(--pad25)", gap: "var(--gap25)" }}>
              <img alt="notification" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/notification.svg" />
              <h4>{n().header}</h4>
              <img class="right close" alt="close" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/close.svg" onClick={dismiss} />
            </div>
            <div class="row width" style={{ padding: "var(--pad25)", gap: "var(--gap25)" }}>
              <img alt={n().type} src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${TYPE_ICON[n().type]}.svg`} />
              <p style="text-align: left; flex: 1;">{n().message}</p>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
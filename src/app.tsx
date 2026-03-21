import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import { Notification } from "~/components/Notification";

import "./app.css";
import "./main.css";
import "./ranks.css";

export default function App() {
  onMount(() => {
    try {
      const stored = localStorage.getItem("settings");
      if (stored) {
        const theme = JSON.parse(stored)?.overall?.theme;
        if (theme) document.documentElement.setAttribute("data-theme", theme);
      }
    } catch {}
  });

  return (
    <Router
      root={props => (
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
          <Notification  />
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
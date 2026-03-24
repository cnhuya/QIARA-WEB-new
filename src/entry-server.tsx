// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

let cronjobStarted = false;

export default createHandler(() => {
  if (!cronjobStarted) {
    cronjobStarted = true;
    import("./db/cronjob")
      .then(({ startCronjob }) => startCronjob())
      .catch(e => console.error("[Cronjob] Failed to start:", e));
  }

  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            {assets}

            {/* Inline theme script – runs before first paint, no flash */}
            <script
              // If you later add CSP, add nonce={nonce} prop here
            >
              {`
                try {
                  const raw = localStorage.getItem("settings");
                  let theme = "dark";  // ← change if your default is different
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.overall?.theme === "light" || parsed?.overall?.theme === "dark") {
                      theme = parsed.overall.theme;
                    }
                  }
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {}
              `}
            </script>
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
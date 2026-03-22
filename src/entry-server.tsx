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
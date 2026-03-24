// src/App.tsx
import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense, onMount, onCleanup, createSignal, createEffect } from 'solid-js';
import { Notification } from '~/components/Notification';

import { ReactAptosWalletBridge, type AptosBridgeRef  } from './components/WalletBridge';

import { setPetraBridge } from './lib/wallets/petra';

import './app.css';
import './main.css';
import './ranks.css';

export default function App() {
  let bridgeContainer: HTMLDivElement | undefined;

  const [bridgeRef, setBridgeRef] = createSignal<AptosBridgeRef | null>(null);

  onMount(async () => {
    if (!bridgeContainer) return;

    try {
      const React = (await import('react')).default;
      const { createRoot } = await import('react-dom/client');

      const root = createRoot(bridgeContainer);

      const ref = React.createRef<AptosBridgeRef>();

      root.render(
        React.createElement(ReactAptosWalletBridge, {
          ref,
          onReady: (api: AptosBridgeRef) => {
            setBridgeRef(api);
          },
        })
      );

      onCleanup(() => {
        root.unmount();
      });

    } catch (err) {
      console.error('Failed to render React bridge:', err);
    }
  });

  createEffect(() => {
    const ref = bridgeRef();
    if (!ref) return;

    setPetraBridge({
      connect: ref.connectPetra,
      sendTx: ref.sendTx,
      disconnect: ref.disconnect,
    });
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Suspense>{props.children}</Suspense>
          <Notification />
        </MetaProvider>
      )}
    >
      <FileRoutes />

      {/* Hidden container for React bridge */}
      <div
        ref={(el) => (bridgeContainer = el)}
        style={{ display: 'none' }}
      />
    </Router>
  );
}
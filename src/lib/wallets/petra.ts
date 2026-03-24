// src/wallets/petra.ts

import { notify } from "../notify";

let petraBridge: {
  connect: (chain: string) => Promise<string | null>;
  sendTx: (args: SendTxArgs) => Promise<string | null>;
  disconnect: () => Promise<void>;
} | null = null;

export function setPetraBridge(bridge: typeof petraBridge) {
  petraBridge = bridge;
}

export type SendTxArgs = {
  account: string;
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  type_args?: unknown[];
  args?: unknown[];
};

type PetraConnectResult = { account: string | null };

type WalletConnectCallback = (
  account: string,
  chain: string,
  type: string,
  provider?: unknown
) => void;

export async function connectWithPetra(
  chain: string,
  onConnect: WalletConnectCallback
): Promise<PetraConnectResult> {
  if (!petraBridge) {
    notify('error', 'Wallet Not Ready', 'Petra integration is not initialized yet');
    return { account: null };
  }

  try {
    const address = await petraBridge.connect(chain);
    if (address) {
      onConnect(address, chain, 'petra');
      notify(
        'success',
        'Connected',
        `Connected with Petra (${address.slice(0, 6)}...${address.slice(-4)})`
      );
      return { account: address };
    }
    notify('warning', 'Connection Failed', 'No address returned from Petra');
    return { account: null };
  } catch (err) {
    notify('error', 'Connection Failed', err instanceof Error ? err.message : String(err));
    return { account: null };
  }
}

export async function send_tx(args: SendTxArgs): Promise<string> {
  if (!petraBridge) {
    throw new Error('Petra bridge not initialized');
  }

  try {
    const hash = await petraBridge.sendTx(args);
    if (!hash) throw new Error('No transaction hash received');

    notify('success', 'Transaction Sent', `Hash: ${hash.slice(0, 10)}...`);
    return hash;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    notify('error', 'Transaction Failed', message);
    throw err;
  }
}

export async function disconnectPetra(): Promise<void> {
  if (petraBridge) await petraBridge.disconnect();
}
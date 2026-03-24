import type { InputSubmitTransactionData } from '@aptos-labs/ts-sdk';

import React, { forwardRef, useImperativeHandle, type ReactNode } from 'react';
import {
  AptosWalletAdapterProvider,
  useWallet,
} from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

import type { SendTxArgs } from '~/lib/wallets/petra';

export interface AptosBridgeRef {
  connectPetra: (chain: string) => Promise<string | null>;
  sendTx: (args: SendTxArgs) => Promise<string | null>;
  disconnect: () => Promise<void>;
}

const PETRA_WALLET_NAME = 'Petra' as const; // string literal — no WalletName needed

const InnerWallet = forwardRef<AptosBridgeRef, {
  onReady?: (ref: AptosBridgeRef) => void;
}>((props, ref) => {
  const wallet = useWallet();

  useImperativeHandle(ref, () => {
    const api: AptosBridgeRef = {
      async connectPetra(chain: string) {
        if (wallet.connected && wallet.wallet?.name !== PETRA_WALLET_NAME) {
          await wallet.disconnect();
        }
        if (!wallet.connected) {
          await wallet.connect(PETRA_WALLET_NAME);
        }
        return wallet.account?.address?.toString() ?? null;
      },

      async sendTx(args: SendTxArgs) {
        if (!wallet.connected || !wallet.account?.address) {
          throw new Error('Petra wallet not connected');
        }

        const sender = wallet.account.address.toString();

        const txInput = {
          sender,
          data: {
            function: `${args.moduleAddress}::${args.moduleName}::${args.functionName}`,
            typeArguments: args.type_args ?? [],
            functionArguments: args.args ?? [],
          },
        } as Parameters<typeof wallet.signAndSubmitTransaction>[0];

        const response = await wallet.signAndSubmitTransaction(txInput);
        return response.hash;
      },

      async disconnect() {
        if (wallet.connected) await wallet.disconnect();
      },
    };

    // 🔥 THIS IS THE KEY
    props.onReady?.(api);

    return api;
  });

  return null;
});

export const ReactAptosWalletBridge = forwardRef<AptosBridgeRef, {  onReady?: (ref: AptosBridgeRef) => void;

}>((props, ref) => {
return React.createElement(
  AptosWalletAdapterProvider as any,
  {
    plugins: [new PetraWallet()],
    autoConnect: true,
    dappConfig: { network: Network.TESTNET },
    optInWallets: [PETRA_WALLET_NAME],
    onError: (error: any) => console.error('Aptos wallet error:', error),
  },
  React.createElement(InnerWallet, {
    ref,
    onReady: props.onReady,
  })
);
});
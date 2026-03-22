import { createSignal, Switch, Match } from "solid-js";
import { Bg } from "../Bg";
import { Button } from "../Button";
import { sendTx, } from "~/lib/wallet";
import { activeShared, getAllConnections, Chain } from "~/lib/state";
import { notify } from "~/lib/notify";
export type ActiveTab = "deposit" | "withdraw" | "stake" | "unstake";
import type {SendTxArgs} from "~/lib/wallet";
import { bcsSerializeString, bcsSerializeU64, bcsSerializeU256 } from "~/lib/serializer";
type ActionMenuProps = {
  token:       string;
  chain:       string;
  provider:    string;
  initialTab?: ActiveTab;
  onClose:     () => void;
  onTabChange?: (tab: ActiveTab) => void; // 👈 add this
};

export function ActionMenu(props: ActionMenuProps) {
  const [activeTab, setActiveTab] = createSignal<ActiveTab>(props.initialTab ?? "deposit");
  const [amount, setAmount] = createSignal("");

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setAmount("");
    props.onTabChange?.(tab);
  };

  const handleExecute = () => {
    const connections = getAllConnections();
    const entries = Object.entries(connections);

    if (entries.length === 0) {
      notify("warning", "Not Connected", "Please connect a wallet first.");
      return;
    }

    const [connectedChain, { wallet, account }] = entries[0];

    const args: SendTxArgs = {
      account,
      moduleAddress: "0x414d4a03ce2efeb08044ab890862f2ade3d6d24700e2ae1c8dfe0684a23b97b6",
      moduleName: "QiaraVaultsV1",
      functionName: activeTab(),
      args: [bcsSerializeString(activeShared()), bcsSerializeString(props.token), bcsSerializeString(props.chain), bcsSerializeString(props.provider), bcsSerializeU64(BigInt(Math.floor(parseFloat(amount()) * 1e9)))],
    };

    sendTx(connectedChain as any, wallet as any, args);
  };

  return (
      <Bg
        header={`${props.token} — ${props.provider}`}
        onClose={props.onClose}
        width="25rem"
        height="20rem"
        contentFn={() => (
          <div class="column" style={"width: 100%; gap: 0"}>
            {/* Tabs */}
            <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border);">
         <Button
            folder="menu" name="deposit" icon_type="svg" label="Deposit"
            active={activeTab() === "deposit"}
            onClick={() => switchTab("deposit")}
          />
          <Button
            folder="menu" name="withdraw" icon_type="svg" label="Withdraw"
            active={activeTab() === "withdraw"}
            onClick={() => switchTab("withdraw")}
          />
          <Button
            folder="menu" name="stake" icon_type="svg" label="Stake"
            active={activeTab() === "stake"}
            onClick={() => switchTab("stake")}
          />
          <Button
            folder="menu" name="unstake" icon_type="svg" label="Unstake"
            active={activeTab() === "unstake"}
            onClick={() => switchTab("unstake")}
          />
            </div>

            <Switch>
              <Match when={activeTab() === "deposit"}>
                <div class="column width">
                  <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border); opacity: 0.5;">
                    <p>{props.chain}</p><p>→</p><p>{props.provider}</p>
                  </div>
                  <div class="row width hover" style="padding: var(--pad25);">
                    <h4>Amount</h4>
                    <input type="number" style="margin-left: auto; width: 8rem;" value={amount()} onInput={(e) => setAmount(e.currentTarget.value)} placeholder="0.00" />
                  </div>
                  <div class="row width" style="padding: var(--pad25); justify-content: flex-end; opacity: 0.5;">
                    <p style="font-size: 0.75rem;">Balance: 0.00 {props.token}</p>
                  </div>
                </div>
              </Match>
              <Match when={activeTab() === "withdraw"}>
                <div class="column width">
                  <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border); opacity: 0.5;">
                    <p>{props.chain}</p><p>→</p><p>{props.provider}</p>
                  </div>
                  <div class="row width hover" style="padding: var(--pad25);">
                    <h4>Amount</h4>
                    <input type="number" style="margin-left: auto; width: 8rem;" value={amount()} onInput={(e) => setAmount(e.currentTarget.value)} placeholder="0.00" />
                  </div>
                  <div class="row width" style="padding: var(--pad25); justify-content: flex-end; opacity: 0.5;">
                    <p style="font-size: 0.75rem;">Deposited: 0.00 {props.token}</p>
                  </div>
                </div>
              </Match>
              <Match when={activeTab() === "stake"}>
                <div class="column width">
                  <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border); opacity: 0.5;">
                    <p>{props.chain}</p><p>→</p><p>{props.provider}</p>
                  </div>
                  <div class="row width hover" style="padding: var(--pad25);">
                    <h4>Amount</h4>
                    <input type="number" style="margin-left: auto; width: 8rem;" value={amount()} onInput={(e) => setAmount(e.currentTarget.value)} placeholder="0.00" />
                  </div>
                  <div class="row width" style="padding: var(--pad25); justify-content: flex-end; opacity: 0.5;">
                    <p style="font-size: 0.75rem;">Available: 0.00 {props.token}</p>
                  </div>
                </div>
              </Match>
              <Match when={activeTab() === "unstake"}>
                <div class="column width">
                  <div class="row width" style="padding: var(--pad25); gap: var(--gap25); justify-content: flex-start; border-bottom: var(--border); opacity: 0.5;">
                    <p>{props.chain}</p><p>→</p><p>{props.provider}</p>
                  </div>
                  <div class="row width hover" style="padding: var(--pad25);">
                    <h4>Amount</h4>
                    <input type="number" style="margin-left: auto; width: 8rem;" value={amount()} onInput={(e) => setAmount(e.currentTarget.value)} placeholder="0.00" />
                  </div>
                  <div class="row width" style="padding: var(--pad25); justify-content: flex-end; opacity: 0.5;">
                    <p style="font-size: 0.75rem;">Staked: 0.00 {props.token}</p>
                  </div>
                </div>
              </Match>
            </Switch>

            <div class="row width" style="padding: var(--pad25); justify-content: flex-end; margin-top: auto;">
              <Button label="Execute" class="right" onClick={handleExecute} />
            </div>
          </div>
        )}
      />
    );
}
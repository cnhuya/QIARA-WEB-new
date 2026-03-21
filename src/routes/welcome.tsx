import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { onMount, createSignal, For } from "solid-js";
import s from "./welcome.module.css";
import ExchangeChart from "~/components/welcome/Chart";
import Ecosystem from "~/components/welcome/Ecosystem";
import Backers from "~/components/welcome/Backers";
import Auditors from "~/components/welcome/Auditors";
import QnA from "~/components/welcome/QnA";
import { Button } from "~/components/Button";
const STATS = [
  { label: "TVL",       value: "$500m", icon: "dolar" },
  { label: "Rewarded",  value: "$100m", icon: "reward" },
  { label: "Chains",    value: "5", icon: "chains"     },
  { label: "Providers", value: "11", icon: "bank"    },
];

const FEATURES = [
  {
    icon: "first",
    title: "Best Capital Efficiency",
    desc:  "We believe that Qiara Protocol is one of the most efficient protocols on the market.",
  },
  {
    icon: "account",
    title: "Users First",
    desc:  "Qiara Protocol doesnt take ANY fees. All rewards go to users. Except for gas fees.",
  },
  {
    icon: "shared_liquidity",
    title: "Unified Liquidity",
    desc:  "Deposit and Borrow across multiple chains from a single unified marginalized interface.",
  },
  {
    icon: "zero_knowledge",
    title: "Zero Knowledge",
    desc:  "Most of the Protocol functionality is based on Zero Knowledge Technology.",
  },
  {
    icon: "crosschain",
    title: "Permissionless",
    desc:  "No gatekeepers. Any provider, any chain, any token — open by design.",
  },
  {
    icon: "predator",
    title: "Non Predatory",
    desc:  "Qiara Protocol is Fully supportive towards the cryptocurrency community, possible by design.",
  },
  {
    icon: "consensus",
    title: "Fully Decentralized",
    desc:  "Qiara Protocol is Fully decentralized, possible by design.",
  },
  {
    icon: "chains",
    title: "Unlimited Modularity",
    desc:  "Based on Scalable Architecture - powered by ZK.",
  },
  {
    icon: "dolar",
    title: "Yield Optimized",
    desc:  "Built-in Automated Yield Compounding.",
  },
  {
    icon: "governance",
    title: "Real-Time Governance",
    desc:  "Vote and shape protocol parameters with on-chain proposals and transparent execution without any limits.",
  },
];

const CHAINS = [
  "supra", "ethereum", "aptos", "sui", "avalanche",
];

export default function Welcome() {
  const navigate = useNavigate();
  const [visible, setVisible] = createSignal(false);

const total = 99.8;
const current = 65.4;
const pct = (current / total) * 100;

const total_chains = 46;
const current_chains = 5;
const pct_chains = (current_chains / total_chains) * 100;

const total_providers = 70;
const current_providers = 10;
const pct_providers = (current_providers / total_providers) * 100;

  // Scroll-triggered reveal
  onMount(() => {
    setTimeout(() => setVisible(true), 50);

    const observe = () => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add(s.visible);
            observer.unobserve(e.target);
          }
        }),
        { threshold: 0.15 }
      );
      document.querySelectorAll(`.${s.scrollReveal}`).forEach(el => observer.observe(el));
    };

    // Small delay so <For> has rendered its items into the DOM
    setTimeout(observe, 100);
  });

return (
  <main class={s.page}>
    <Title>Qiara | Welcome</Title>
    <div class={s.version} style="z-index: 1; position: absolute; top: 0; left: 0; padding: 0.5rem;">
      <h3 style="opacity: 0.6; width: 100%; text-align: start; padding: 0.25rem;">Closed Alpha | Testnet | 18/3/2026 Snapshot</h3>
      <p style="opacity: 0.6;width: 80%; text-align: start;  margin-left: 1rem;">Website Build 0.01</p>
      <p style="opacity: 0.6;width: 80%; text-align: start; margin-left: 1rem;">Protocol Build 0.01</p>
      <button style="opacity: 0.6; text-align: start;">Patchnotes</button>

    </div>
    <section class={s.hero}>
      <div class="column" style="width: 100%; max-width: 50rem;">
<img class={`${s.img_bg} ${s.logo} ${s.scrollReveal}`} style="padding: 0.33rem; width: 5rem; height: 5rem; flex-shrink: 0;" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/icon.webp`} />        <h1 class={s.scrollReveal} style="text-shadow: 0px 1px 0px   rgba(0, 0, 0, 0.1); font-weight: 700; font-size: clamp(1.25rem, 9vw, 2.75rem); letter-spacing: -0.05em; background: linear-gradient(359deg, var(--accent) 50%, rgba(157, 148, 175, 0.4)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Welcome To Qiara
        </h1>
        <p class={s.scrollReveal}  style="width: 100%; text-align: center;">The First Fully Mature Decentralized Autonomous Protocol</p>
        <p class={s.scrollReveal}  style="margin-top:2rem; margin-bottom: 0.25rem; width: 100%; text-align: end;">Powered by Zero-Knowledge Technology & Built on Supra & Improved by Builders</p>
        <div  style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 10rem), 1fr)); width: 100%; gap: 1rem;">
            <For each={STATS}>
            {(f, i) => (
              <div class={`row width border hover`+" "+s.scrollReveal} style={`transition-delay: ${i() * 0.1}s; position: relative; width: 100%; justify-content: flex-start; padding: 1rem; gap: 1rem;`}>
                <img style="position: absolute; left: 0; top: 0; margin-left: auto; padding: 0.25rem; width: 2rem; height: 2rem; flex-shrink: 0;" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${f.icon}.svg`} />
                <div class="column" style="flex: 1; min-width: 0;">
                  <h3 class="width" style="text-align: center; font-size: clamp(1rem, 7vw, 1.5rem);">{f.value}</h3>
                  <p class="width" style="text-align: center">{f.label}</p>
                </div>
              </div>
            )}
          </For>
        </div>
        <div class={`row`+" "+s.scrollReveal} style=" margin-top: 1rem; width: 100%; justify-content: center; gap: 1rem;">
        <button style="width: 7.5rem; height: 2.5rem;" onClick={() => navigate("/docs")} class="">Docs</button>
        <button style="width: 7.5; height: 2.5rem;" onClick={() => navigate("/whitepaper")} class="">Whitepaper</button>
        <button style="opacity: 0.75; margin-left:auto; width: 10rem; height: 2.5rem; background-color: var(--accent); color: var(--bg); font-weight: 700;" onClick={() => navigate("/vaults")} class="">Enter App</button>
        </div>
      </div>
    </section>
    <section class={s.hero} style="flex-direction: column;">
<h2 style="width: 100%; max-width: 60rem; text-align: start; padding: 1rem;">The Stack of Qiara Protocol</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 28rem), 1fr)); gap: var(--gap25); width: 100%; max-width: 60rem;">
  <For each={FEATURES}>
    {(f, i) => (
      <div class={`row border width hover` + " "+s.scrollReveal} style={`transition-delay: ${i() * 0.01}s; justify-content: flex-start;`}>
        <img class={s.img_bg} style="padding: 0.25rem; width: 3rem; height: 3rem; flex-shrink: 0;" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/${f.icon}.svg`} />        <div class="column" style="flex: 1; min-width: 0;">
          <h3 class="width" style="text-align: start">{f.title}</h3>
          <p class="width" style="text-align: start">{f.desc}</p>
        </div>
        <img class={s.doc_img} style="margin-left: auto; padding: 0.25rem; width: 2rem; height: 2rem; flex-shrink: 0;" src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/docs.svg`} />
      </div>
    )}
  </For>
</div>
      <div class={`row border width hover` + " "+s.scrollReveal} style="transition-delay: 0.1s; margin-top: var(--gap25); width: min(100%, 28rem); transition-delay: 0.01s; justify-content: flex-start;"><img style="padding:0.25rem;width:3rem;height:3rem" class="_img_bg_70z89_69" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/question.svg"></img><div class="column"><h3 class="width" style="text-align:start">Many More Coming Soon</h3><p class="width" style="text-align:start">We are not done yet. We are constantly working on new features and improvements.</p></div><img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/docs.svg" style="margin-left:auto;padding:0.25rem;width:2rem;height:2rem" class="_doc_img_70z89_47"></img></div>
    </section>
    <section class={s.hero} style="display: flex; flex-direction: column;">
        <h2 style="width: 100%; max-width: 60rem;  text-align: start; padding: 1rem;">Capital Efficiency</h2>
    <div class="column border" style="width: 100%; max-width: 60rem; height: 60vh; padding: 1rem; gap: 0.25rem; ">
          <ExchangeChart />
      <p class="width" style="text-align: start;">*description: Above is the visualizated comparison between current industry leaders and Qiara, when it comes to capital efficiency. </p>
      <p class="width" style="text-align: start;">*disclaimer: Data May Not be 100% accurate, Take it with a grain of salt. </p>
      <p class="width" style="text-align: start;">*date: Date of last update: 2023-06-01 </p>
      <p class="width" style="text-align: start;">*basis: 10000 Stable Tokens, 1 Bitcoin Token, 10 Ethereum Token  </p>
      <p class="width" style="text-align: start;">*formula: (basis*price*ltv/10000)*possible_yield  </p>
    </div>

    </section>
    <section class={s.hero} style="display: flex; flex-direction: column; max-height: 20vh; min-height: 20vh">
        <h2 style="width: 100%; max-width: 60rem;  text-align: center; padding: 1rem; transform: translateY(1rem);">Backed By The Best  </h2>
        <div class="column" style="width: 100%; height: 50vh;gap: 0.25rem; ">
          <Backers />
        </div>
    </section>
    <section class={s.hero} style="display: flex; flex-direction: column;">
    <div class="row" style="height: 4%; width: 100%; max-width: 60rem;  padding: 0rem;">
                  <p class="row " style="width: 100%; height: 100%; text-align: start; gap: 0.1rem; justify-content: flex-end; padding: 0.5rem">
                <img style="width:1rem;height:1rem;" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/info.svg"></img>
                  Data from https://defillama.com/ | 17/3/2026
                  </p>
             </div>
        <div class="row"  style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: var(--gap25); width: 100%; max-width: 60rem;">
          <div class={"border" + " "+s.scrollReveal  } style="width: 100%; height: 100%;">
            <div class="column" style="width: 100%; height: 100%; justify-content: center; gap: 0.25rem;">
              <div class="row width" style="justify-content: flex-start; gap: 0.25rem;">
                <img style="width:1.75rem;height:1.75rem;border-radius:50%;flex-shrink:0" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/dolar.svg"></img>
                <h3 style="opacity: 0.8">TVL Unlocked</h3>
              </div>
              <h2 class="width" style="text-align: start;">$65,4B / $99,8B</h2>
              <div class="width" style={`margin-top: 1rem; height: 2px; background: linear-gradient(to right, #4ade80 ${pct}%, var(--muted) ${pct}%);`} />
            </div>
          </div>
          <div class={"border" + " "+s.scrollReveal  } style="width: 100%; height: 100%;">
            <div class="column" style="width: 100%; height: 100%; justify-content: center; gap: 0.25rem;">
              <div class="row width" style="justify-content: flex-start; gap: 0.25rem;">
                <img style="width:1.75rem;height:1.75rem;border-radius:50%;flex-shrink:0" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/chains.svg"></img>
                <h3 style="opacity: 0.8">Chains Unlocked</h3>
              </div>
              <h2 class="width" style="text-align: start;">5 / 46</h2>
              <div class="width" style={`margin-top: 1rem; height: 2px; background: linear-gradient(to right, #4ade80 ${pct_chains}%, var(--muted) ${pct_chains}%);`} />
            </div>
          </div>
          <div class={"border" + " "+s.scrollReveal  } style="width: 100%; height: 100%;">
            <div class="column" style="width: 100%; height: 100%; justify-content: center; gap: 0.25rem;">
              <div class="row width" style="justify-content: flex-start; gap: 0.25rem;">
                <img style="width:1.75rem;height:1.75rem;border-radius:50%;flex-shrink:0" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/bank.svg"></img>
                <h3 style="opacity: 0.8">Providers Unlocked</h3>
              </div>
              <h2 class="width" style="text-align: start;">10 / 70</h2>
              <div class="width" style={`margin-top: 1rem; height: 2px; background: linear-gradient(to right, #4ade80 ${pct_providers}%, var(--muted) ${pct_providers}%);`} />
            </div>
        </div>
      </div>
          <div class={"row" + " "+s.scrollReveal  }  style="height: 5%; width: 100%; max-width: 60rem; padding: 0rem; gap: 0.5rem;">
          <p style="width: 100%; height: 100%; text-align: start; padding: 0.5rem">Total TVL of Decentralized Finance</p>
          <p style="width: 100%; height: 100%; text-align: start; padding: 0.5rem">Filtered by min. $100m TVL</p>
          <p style="width: 100%; height: 100%; text-align: start; padding: 0.5rem">Filtered by min. $10m borrowed TVL</p>
        </div>
        <h2 style="width: 100%; max-width: 60rem;  text-align: start; padding: 1rem; margin-top: 2.5rem">Supported Ecosystem</h2>
    <div class="column border" style="width: 100%; max-width: 60rem; height: 40vh; padding: 1rem; gap: 0.25rem; ">
          <Ecosystem />
    </div>
    </section>
    <section class={s.hero} style="display: flex; flex-direction: column; max-height: 20vh; min-height: 20vh">
        <h2 style="width: 100%; text-align: center; padding: 1rem; transform: translateY(1rem);">Audited By Profesionals  </h2>
        <div class="column" style="width: 100%; height: 50vh;gap: 0.25rem; ">
          <Auditors />
        </div>
    </section>
    <section class={s.hero} style="display: flex; flex-direction: column;">
        <h2 style="width: 100%; text-align: center; padding: 1rem;">Frequently Asked Questions  </h2>
        <div class="column border" style="width: 100%; max-width: 60rem;gap: 0.25rem; ">
          <QnA />
        </div>
    </section>
    <section class={s.hero} style="display: flex; flex-direction: column; max-height: 7.5vh; min-height: 7.5vh">
        <div class="row" style="width: 100%; max-width: 100rem; height: 100%;gap: 0.25rem; ">
        <button style="width: auto;">Copyright Reserved 2026</button>
        <button>Terms Of Service</button>
        <button>Privacy</button>
        </div>
    </section>
  </main>
);
}

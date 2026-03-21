import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { onMount, createSignal, For } from "solid-js";
import s from "./welcome.module.css";
import ExchangeChart from "~/components/welcome/Chart";
const STATS = [
  { label: "TVL",       value: "$500m" },
  { label: "Rewarded",  value: "$100m" },
  { label: "Chains",    value: "5"     },
  { label: "Providers", value: "11"    },
];

const EXCHANGES = [
  { name: "Qiara",       value: "$500m" },
  { name: "Binance",  value: "$100m" },
  { name: "Bybit",    value: "5"     },
  { name: "Providers", value: "11"    },
];

const FEATURES = [
  {
    icon: "⬡",
    title: "Cross-Chain Liquidity",
    desc:  "Deposit and borrow across multiple chains from a single unified interface.",
  },
  {
    icon: "⬢",
    title: "Permissionless",
    desc:  "No gatekeepers. Any provider, any chain, any token — open by design.",
  },
  {
    icon: "◈",
    title: "Yield Optimized",
    desc:  "Stake your assets and earn compounding rewards across every supported protocol.",
  },
  {
    icon: "◉",
    title: "Real-Time Governance",
    desc:  "Vote and shape protocol parameters with on-chain proposals and transparent execution.",
  },
];

const CHAINS = [
  "supra", "ethereum", "aptos", "sui", "avalanche",
];

export default function Welcome() {
  const navigate = useNavigate();
  const [visible, setVisible] = createSignal(false);

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

      {/* ── HERO ── */}
      <section class={s.hero}>
        <div class={s.grid} />
        <div class={s.orb} />

        <div class={s.heroContent}>
          {/* Logo */}
          <div class={`${s.logoWrap} ${visible() ? s.visible : ""}`}>
            <img
              src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/icon.webp"
              alt="Qiara"
            />
          </div>

          {/* Headline */}
          <div class={`${s.reveal} ${visible() ? s.visible : ""}`}>
            <h1 style="font-size: clamp(2rem, 5vw, 3.5rem)">Welcome to Qiara</h1>
            <p>The First Fully Mature Decentralized Autonomous Protocol</p>
          </div>

          {/* Stats */}
          <div class={`${s.stats} ${s.reveal} ${visible() ? s.visible : ""}`}>
            <For each={STATS}>
              {(s_) => (
                <div class={s.stat}>
                  <p class={s.value}>{s_.value}</p>
                  <p class={s.label}>{s_.label}</p>
                </div>
              )}
            </For>
          </div>

          {/* CTA */}
          <div class={`${s.cta} ${s.reveal} ${visible() ? s.visible : ""}`}>
            <button class={s.ctaPrimary} onClick={() => navigate("/vaults")}>
              Enter App
            </button>
            <button
              class={s.ctaSecondary}
              onClick={() => window.open("https://docs.qiara.xyz", "_blank")}
            >
              Documentation
            </button>
          </div>
        </div>

        <div class={`${s.scrollHint} ${s.reveal} ${visible() ? s.visible : ""}`}>
          Scroll
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section class={s.features}>
        <p class={`${s.sectionLabel} ${s.scrollReveal}`}>What you can do</p>
        <div class={`${s.featuresGrid} ${s.scrollReveal}`}>
<For each={FEATURES}>
  {(f, i) => (
    <div class={`${s.featureCard} ${s.scrollReveal}`} style={`transition-delay: ${i() * 0.1}s`}>
      <span class={s.featureIcon}>{f.icon}</span>
      <h3>{f.title}</h3>
      <p>{f.desc}</p>
    </div>
  )}
</For>
        </div>
      </section>

      {/* ── CHAINS ── */}
      <section class={s.chains}>
        <p class={`${s.sectionLabel} ${s.scrollReveal}`}>Supported chains</p>
        <div class={`${s.chainsRow} ${s.scrollReveal}`}>
          <For each={CHAINS}>
            {(chain, i) => (
  <div class={`${s.chainPill} ${s.scrollReveal}`} style={`transition-delay: ${i() * 0.08}s`}>
                <img
                  src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/chains/${chain}.webp`}
                  alt={chain}
                />
                {chain.charAt(0).toUpperCase() + chain.slice(1)}
              </div>
            )}
          </For>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section class={s.finalCta}>
        <h2 class={s.scrollReveal}>Ready to start?</h2>
        <p class={s.scrollReveal}>
          Connect your wallet and access cross-chain liquidity in seconds.
        </p>
        <div class={`${s.cta} ${s.scrollReveal}`}>
          <button class={s.ctaPrimary} onClick={() => navigate("/vaults")}>
            Enter App
          </button>
          <button
            class={s.ctaSecondary}
            onClick={() => window.open("https://docs.qiara.xyz", "_blank")}
          >
            Documentation
          </button>
        </div>
      </section>
    </main>
  );
}

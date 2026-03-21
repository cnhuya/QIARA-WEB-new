import { Title } from "@solidjs/meta";
import { For, createSignal, createEffect, Show, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import  s  from "./welcome0.module.css";
type ContentBlock = {
  content_name: string;
  content: string;
};

type SubItem = {
  name: string;
  icon_path: string;
  slug: string;
  content?: ContentBlock[];
};

type Item = {
  name: string;
  icon_path: string;
  slug: string;
  content?: ContentBlock[];
  sub_items?: SubItem[];
};

type Group = {
  name: string;
  items: Item[];
};

const backers: Group[] = [
  { name: "Quick Start", items: [
    { name: "Introduction", icon_path: "/menu/welcome.svg", slug: "introduction",
      content: [
        { content_name: "Welcome!", content: "<p>Welcome to Qiara Protocol, a next-generation platform redefining Web 3.0 for everyone. Our goal is to modernize, simplify, and unify the Web 3.0 space. We do this by introducing Crosschain Messaging, which opens up new possibilities for the Web 3.0 ecosystem. For example, users can lend and borrow assets across multiple chains, swap tokens seamlessly, or even deploy a new memecoin on multiple chains at once in the future. Here is the full list of possibilities this technology will bring in the near future.</p>" },
        { content_name: "", content: `<div class=${s.list} style="transform: translateY(-1rem)">
              <div class="">
                <div class="row">
                  <div class="dot"></div>
                  <h4>Unified Liquidity</h4>   
                </div>
                <p>Cross-chain messaging connects liquidity across different blockchains. This removes the problem of fragmented assets and allows smoother transfers, better access to funds, and more efficient use of capital.</p>
              </div>
            
              <div class="">
                <div class="row">
                  <div class="dot"></div>
                  <h4>Crosschain Lending &amp; Borrowing</h4>
                </div>
                <p>Users can lend or borrow assets across multiple chains without moving funds manually. This creates new ways to earn yields, manage risk, and access liquidity instantly across ecosystems.</p>
              </div>
            
              <div class="">
                <div class="row">
                  <div class="dot"></div>
                  <h4>Crosschain Swapping</h4>
                </div>
                <p>Swap tokens directly from one chain to another in a secure and seamless way. No need for middle steps or centralized exchanges, making trades faster and cheaper.</p>
              </div>
  
              <div class="">
                <div class="row">
                  <div class="dot"></div>
                  <h4>Modular Interoperability</h4>
                </div>
                <p>
                  What if you could interact with chain A from chain B seamlessly without needing
                  to download another wallet just because yours doesn’t support that network or for
                  any other reason?
                </p>
              </div>
  
            
              <div class="">
                <div class="row">
                  <div class="dot"></div>
                  <h4>Multichain Token Schemes</h4>
                </div>
                <p>Tokens can exist and move across many blockchains at once. This improves flexibility for developers and gives users the freedom to use assets wherever they are needed.</p>
              </div>
            </div>` },
        { content_name: "", content: `<p style="transform: translateY(-3rem)">That’s not all, we are thinking big and we mean it. We are also planning to release multiple useful tools for developers, such as on-chain randomness, pre-written modules for games, public storage, and encrypted storage designed for enterprise use. Our goal is to create a platform that unifies not just liquidity, but the entire Web 3.0 space.  
  
              We aim to innovate, build, and support the community. That’s why we are introducing a new trading model: Non-Liquidative Perpetual Trading. We are tired of manipulations by big players in the Web 3.0 industry, which hurt many users and damage the ecosystem more than most people realize. Nowadays, the first impression many have of cryptocurrency is “scam.” We want to change that and help not only everyday users succeed but also attract more people to be interested in the Web 3.0 space itself.  
              
              Everyone should have a fair chance to win, not just the giants. We are changing the game for all participants. We are Qiara, a protocol built by the people, for the people.</p>` },

      ]
    },
    { name: "Readme", icon_path: "/menu/readme.svg", slug: "readme",
      content: [
        { content_name: "Preliminary Notes", content: `<p>Please keep in mind that the Qiara Protocol is still in its early stages. You may come across typos, visual bugs, or other issues. If you encounter, notice, or hear about any of these, please report them to us — you will be rewarded.</p><p>The documentation for Qiara products is also not yet complete. We will continue to expand and improve it, from explaining features in more detail to providing endpoints for developers.</p>` },
        { content_name: "Law", content: `<p>Please make sure to carefully read every sub-section in the Law section. If you have any questions, feel free to contact us.</p><p><strong>Disclaimer:</strong> By using the Qiara Protocol, you agree to and accept all terms outlined in the Law section. Qiara assumes no liability for any misuse, misinterpretation, or non-compliance with these terms.</p>` },
      ]
    },
    { name: "Brand Kit", icon_path: "/icon.webp", slug: "brand-kit",
      content: [
        { content_name: "Icons", content: `<p>All of the icons that we use are publicly uploaded on <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>. Anyone can look them up, download them, and freely use them in any conditions.</p>` },
        { content_name: "Source Code", content: `<p>For now, the source code is unavailable for security reasons, but we do plan in the near future to also make our source code public on GitHub, so that anyone can freely view and fork it.</p>` },
      ]
    },
  ]},
  { name: "Investors", items: [
    { name: "Welcome", icon_path: "/menu/hi_investors.svg", slug: "welcome-investors",
      content: [
        { content_name: "Who are we?", content: "<p>We are just three guys. Two of us are fresh graduates who finished our studies this year (2025), and the third is our manager, who helps us with social media, potential partnerships, and overall coordination. While we may not have a lot of experience yet, we are here to create something amazing. We hope you’ll give us a chance, because we are thinking big.</p>" },
        { content_name: "Goals", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
        { content_name: "", content: `<div class=${s.list}  style="transform: translateY(-3rem)">
    <div class="">
      <div class="row">
        <div class="dot"></div>
        <h4>Decentralization</h4>   
      </div>
      <p>We are doing our best to make our project as decentralized as possible. So far, we have achieved great progress with public proposals and our decentralized Layer-2 like structure.</p>
    </div>
  
    <div class="">
      <div class="row">
        <div class="dot"></div>
        <h4>Innovation</h4>
      </div>
      <p>Innovation is our next big mission. We aim to create truly new and unique technology. We believe that many people and developers in the Web 3.0 space have become complacent, as most protocols are simply rip-offs or forks of existing projects. We are built differently, we think, research, and build with passion.</p>
    </div>
  
    <div class="">
      <div class="row">
        <div class="dot"></div>
        <h4>Security</h4>
      </div>
      <p>Security is a major concern in Web 3.0. We thoroughly test all our features with the help of well-known experts in the field who carefully review and audit our code.</p>
    </div>  
  
    <div class="">
      <div class="row">
        <div class="dot"></div>
        <h4>Capital Efficiency</h4>
      </div>
      <p>We believe that general knowledge about investing and money management is still very limited. Many people leave their money idle, effectively losing value. While it may not seem like much at first, losing a few percent every year due to inflation and other factors can add up quickly. For example, the dollar has lost nearly 50% of its value in the past few years.</p>
    </div>  
  
    <div class="">
      <div class="row">
        <div class="dot"></div>
        <h4>Personification</h4>
      </div>
      <p>We don’t want to be just another plain white-page website. While the “classic” theme will still be available, we are focused on personification, not only in terms of design and visuals, but also in language and, possibly in the future, even sound.</p>
    </div>
  </div>` },

      ]
    },
    { name: "Why us", icon_path: "/menu/question.svg", slug: "why-us",
      content: [
        { content_name: "Innovators", content: "<p>We truly believe that we bring unique ideas that can brighten the Web 3.0 space as it stands today. With the technology we have already built and the concepts still on paper or in our heads we generate fresh ideas almost daily. That is our core strength.</p>" },
        { content_name: "Technology", content: "<p>If you believe in technology, you will be rewarded. We aim to make our solutions as unique as possible. Even when something is similar to an existing idea, we always strive to push one step further. From building cross-chain lending & borrowing to non-liquidative perpetual trading, our goal is always to innovate.</p>" },
        { content_name: "The Numbers Speak for Themselves", content: "<p>What if we told you that our product is essentially a combination of markets worth more than $150 billion, with the potential to grow to $500 billion in the future? Yes, that’s right. Below you can dive deeper into the numbers.</p>" },
        { content_name: "", content: `<div class=${s.list} style="transform: translateY(-1.5rem)">
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Lending &amp; Borrowing (~80B USD)</h4>   
          </div>
          <p>The value is based on the current TVL across lending &amp; borrowing markets listed on DefiLlama. However, the real estimated value of the top projects, when considering their full potential, could easily be double.</p>
        </div>
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Bridging (~60B USD)</h4>
          </div>
          <p>This value is likely underestimated. Monthly bridged volume is already over $15B, which translates to $180B annually. With our technology, the potential is even higher thanks to several advantages, for example, our bridging does not require gas on the recipient wallet, making it more user friendly.</p>
        </div>
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>DEX (~20B USD)</h4>
          </div>
          <p>Decentralized exchanges are a key area we aim to innovate and redefine. The current market value is around $20B, but if you include liquidity across all chains, the real figure is likely double or even triple.</p>
        </div>  
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Layer-2 (~10B USD)</h4>
          </div>
          <p>The estimated $10B market value for Layer-2 solutions is already an understatement. For example, Base Network, an Ethereum Layer-2 alone is valued close to $6B.</p>
        </div>  
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Other (~10B USD)</h4>
          </div>
          <p>This includes additional technologies such as our token, governance voting, and other supporting innovations.</p>
        </div>  
      </div>` },

      ]
    },
    { name: "Near Future", icon_path: "/menu/near_future.svg", slug: "near-future",
      content: [
        { content_name: "Roadmap", content: "<p>Coming soon...</p>" },
      ]
    },
  ]},

  { name: "Technology", items: [
    { name: "Consesus", icon_path: "/menu/consensus.svg", slug: "consensus",
      sub_items: [
        { name: "Decentralization", icon_path: "/menu/decentralized.svg", slug: "Crosschain-decentralization",
          content: [
            { content_name: "Autonomous", content: "<p>The main benefit of our architecture is its ability to be completely decentralized and self-sustaining.</p> <p>This is only possible by our specialized infrastructure around our Zero Knowledge Consesus powered by zk-SNARKS built on Groth16 which you can read more about here. </p> <p>Because of that technology, Qiara Protocol can work seamlessly without internal interventions and without any central entity being required to monitor/control the protocol. </p>" },
            { content_name: "Completely Modular", content: "<p>We believe that Modularity when it comes to Web 3.0 space is essential to achieve the best results and overall bring Web 3.0 space to its new heights. We do plan to support as many leading blockchains as possible, for now we are focusing on EVM Ecosystem as whole, preciselly on Ethereum, and its Layer-2 blockchains with already existing and used ecosystem such as Base & Monad Networks.</p> <p>However we also do support Move Language Blockchains, we have built supportive Interfaces for Sui and obviously Supra which is our settlement layer, where all the magic is stored and happens.</p> " },
            { content_name: "Fully Governated", content: "<p>Governation plays huge role in decentralizated infrastructure. So we have built a unique system of decentralized governance, where ANYONE at ANYTIME can create their own proposal, which can include as MANY user proposed changes and possible, anyone can then participate and vote on the proposal, if it reaches enough quarom (votes), it then becames legitimate, and can be executed as passed proposal, which then onchain system automatically overwrites already existing variables, with new ones that were succesfully voted & pased on. </p> <p>We believe that this is the best way to ensure that our protocol is always in sync with the needs of the users.  We took it really serious, you can make a proposal to change literally anything. From Gas Ratios (protocol_revenue:protocol_reserves), to leverage coefficient (the maximum allowed leverage for Margin Trading, to experience gained for providing liquidity (by just using our protocol - basically just by depositing tokens), to even the inflation of our native token which is called Qiara, to even its inflation reducution per month, to achieve true scarcity.</p>" },

          ]
        },
        { name: "ZK Bridge", icon_path: "/menu/bridge.svg", slug: "zk-bridge",
          content: [
            { content_name: "Thesis", content: "<p>Qiara Protocol main focus is to bring true decentralization to the Web 3.0 space. By utilizing already existing powerfull technology so called Zero Knowledge, we have built our own consesus mechanism powered by Zero Knowledge  with a zk-SNARK prototype.</p> <p>There currently 2 main leading Zero Knowledge Prototypes. One is called zk-SNARK and the second one is zk-STARK, some may argue that there is also so called Bulletproofs, however we choosed to build our entire consesus around zk-SNARKS due to its simplicity, costs & speed of proving operation. </p> <p>We have also choosen Groth16 constructor for Zero Knowledge proofs. Due to few reasons. Compared to other competing constructors such as PLONK, Groth16 is singlehandlely more efficient, has smaller proof sizes and most of already existing blockchains have built in native support for Groth16.</p>" },
            { content_name: "Governance Modularity", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
            { content_name: "Crosschain Bridging", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
            { content_name: "Interfaces", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },

          ]
        },
        { name: "Modularity", icon_path: "/menu/CCTP.svg", slug: "modularity",
          content: [
            { content_name: "Thesis", content: "<p>We are just three guys. Two of us are fresh graduates who finished our studies this year (2025), and the third is our manager, who helps us with social media, potential partnerships, and overall coordination. While we may not have a lot of experience yet, we are here to create something amazing. We hope you’ll give us a chance, because we are thinking big.</p>" },
            { content_name: "Goals", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
          ]
        },
        { name: "Flow", icon_path: "/menu/flow.svg", slug: "flow",
          content: [
            { content_name: "Who are we?", content: "<p>We are just three guys. Two of us are fresh graduates who finished our studies this year (2025), and the third is our manager, who helps us with social media, potential partnerships, and overall coordination. While we may not have a lot of experience yet, we are here to create something amazing. We hope you’ll give us a chance, because we are thinking big.</p>" },
            { content_name: "Goals", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
          ]
        },
        { name: "Security", icon_path: "/menu/lock.svg", slug: "security",
          content: [
            { content_name: "Who are we?", content: "<p>We are just three guys. Two of us are fresh graduates who finished our studies this year (2025), and the third is our manager, who helps us with social media, potential partnerships, and overall coordination. While we may not have a lot of experience yet, we are here to create something amazing. We hope you’ll give us a chance, because we are thinking big.</p>" },
            { content_name: "Goals", content: "<p>Our goals are quite simple, we are building innovative technology to help people lose less and earn more, in not only fun ways but also new ways.</p>" },
          ]
        },
      ],
    },

    { name: "Swap", icon_path: "/menu/swap.svg", slug: "swap",
      sub_items: [
        { name: "Technology", icon_path: "/menu/technology.svg", slug: "swap-technology",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Fees", icon_path: "/menu/big_percentage.svg", slug: "swap-fees",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Implement", icon_path: "/menu/implement.svg", slug: "swap-implement",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Margin Trade", icon_path: "/menu/perps.svg", slug: "margin-trade",
      sub_items: [
        { name: "Trade", icon_path: "/menu/perps.svg", slug: "margin-trading-trade",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Fees", icon_path: "/menu/big_percentage.svg", slug: "margin-trading-fees",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Margins", icon_path: "/menu/convert.svg", slug: "margin-trading-margins",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Smart Trading", icon_path: "/menu/smart_trade.svg", slug: "margin-trading-smart-trading",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Implement", icon_path: "/menu/implement.svg", slug: "margin-trading-implement",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Shared", icon_path: "/menu/shared.svg", slug: "shared",
      sub_items: [
        { name: "Overview", icon_path: "/menu/view.svg", slug: "margin-trading-overview",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Implement", icon_path: "/menu/implement.svg", slug: "margin-trading-implement",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Market", icon_path: "/menu/bank.svg", slug: "market",
      sub_items: [
        { name: "Vaults", icon_path: "/menu/bank.svg", slug: "vaults",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Shared Liquidity", icon_path: "/menu/shared_liquidity.svg", slug: "shared-liquidity",
          content: [
            { content_name: "Introduction", content: "<p>Shared Liquidity could be totally gamechanging in the Web 3.0 space, it would not only solve Liquidity Fragmentation but also bring whole new understanding of the whole decentralized finance ecosystem of Web 3.0 platforms. For those who are unaware of the term Liquidity Fragmentantion, please hed to.</p>" },
            { content_name: "Precausions", content: `<p>We have developed a special smart contract, that is able to basically store certain amount of positives and negatives balances of each supported tokens per user address. Then we have also created a module which then provides the overall data of the supported coins, such as name, supply, symbol, oracle id etc...</p><p>The most important here is the oracle ID, because with that we can then utilize the native build in price oracles on the Supra Network, which futhermore helps us calculate and provide the overall user balances and debts more precisely. We also will try to implement new "liquidation" system, which technically wont even be considered as Liquidation.</p>` },
          ]
        },
        { name: "Supra iAssets", icon_path: "/menu/native_bank.svg", slug: "supra-iassets",
          content: [
            { content_name: "About", content: "<p>For those who do not know how iAssets work: essentially, it is a similar principle to our strategy, where we compound user-entrusted assets into other vaults. This can also be done with restaking and other compounding rewards.</p>" },
            { content_name: "iAssets Support", content: "<p>We are in close partnership with the Supra Team. We believe that Supra has strong potential in the Web 3.0 space. Because of this, we will also implement iAssets in our core market structure, which will further increase rewards by a few percent.</p>" },
          ]
        },
        { name: "Market Aggregration", icon_path: "/menu/aggregrator.svg", slug: "market-aggregration",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Liquidations", icon_path: "/menu/liquidations.svg", slug: "liquidations",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Implementation", icon_path: "/menu/implement.svg", slug: "implement",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Agents", icon_path: "/menu/automation.svg", slug: "agents",
      sub_items: [
        { name: "Setup", icon_path: "/menu/settings.svg", slug: "agents-setup",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Access", icon_path: "/menu/anti_manipulation.svg", slug: "agents-access",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Commands", icon_path: "/menu/commands.svg", slug: "agents-commands",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
  ]},
  { name: "Roadmap", items: [
        { name: "Genesis", icon_path: "/menu/genesis.svg", slug: "genesis",
          content: [
            { content_name: "The Next Chapter", content: `<p>
                We are stepping up our behind-the-scenes technology and rebuilding our entire web stack. The goal is to move toward a more modern and feature-rich system that includes built-in optimization technologies. This means faster loading speeds, stronger SEO performance, improved search capabilities, and an overall cleaner look and feel. We want our platform to be enjoyable to use, visually clear, and highly responsive for everyone who visits. In short, this is not just a minor update, but a foundational improvement to how our entire website operates.
              </p>` },
            { content_name: "Rebrands", content: `<p>
                No, we are not going for a complete rebrand. Qiara will remain Qiara. What we are planning is more of a thoughtful refresh to the overall design and layout of the website. Some elements you are already familiar with will stay the same, others will evolve, and new features will appear. Think of it as giving Qiara a fresh coat of paint and some new tools under the hood, while keeping the core identity intact. Change is healthy, and we want to make sure the changes we introduce feel exciting and meaningful rather than overwhelming.
              </p>` },
            { content_name: "New Features", content: `<p>
             With the Genesis Phase, we are introducing a number of new features that expand both functionality and user experience. Below you can find a growing list of what is coming.
              </p> <p>
             PSA: Sneak peek images of the new design may be shared on this blog once we officially begin the rebuilding process. Disclaimer: This list is still under active development. Some of the features listed here may be adjusted, postponed, or replaced as we move forward.
              </p>
              ` }, 
            { content_name: "", content: `<div class=${s.list}  style="transform: translateY(-1rem)">
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Personification</h4>
          </div>
          <p>
            With the Genesis Phase, customization will truly be in your hands. From fonts to sounds, 
            from color themes to layout styles, almost everything will be adjustable. Users will be 
            able to select from pre-built themes for a quick start, but that is only the beginning. 
          </p>
          <p>
            Imagine being able to create your own theme from scratch. If your favorite color is not 
            in the default palettes, you can add it. If you do not like the font of a theme, you can 
            duplicate it, swap the font, and save it as your own unique version. We want the 
            platform to feel like it belongs to you, shaped by your taste and preferences. 
          </p>
          <p>
            And yes, we are also experimenting with sounds. Not full music tracks, but subtle sound 
            effects that trigger on actions like pressing buttons or completing trades. It is a small 
            touch, but one that adds personality and liveliness to your experience. 
          </p>
        </div>
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Multi-Language</h4>
          </div>
          <p>
            Alongside customization, we want to make sure everyone feels at home on Qiara, regardless 
            of their native language. Our platform will support multiple languages, giving users 
            the choice to display the interface in the language they are most comfortable with. 
          </p>
          <p>
            If all goes according to plan, we may even go a step further with features like 
            self-translation or self-naming. This means you could literally rename elements of the 
            interface into whatever wording you prefer, giving you a level of personal control rarely 
            seen in platforms like ours. 
          </p>
        </div>  
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Perpetual Markets</h4>
          </div>
          <p>
            We are exploring new approaches to trading by introducing Non-Liquidative Perpetual 
            Trading and Time-Based Perpetual Trading. These features will begin on testnet, where 
            we can experiment and study their limitations. The goal is to bring innovative options 
            to traders that balance risk and opportunity in ways not seen in traditional markets. 
          </p>
        </div>  
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Automation</h4>
          </div>
          <p>
            We are also working on Automation, powered by the native Supra features. The idea is to 
            reduce stress for users by allowing them to set specific conditions and let the system 
            handle the rest. 
          </p>
          <p>
            For example, you could set an automated repayment of your borrow whenever a token reaches 
            a certain price, preventing liquidation. Or, if you view lending and borrowing markets 
            like tradeable assets, you could even design semi-automated long and short strategies. 
            The potential here is very exciting, and we cannot wait to see how our community uses it. 
          </p>
        </div>  
  
        <div class="">
          <div class="row">
            <div class="dot"></div>
            <h4>Developer Options</h4>
          </div>
          <p>
            Finally, we want to empower developers. Our public API will allow anyone to interact with 
            Qiara through simple requests, opening opportunities to build apps, bots, and tools with 
            Qiara as the foundation. 
          </p>
          <p>
            But we will not stop there. We are also preparing to release a CLI (command line tool) 
            and improved node setup options. These are designed to run on your own machine, enabling 
            you to validate transactions directly on our cross-chain bridge. In return, you could 
            earn Qiara Tokens as a reward for your contribution. This opens a door for more 
            community-driven participation and a stronger, more decentralized ecosystem. 
          </p>
        </div>  
      </div>` },
            ]

        },
    { name: "Released", icon_path: "/menu/released.svg", slug: "released",
      content: [
        { content_name: "Preliminary Notes", content: "<p>Released features...</p>" },
      ]
    },
    { name: "Upcoming", icon_path: "/menu/upcoming.svg", slug: "upcoming",
      content: [{ content_name: "Upcoming", content: "<p>Upcoming features...</p>" }]
    },
    { name: "Changes", icon_path: "/menu/hotfix.svg", slug: "changes",
      content: [{ content_name: "Changes", content: "<p>Changelog...</p>" }]
    },
  ]},
  { name: "Others", items: [
    { name: "Token", icon_path: "/menu/token.svg", slug: "token",
      sub_items: [
        { name: "Tokenomics", icon_path: "/menu/tokenomics.svg", slug: "tokenomics",
          content: [
            { content_name: "Introduction", content: `<p>
                This is a litepaper for a tokenomics of our token named Qiara, which is a multiple crosschain token system. We are implementing sort of unique and very long term tokenomics model, which should increase the overall value of each single Aexis Token, specially due to our interesting Arcana Program which you can learn more about here.
              </p>` },
            { content_name: "Innitial Supply Distribution", content: `<p>
                Here is a displayed graph of innitial supply distribution. The total amount of existing token on launch is going to be 1,000,000.
              </p>` },
            { content_name: "Inflation", content: `<p>
             Our token has built-in inflation, which consists of two main components. One component involves withdrawal proposals, where a specific amount of newly minted tokens can be requested from the vault for purposes such as advertising, exchange listing fees, or other approved uses.
              </p>` },
            { content_name: "Scarcity", content: `<p>We also made sure to implement multiple scarcity functions to futhermore increase the value of each Aexis Token. You can view all the scarcity messuaremenets below. </p>` },      
          ]
        },
        { name: "Utility", icon_path: "/menu/utility.svg", slug: "utility",
          content: [
            { content_name: "Providing Value", content: `<p>
                The first utility of the Qiara Token is to create value not only for everyday users but also for investors, KOLs, and other stakeholders.
              </p>` },
            { content_name: "Validator Rewards", content: `<p>
                Every validator can earn new Qiara Tokens either by validating already registered events or by submitting finalized validated events to the settlement layer.
              </p>` },
            { content_name: "Staking Rewards", content: `<p>
             To further strengthen the stability of Qiara Tokens, staking vaults are available. Currently, there are two options: one with a lock-time period and one without. You can stake your tokens to earn a percentage reward, and by choosing the locked option, you can receive an additional bonus percentage as a reward for supporting the long-term stability of Qiara Tokens.
              </p>` },
            { content_name: "XP Boost", content: `<p>You can either passively earn more XP by staking your Qiara Tokens or you can exchange your Qiara Tokens for XP.</p>` },      

            { content_name: "Governance", content: `<p>Any user who owns at least one Qiara Token has the right to vote on active proposals and contribute to the governance process. </p>` },      
          ]
        },
        { name: "Places To Buy", icon_path: "/menu/places_to_buy.svg", slug: "places-to-buy",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Protocol Stats", icon_path: "/menu/protocol_stats.svg", slug: "protocol-stats",
      sub_items: [
        { name: "Overview", icon_path: "/menu/tokenomics.svg", slug: "overview",
          content: [{ content_name: "Overview", content: "<p>Crosschain messaging overview...</p>" }]
        },
        { name: "Revenue", icon_path: "/menu/revenue.svg", slug: "revenue",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
        { name: "Reserves", icon_path: "/menu/reserve.svg", slug: "reserves",
          content: [{ content_name: "Overview", content: "<p>Crosschain swaps overview...</p>" }]
        },
      ],
    },
    { name: "Get Paid", icon_path: "/menu/dolar.svg", slug: "get-paid",
      content: [
        { content_name: "Bug Bounty", content: `<p>
            We take security seriously and are investing heavily in it. Currently, we operate a Bug Bounty Reward program, with rewards based on the severity of the security issue. You can view the table of reward tiers below.
          </p>` },
        { content_name: "Engagement", content: `<p>
            You can link your Twitter/X account with your Discord account and then proceed to the #Engagement channel, where you will find more information about this program. As of Q4 2025, you earn 10 points for each like on any post from our Twitter/X account.
          </p>` },
        { content_name: "Kol", content: `<p>
          If you are an influencer interested in working with us behind the scenes, you can reach out to us for further agreements. Becoming a KOL benefits both parties: you get updates on our ongoing projects, and in the future, you may be eligible for additional bonuses.
          </p>` },
        { content_name: "Suggest Idea", content: `<p>
            Are you an innovative thinker? Do you see ways we could improve our existing technology, or is there something missing in the Web3.0 space? Let us know! We welcome your ideas and are glad to hear what’s on your mind.
          </p> 
          <p>
            Tip: The more detailed your idea, the better. Include explanations, potential implementation strategies, references if it already exists, and any other relevant information.
          </p>` },      
      ]
    },
    { name: "Contact Us", icon_path: "/menu/contact.svg", slug: "contact-us",
      content: [
        { content_name: "Twitter", content: `<p>
            If you have any questions or come across a bug or issue, feel free to reach out to us directly via <a href="https://x.com/QiaraProtocol" target="_blank" rel="noopener noreferrer">Twitter/X</a> DMs.
          </p>` },
        { content_name: "Email", content: `<p>
            You can reach us at qiara.contact@gmail.com. Feel free to send us an email anytime.
          </p>` },
        { content_name: "Discord", content: `<p>
          Join our official Discord server by clicking <a href="https://github.com/" target="_blank" rel="noopener noreferrer">here</a>. We’d love to connect with you!
          </p>` },
        { content_name: "Onchain Message", content: `<p>
            You can also send us an on-chain message via the Supra network, costing less than $0.0001.
          </p>` },      
      ]
    },
  ]},
  { name: "Law", items: [
    { name: "Annotations", icon_path: "/menu/anotation.svg", slug: "annotations",
      content: [
        { content_name: "Icons", content: `<p>All of the icons that our platform uses are either from   <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer">Google Fonts</a> or from <a href="https://www.svgrepo.com/" target="_blank" rel="noopener noreferrer">SVG Repo </a></p>` },
        { content_name: "Data Visualisation", content: `<p>We are using <a href="https://apexcharts.com/" target="_blank" rel="noopener noreferrer">Apex Charts </a> which helps us to display Data as simple and visualy pleasing as possible.</p>` },
      ]
    },
    { name: "Codex", icon_path: "/menu/codex.svg", slug: "codex",
      content: [
        { content_name: "Disclaimer", content: `<p>All validators are required to read this Codex thoroughly and carefully. This Codex helps protect both users and validators, please follow these simple rules.</p>` },
        { content_name: "1. Rule", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Don’t modify core code unless you fully understand the change and its impact.</p>` },
        { content_name: "2. Rule", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Personal/optimization edits are allowed, but they must not introduce harmful behavior or break expected functionality.</p>` },
        { content_name: "3. Rule", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Test first, always: run changes in a safe environment (local, sandbox, or testnet) and verify results before any production/mainnet use.</p>` },
        { content_name: "4. Rule", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Never deploy untested changes to mainnet, use testnet please.</p>` },
        { content_name: "5. Rule", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Document your modifications (what changed, why, and how to revert) before sharing or deploying.</p>` },
        { content_name: "Important Notice", content: `<p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Faulty, non-compliant, or suspicious code may be flagged as malicious.</p><p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">Validators running such code may be slashed, risking partial or total loss of staked funds, and may be blacklisted by the network.</p><p style="margin-left: 1rem; margin-right: 1rem; margin-top: 0.25rem;">You are responsible for verifying builds, dependencies, and configuration before running this software.</p>` },
      ]
    },
    { name: "Terms of Service", icon_path: "/menu/terms_of_service.svg", slug: "terms-of-service",
      content: [
        { content_name: "Important", content: `<p>
            Please read these Terms of Service ("Terms", "Agreement") carefully before accessing or using Qiara Protocol (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
          </p>` },
        { content_name: "1. Eligibility", content: `<p>You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement.</p>` },
        { content_name: "2. Restricted Jurisdictions", content: `<p>Due to regulatory restrictions, the Service is not available to individuals or entities located in, incorporated in, or residents of jurisdictions where the use of cryptocurrencies, digital assets, or related services are prohibited or restricted under applicable law.This includes, but is not limited to, countries such as [e.g., China, Bangladesh, Algeria, Egypt, Morocco, Nepal, Qatar, Tunisia, and any other jurisdictions that fully ban cryptocurrencies].By using the Service, you confirm that you are not accessing it from such a restricted jurisdiction and that you comply with all applicable local laws.</p>` },
        { content_name: "3. No Guarantee of Stability or Functionality", content: `<p>The Service is provided on an "as is" and "as available" basis. We do not guarantee the stability, security, uptime, performance, or continuous functionality of the Service. We make no warranties or representations regarding the accuracy, reliability, or availability of the Service or its associated features. Use of the Service is entirely at your own risk.</p>` },
        { content_name: "4. Risk Disclosure", content: `<p>
  Cryptocurrency and digital assets involve a high degree of risk, including but not limited to market volatility, regulatory uncertainty, technical failures, and cybersecurity threats. You acknowledge and accept these risks when using the Service. We are not responsible for any financial losses, damages, or liabilities arising from your use of the Service.
          </p>` },
        { content_name: "5. Prohibited Use", content: `<p>
  You agree not to use the Service for any unlawful purposes, including but not limited to fraud, money laundering, terrorist financing, or any activity in violation of applicable sanctions or laws.
          </p>` },
        { content_name: "6. Limitation of Liability", content: `<p>
  To the maximum extent permitted by law, Qiara Protocol, its affiliates, and service providers shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.
          </p>` },
        { content_name: "7. Modifications", content: `<p>
  We reserve the right to update or modify these Terms and Privacy Policy at any time. Continued use of the Service after such modifications constitutes your acceptance of the revised Terms.
          </p>` },
        { content_name: "8. Governing Law", content: `<p>
  These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction/State/Country], without regard to its conflict of law principles.
          </p>` },
        { content_name: "9. Governance and Emergency Authority", content: `<p>
  While Qiara Protocol operates as a decentralized platform, you acknowledge and agree that governance is conducted through a decentralized autonomous organization (DAO). The DAO reserves the right, by way of a governance vote, to take emergency actions where necessary to protect the integrity of the network. Such actions may include, but are not limited to, banning or restricting access of validators, and initiating the withdrawal of balances from validator staking vaults if a validator is determined to be acting maliciously, negligently, or in a manner that could harm the network or its participants.
          </p>` },
      ]
    },
    { name: "Privacy", icon_path: "/menu/privacy.svg", slug: "privacy",
      content: [
        { content_name: "Introduction", content: `<p>
            This Privacy Policy explains how we handle any information related to the use of our Service.
          </p>` },
        { content_name: "1. Information We Collect", content: `<p>
  We do not collect personal information such as names, emails, or contact details. The only information we record is your blockchain wallet address when you accept our Terms of Service. Please note that wallet addresses are public information visible on the blockchain.
          </p>` },
        { content_name: "2. How We Use Your Information", content: `<p>We use your wallet address solely to track acceptance of our Terms of Service. We do not use it for marketing, personalization, or any other purpose.</p>` },
        { content_name: "3. Sharing of Information", content: `<p>
  Since wallet addresses are already public, we do not share your information with third parties beyond what is visible on the blockchain. We do not sell your information.
          </p>` },
        { content_name: "4. Data Securityle", content: `<p>We take reasonable precautions to ensure that any data we record is handled securely. However, wallet addresses recorded on the blockchain are public and immutable.</p>` },
        { content_name: "5. Data Retention", content: `<p>We retain wallet addresses only as long as necessary to confirm acceptance of our Terms of Service.</p>` },
        { content_name: "6. Your Rights", content: `<p>Since we do not collect personal information, typical privacy rights such as deletion or portability are not applicable.</p>` },
      ]
    },
  ]},
];

// Flatten all navigable items (including sub_items)
const allItems: (Item | SubItem)[] = backers.flatMap(g =>
  g.items.flatMap(item =>
    item.sub_items ? item.sub_items : [item]
  )
);

const defaultItem = allItems[0];

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed] = createSignal<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = createSignal<Set<string>>(new Set());
  const [activeAnchor, setActiveAnchor] = createSignal<string>("");
  const [visible, setVisible] = createSignal(false);
  // Scroll-triggered reveal
  const observe = () => {
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add(s.visible);
            observer.unobserve(e.target);
          }
        }),
        { threshold: 0.15 }
      );
      document.querySelectorAll(`.${s.scrollReveal}`).forEach(el => {
        el.classList.remove(s.visible); // reset first
        observer.observe(el);
      });
    }, 50); // small delay so DOM has updated
  };

  onMount(observe);

  createEffect(() => {
    activeItem(); // track dependency
    observe();
  });

  const activeItem = (): Item | SubItem =>
    allItems.find(i => i.slug === searchParams.page) ?? defaultItem;

  createEffect(() => {
    const first = activeItem().content?.[0]?.content_name ?? "";
    setActiveAnchor(first);
  });

  const navigate = (item: Item | SubItem) => {
    setSearchParams({ page: item.slug });
  };

  const toggleExpand = (slug: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const toggleCollapse = (key: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const scrollTo = (name: string) => {
    setActiveAnchor(name);
    document.getElementById(`content-${name}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (item: Item | SubItem) => activeItem().slug === item.slug;

  return (
    <main style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center;">
      <Title>Qiara | Docs — {activeItem().name}</Title>
      <div style="display: flex; flex-direction: column; width: 100%; max-width: 90rem; height: 50rem; gap: 0.25rem;">

        {/* Top bar */}
        <div class="row border" style="width: 100%; height: 2.5rem; padding: 0 1rem; flex-shrink: 0; gap: 0.25rem; justify-content: start;">
          <img src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/icon.webp" style="width: 1.5rem; height: 1.5rem; border-radius: 0.25rem;" />
          <h4 style="margin: 0; opacity: 0.8;">Qiara Docs</h4>
        </div>

        <div class="row" style="width: 100%; flex: 1; overflow: hidden; gap: 0.25rem;">

          {/* Left menu */}
          <div class="column border" style="width: 16rem; flex-shrink: 0; height: 100%; overflow-y: auto; padding: 0.75rem 0.5rem; gap: 0.1rem; align-content: start; justify-content: start;">
            <For each={backers}>
              {group => (
                <div class="column" style="width: 100%; gap: 0.1rem;">
                  <p style="font-size: 0.7rem; opacity: 0.4; padding: 0.25rem 0.5rem; margin: 0.5rem 0 0.1rem; text-transform: uppercase; letter-spacing: 0.08em;">{group.name}</p>
                  <For each={group.items}>
                    {item => (
                      <div class="column" style="width: 100%; gap: 0;">

                        {/* Item button */}
                        <div class="row" style="width: 100%; gap: 0;">
                          <button
                            onClick={() => item.sub_items ? toggleExpand(item.slug) : navigate(item)}
                            class={isActive(item) ? "active" : ""}
                            style={{
                              flex: "1",
                              display: "flex",
                              "align-items": "center",
                              gap: "0.5rem",
                              padding: "0.25rem 0.5rem",
                              height: "2rem",
                              "justify-content": "flex-start",
                              "text-align": "start",
                              "font-size": "0.85rem",
                              border: "1px solid transparent",
                            }}
                          >
                            <img
                              src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main${item.icon_path}`}
                              style="width: 1.25rem; height: 1.25rem; flex-shrink: 0;"
                            />
                            {item.name}
                          </button>

                          {/* Expand arrow for items with sub_items */}
                          <Show when={item.sub_items}>
                            <button
                              onClick={() => toggleExpand(item.slug)}
                              style={{
                                width: "2rem",
                                height: "2rem",
                                display: "flex",
                                "align-items": "center",
                                "justify-content": "center",
                                border: "1px solid transparent",
                                "flex-shrink": "0",
                              }}
                            >
                              <img
                                src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/arrow_down.svg"
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  transition: "transform 0.2s ease",
                                  transform: expandedItems().has(item.slug) ? "rotate(0deg)" : "rotate(-90deg)",
                                }}
                              />
                            </button>
                          </Show>
                        </div>

                        {/* Sub items */}
                        <Show when={item.sub_items && expandedItems().has(item.slug)}>
                          <div class="column" style="width: 100%; padding-left: 1.25rem; gap: 0;">
                            <For each={item.sub_items}>
                              {sub => (
                                <button
                                  onClick={() => navigate(sub)}
                                  class={activeItem().slug === sub.slug ? "active" : ""}
                                  style={{
                                    display: "flex",
                                    "align-items": "center",
                                    gap: "0.5rem",
                                    width: "100%",
                                    padding: "0.25rem 0.5rem",
                                    height: "2rem",
                                    "justify-content": "flex-start",
                                    "text-align": "start",
                                    "font-size": "0.8rem",
                                    border: "1px solid transparent",
                                  }}
                                >
                                  <img
                                    src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main${sub.icon_path}`}
                                    style="width: 1rem; height: 1rem; opacity: 0.75; flex-shrink: 0; border-radius: 0"
                                  />
                                  {sub.name}
                                </button>
                              )}
                            </For>
                          </div>
                        </Show>

                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
            <div class="row" style="border-top: var(--border); padding: var(--pad25); width: 100%; justify-content: center; gap: 2rem;">
              <img class="img-hover" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/socials/discord.svg" style="width:1.5rem;height:1.5rem;flex-shrink:0;"></img>
              <img  class="img-hover" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/socials/twitter.svg" style="width:1.5rem;height:1.5rem;flex-shrink:0;"></img>
              <img   class="img-hover" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/socials/github.svg" style="width:1.5rem;height:1.5rem;flex-shrink:0;"></img>

            </div>
          </div>

          {/* Main content */}
          <div class="column border" style=" width: 100%; height: 100%; padding: 1.5rem 2rem; gap: 1.5rem; justify-content: start; align-content: start; overflow-y: auto;">
            <h2 style="margin: 0; width: 100%; text-align: start; border-bottom: var(--border); padding-bottom: var(--pad25);">
              {activeItem().name}
            </h2>
            <For each={activeItem().content ?? []}>
              {(block: ContentBlock, i) => {
                const key = block.content_name;
                const isCollapsed = () => collapsed().has(key);
                return (
                  <div
                    id={`content-${key}`}
                    class={s.scrollReveal + " column"}
                    style={{ width: "100%", "transition-delay": `${i() * 0.15}s` }}
                  >
                    <button
                      onClick={() => toggleCollapse(key)}
                      style={{
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "space-between",
                        width: "100%",
                        height: "2.5rem",
                        "font-size": "0.95rem",
                        "font-weight": "500",
                        border: "1px solid var(--bg)",
                        background: "var(--color-background-secondary, rgba(255,255,255,0.03))",
                      }}
                    >
                      <span>{block.content_name}</span>
                      <img
                        src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/arrow_down.svg"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          opacity: "0.5",
                          transition: "transform 0.2s ease",
                          transform: isCollapsed() ? "rotate(-90deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>
                    <Show when={!isCollapsed()}>
                      <div
                        style="width: 100%; display: flex; flex-direction: column; padding: 0.25rem 1rem; font-size: 0.875rem; line-height: 1.7; opacity: 0.8; text-align: start; gap: 0.25rem;"
                        innerHTML={block.content}
                      />
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>

          {/* Right submenu */}
          <div class="column border" style="width: 13rem; flex-shrink: 0; height: 100%; overflow-y: auto; padding: 0.75rem 0.5rem; gap: 0.25rem; align-content: start; justify-content: start;">
            <p style="font-size: 0.7rem; opacity: 0.4; padding: 0.25rem 0.5rem; margin: 0; text-transform: uppercase; letter-spacing: 0.08em;">On this page</p>
            <For each={activeItem().content ?? []}>
              {(block: ContentBlock) => (
                <button
                  onClick={() => scrollTo(block.content_name)}
                  style={{
                    width: "100%",
                    "justify-content": "flex-start",
                    "text-align": "start",
                    opacity: activeAnchor() === block.content_name ? "1" : "0.45",
                    background: activeAnchor() === block.content_name ? "var(--color-background-secondary, rgba(255,255,255,0.05))" : "transparent",
                    border: activeAnchor() === block.content_name ? "0.5px solid var(--color-border)" : "0.5px solid transparent",
                    "border-left": activeAnchor() === block.content_name ? "2px solid var(--accent, #4ade80)" : "2px solid transparent",
                    "border-radius": "0",
                  }}
                >
                  {block.content_name}
                </button>
              )}
            </For>
          </div>

        </div>
      </div>
    </main>
  );
}
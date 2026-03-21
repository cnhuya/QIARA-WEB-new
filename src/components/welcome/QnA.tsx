import { For } from "solid-js";

const questions = [
  { number: 1, question: "What makes Qiara Protocol different from current protocols?", 
    answer: "Qiara Protocol is here to bring new values & views to the cryptocurrency community. None of the current leaders of decentralized finance have the combined technology like Qiara Protocol do. Qiara Protoco is built by the People for the People. Not only Qiara Protocol is one of the few protocols that arent predatory, on top of that Qiara Protocol most likely offers the highest capital efficiency on the market which includes of the highest earning APY on the market right now. "  },
  { number: 2, question: "Where does the huge yield comes from?", answer: "Its simple. We have create our own specialized Zero Knowledge Bridge, for multiple different language VM machines such as EVM or Move. This then allows us to provide users huge yield which is powered by users depositing into vaults from our supported providers and on top of that any fee displayed and accounted on Qiara Protocol goes back to users. Expect for the Gas fee, which is split for protocol reserves and protocol revenue. "  },
  { number: 3, question: "Does Qiara Protocol have telegram?", answer: "No. Qiara Protocol as for now does not have any telegram channel at all. Please be cautious of scammers."  },
  { number: 4, question: "I have discovered/encountered an issue with the protocol, how can I report it?", answer: "Please message us anywehere. You can message us on Twitter (X), Discord, Email or Onchain. If the issue is critical, you might be rewarded."  }, 
  { number: 5, question: "I am a developer and I would like to implemenet Qiara Protocol core featues into my project.", answer: "All current possible features that are implementable are documentated in our official documentation. However our custom Zero-Knowledge Bridge for now is closed source and not available for public use due to security reasons and still pending audits. Once all audits are done, we do plan also open source the custom Zero-Knowledge Bridge. If you have any other questions or would like to colaborate with us, we are open to any kind of collaboration. "  },
] as const;

export default function QnA() {
  return (
    <div class="column" style="height: 100%; width: 100%; padding: 0.5rem; gap: 0.5rem; overflow: hidden;">

      <div style="width: 100%; overflow: hidden; position: relative;">

          <For each={questions}>
            {q => (
              <div class="column" style=" align-items: center; flex-shrink: 0;">
                <div class="row width" style="width: 100%; max-width: 100%; justify-content: flex-start; gap: 0.5rem; padding: 0.25rem;align-items: center; flex-shrink: 0;">
                  <img src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/question.svg`} style="width: 1.5rem; height: 1.5rem;" />
                  <h3 style="margin: 0;text-align: start;">#{q.number}</h3>
                  <h3 style="margin: 0;text-align: start;">{q.question}</h3>
                </div>
                <div class="row width" style="justify-content: flex-start;padding: 0.25rem; align-items: center; flex-shrink: 0;">
                  <p style="margin: 0; text-align: left; ">{q.answer}</p>
                </div>
              </div>

            )}
          </For>
      </div>
    </div>
  );
}
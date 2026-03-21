import { A } from "@solidjs/router";
import { JSX } from "solid-js";

type PageProps = {
  name: string;
  description: string;
  header: string;
  content?: JSX.Element;
  contentFn?: () => JSX.Element;
};

export function Page(props: PageProps) {
  return (
    <div class="column border width" style="width: 70rem; height: 50rem; align-items: center; justify-content: flex-start;">
      <div class="column width" style="justify-content: flex-start;">
        <div class="row width" style="justify-content: flex-start;">
          <h1>{props.name}</h1>
          <A class="hover right row" href="/">Documentation <img class="link" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/link.svg" /></A>
          <A class="hover row" href="/">Source Code <img class="link" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/link.svg" /></A>
        </div>
        <p class="width" style="text-align: left;">{props.description}</p>
      </div>
      {props.contentFn ? props.contentFn() : props.content}
    </div>
  );
}
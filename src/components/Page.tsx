import { JSX } from "solid-js";

type PageProps = {
  name: string;
  description: string;
  header: string;
  content?: JSX.Element;
  contentFn?: () => JSX.Element;
  links?: JSX.Element;
};

export function Page(props: PageProps) {
  return (
    <div class="column border width" style="width: 70rem; height: 50rem; align-items: center; justify-content: flex-start;">
      <div class="column width" style="justify-content: flex-start;">
        <div class="row width" style="justify-content: flex-start;">
          <h1>{props.name}</h1>
          {props.links}
        </div>
        <p class="width" style="text-align: left;">{props.description}</p>
      </div>
      {props.contentFn ? props.contentFn() : props.content}
    </div>
  );
}
import { JSX } from "solid-js";

type LinkProps = {
  header?: JSX.Element | JSX.Element[];
  content?: JSX.Element | JSX.Element[];
  headerFn?: () => JSX.Element;
  contentFn?: () => JSX.Element;
};

export function Table(props: LinkProps) {
  return (
    <div class="s column" style="width: 100%; height: 100%; justify-content: flex-start; padding: var(--pad25); gap: var(--gap25);">
      <div class="row width">{props.headerFn ? props.headerFn() : props.header}</div>
      <div class="column width" style="justify-content: flex-start; height: 100%; padding: 0.5rem;">{props.contentFn ? props.contentFn() : props.content}</div>
    </div>
  );
}
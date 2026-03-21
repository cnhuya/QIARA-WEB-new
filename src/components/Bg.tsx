import { JSX } from "solid-js";

type LinkProps = {
  header: string;
  content?: JSX.Element;
  contentFn?: () => JSX.Element;
  width?: string;
  height?: string;
  onClose: () => void;
};

export function Bg(props: LinkProps) {
  const Content = () => props.contentFn ? props.contentFn() : props.content;

  return (
    <div class="blur_back">
      <div class="column border" style={{ width: props.width, height: "auto", "justify-content": "flex-start", background: "var(--bg)", gap: 0 }}>
        <div class="row width" style={{ "border-bottom": "var(--border)", padding: "var(--pad25)", gap: "var(--gap25)" }}>
          <img alt="settings" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/settings.svg" />
          <h4>{props.header}</h4>
          <img class="right close" alt="close" src="https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/menu/close.svg" onClick={props.onClose} />
        </div>
        <Content />
      </div>
    </div>
  );
}
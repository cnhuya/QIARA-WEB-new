import { A } from "@solidjs/router";

type LinkProps = {
  folder: string;
  name: string;
  icon_type: string;
  path: string;
  label: string;
  class?: string;
  isLink?: boolean; // optional, defaults to true
};

export function NavLink(props: LinkProps) {
  if (props.isLink === false) {
    // Render a "non-clickable" placeholder
    return (
      <button class={`${props.class ?? ""} row border hover`}  style="width: min-content;">
        <img
          src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/${props.folder}/${props.name}.${props.icon_type}`}
          alt={props.name}
        />
        {props.label}
      </button>
    );
  }

  // Default: regular Solid router link
  return (
    <A
      href={`/${props.path.toLowerCase()}`}
      activeClass="active"
      class={`${props.class ?? ""} row border hover`}
    >
      <img
        src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/${props.folder}/${props.name}.${props.icon_type}`}
        alt={props.name}
      />
      {props.label}
    </A>
  );
}
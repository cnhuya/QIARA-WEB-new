import { createSignal, JSX } from "solid-js";
import { NavLink } from "./Navlink";

// Type for header button links
type LinkProps = {
  folder: string;
  name: string;
  icon_type: string;
  path: string;
  label: string;
  class?: string;
  isLink?: boolean;
  styled?: boolean;
};

// HeaderButton props type
type HeaderButtonProps = {
  class?: string;
  main_link: LinkProps;
  navlinks?: LinkProps[];
};

export function HeaderButton(props: HeaderButtonProps) {
  return (
    <div class={`${props.class ?? ""} menu-button`}>
      <NavLink {...props.main_link} />
      {props.navlinks && props.navlinks.length > 0 && (
        <div class="menu">
          {props.navlinks.map(link => (
            <NavLink {...link} />
          ))}
        </div>
      )}
    </div>
  );
}
type ButtonProps = {
  folder?: string;   // ✅ now optional
  name?: string;     // ✅ now optional
  icon_type?: string; // ✅ now optional
  label: string;
  class?: string;
  active?: boolean;   // 👈 explicit
  onClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
};
export function Button(props: ButtonProps) {
  const [active, setActive] = createSignal(false);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    setActive(!active());
    props.onClick?.(e);
  };

  return (
    <button
      class={`${props.class ?? ""} hover`}
      classList={{ active: props.active ?? false }}
      onClick={handleClick}
    >
      {props.folder && props.icon_type && (  // ✅ only render if both are set
        <img
          src={`https://raw.githubusercontent.com/cnhuya/AEXIS-CDN/main/${props.folder}/${props.name}.${props.icon_type}`}
          alt={props.label}
        />
      )}
      {props.label}
    </button>
  );
}

type HeaderButtonProps2 = {
  class?: string;
  main_button: ButtonProps;
  buttons?: ButtonProps[];
};

export function HeaderButton2(props: HeaderButtonProps2) {
  return (
    <div class={`${props.class ?? ""} menu-button`}>
      <Button {...props.main_button} />
      {props.buttons && props.buttons.length > 0 && (
        <div class="menu">
          {props.buttons.map((link) => (
            <Button {...link} />
          ))}
        </div>
      )}
    </div>
  );
}
import { splitProps, type Component, type ComponentProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { buttonClass } from "@components/Button/Button.recipes";
import { buttonSplitProps } from "@components/Button/Button";

export type LinkProps = ComponentProps<"a"> & VariantProps<typeof buttonClass>;

export const Link: Component<LinkProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...rest}
      class={buttonClass({ class: props.class, variant: "link", ...split })}
    />
  );
};

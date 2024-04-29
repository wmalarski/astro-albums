import { splitProps, type Component } from "solid-js";
import { buttonClass } from "@components/Button/Button.recipes";
import { buttonSplitProps } from "@components/Button/Button";
import type { ComponentVariantProps } from "@components/utils/twCva";

export type LinkProps = ComponentVariantProps<"a", typeof buttonClass>;

export const Link: Component<LinkProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={buttonClass(split)} />;
};

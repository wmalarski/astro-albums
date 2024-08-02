import type { ComponentVariantProps } from "@components/utils/twCva";
import { splitProps, type Component } from "solid-js";
import { buttonClass } from "./Button.recipes";

export const buttonSplitProps = [
  "color",
  "isLoading",
  "shape",
  "size",
  "variant",
  "width",
  "disabled",
  "class",
] as const;

export type ButtonProps = ComponentVariantProps<"button", typeof buttonClass>;

export const Button: Component<ButtonProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <button {...rest} class={buttonClass(split)} disabled={props.disabled} />
  );
};

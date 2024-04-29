import { splitProps, type Component } from "solid-js";
import { buttonClass } from "./Button.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";

export const buttonSplitProps = [
  "class",
  "color",
  "isLoading",
  "shape",
  "size",
  "variant",
  "width",
  "disabled",
] as const;

export type ButtonProps = ComponentVariantProps<"button", typeof buttonClass>;

export const Button: Component<ButtonProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <button
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
      disabled={props.disabled}
    />
  );
};

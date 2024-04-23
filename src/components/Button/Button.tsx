import { splitProps, type Component, type ComponentProps } from "solid-js";
import { buttonClass } from "./Button.recipes";
import type { VariantProps } from "class-variance-authority";

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

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonClass>;

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

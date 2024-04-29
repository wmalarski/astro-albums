/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HTMLAttributes, HTMLTag } from "astro/types";
import { cva, cx, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ValidComponent } from "solid-js";
import { twMerge } from "tailwind-merge";

export type ComponentVariantProps<
  Tag extends ValidComponent,
  Component extends (...args: any) => any,
> = ComponentProps<Tag> & VariantProps<Component>;

export type ComponentVariantAttributes<
  Tag extends HTMLTag,
  Component extends (...args: any) => any,
> = HTMLAttributes<Tag> & VariantProps<Component>;

export const twCva: typeof cva = (...args) => {
  const result = cva(...args);

  return (props) => {
    return twMerge(result(props));
  };
};

export const twCx: typeof cx = (...args) => {
  return twMerge(cx(...args));
};

import type { Component } from "solid-js";

import {
  labelDescriptionClass,
  labelClass,
  labelTextClass,
} from "./Label.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";

export type LabelProps = ComponentVariantProps<"label", typeof labelClass>;

export const Label: Component<LabelProps> = (props) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label {...props} class={labelClass()} />;
};

export type LabelTextProps = ComponentVariantProps<
  "span",
  typeof labelTextClass
>;

export const LabelText: Component<LabelTextProps> = (props) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <span {...props} class={labelTextClass()} />;
};

export type LabelDescriptionProps = ComponentVariantProps<
  "span",
  typeof labelDescriptionClass
>;

export const Description: Component<LabelDescriptionProps> = (props) => {
  return <span {...props} class={labelDescriptionClass()} />;
};

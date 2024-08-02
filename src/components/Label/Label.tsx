import type { Component } from "solid-js";

import type { ComponentVariantProps } from "@components/utils/twCva";
import {
  labelClass,
  labelDescriptionClass,
  labelTextClass,
} from "./Label.recipes";

export type LabelProps = ComponentVariantProps<"label", typeof labelClass>;

export const Label: Component<LabelProps> = (props) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label {...props} class={labelClass({ class: props.class })} />;
};

export type LabelTextProps = ComponentVariantProps<
  "span",
  typeof labelTextClass
>;

export const LabelText: Component<LabelTextProps> = (props) => {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <span {...props} class={labelTextClass({ class: props.class })} />;
};

export type LabelDescriptionProps = ComponentVariantProps<
  "span",
  typeof labelDescriptionClass
>;

export const Description: Component<LabelDescriptionProps> = (props) => {
  return (
    <span {...props} class={labelDescriptionClass({ class: props.class })} />
  );
};

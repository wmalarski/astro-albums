import type { VariantProps } from "class-variance-authority";

import { type ValidComponent, splitProps } from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";

import type { ComponentVariantProps } from "@components/utils/twCva";
import type { ClassValue } from "class-variance-authority/types";
import {
  cardActionsClass,
  cardBodyClass,
  cardClass,
  cardTitleClass,
} from "./Card.recipes";

export type CardProps = ComponentVariantProps<"div", typeof cardClass>;

export const Card = (props: CardProps) => {
  const [split, rest] = splitProps(props, [
    "variant",
    "size",
    "color",
    "bg",
    "class",
  ]);

  return <div {...rest} class={cardClass(split)} />;
};

export type CardTitleProps<T extends ValidComponent> = DynamicProps<T> &
  VariantProps<typeof cardTitleClass> & {
    class: ClassValue;
  };

export function CardTitle<T extends ValidComponent>(props: CardTitleProps<T>) {
  return (
    <Dynamic {...props} class={cardTitleClass()} component={props.component} />
  );
}

export type CardBodyProps = ComponentVariantProps<"div", typeof cardBodyClass>;

export const CardBody = (props: CardBodyProps) => {
  return <div {...props} class={cardBodyClass({ class: props.class })} />;
};

export type CardActionsProps = ComponentVariantProps<
  "div",
  typeof cardActionsClass
>;

export const CardActions = (props: CardActionsProps) => {
  const [split, rest] = splitProps(props, ["justify", "class"]);

  return <div {...rest} class={cardActionsClass(split)} />;
};

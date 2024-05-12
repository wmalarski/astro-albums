import { twCva } from "../utils/twCva";

export const cardClass = twCva("card", {
  defaultVariants: {
    bg: null,
    color: null,
    size: null,
    variant: null,
  },
  variants: {
    bg: {
      "base-100": "bg-base-100",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300",
    },
    color: {
      accent: "border-l-8 border-l-accent",
      black: "border-l-8 border-l-neutral",
      disabled: "border-l-8 border-l-base-200",
      error: "border-l-8 border-l-error",
      info: "border-l-8 border-l-info",
      primary: "border-l-8 border-l-primary",
      secondary: "border-l-8 border-l-secondary",
      success: "border-l-8 border-l-success",
      warning: "border-l-8 border-l-warning",
    },
    size: {
      compact: "card-compact",
      normal: "card-normal",
      side: "card-side",
    },
    variant: {
      bordered: "card-bordered",
    },
  },
});

export const cardTitleClass = twCva("card-title");

export const cardBodyClass = twCva("card-body");

export const cardActionsClass = twCva("card-actions", {
  defaultVariants: {
    justify: null,
  },
  variants: {
    justify: {
      end: "justify-end",
    },
  },
});

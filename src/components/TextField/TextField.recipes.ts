import { twCva } from "../utils/twCva";

export const textFieldRootClass = twCva("form-control");

export const textFieldErrorMessage = twCva("text-sm text-error pt-2");

export const textFieldInputClass = twCva("input", {
  defaultVariants: {
    color: null,
    size: "md",
    variant: null,
    width: null,
  },
  variants: {
    color: {
      accent: "input-accent",
      error: "input-error",
      info: "input-info",
      primary: "input-primary",
      secondary: "input-secondary",
      success: "input-success",
      warning: "input-warning",
    },
    size: {
      lg: "input-lg",
      md: "input-md",
      sm: "input-sm",
      xs: "input-xs",
    },
    variant: {
      bordered: "input-bordered",
      ghost: "input-ghost",
    },
    width: {
      full: "w-full",
    },
  },
});

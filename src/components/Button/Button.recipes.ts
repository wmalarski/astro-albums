import { twCva } from "@components/utils/twCva";

export const buttonClass = twCva("btn no-animation flex items-center gap-1", {
  defaultVariants: {
    color: null,
    isLoading: false,
    shape: null,
    size: "md",
    variant: null,
    width: null,
  },
  variants: {
    color: {
      accent: "btn-accent",
      error: "btn-error",
      info: "btn-info",
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      warning: "btn-warning",
    },
    isLoading: {
      false: "",
      true: "after:loading after:loading-spinner pointer-events-none",
    },
    shape: {
      block: "btn-block",
      circle: "btn-circle",
      ellipsis: "btn-circle w-[unset]",
      square: "btn-square",
      wide: "btn-wide",
    },
    size: {
      lg: "btn-lg",
      md: "btn-md",
      sm: "btn-sm",
      xs: "btn-xs",
    },
    variant: {
      active: "btn-active",
      default: "",
      disabled: "btn-disabled",
      ghost: "btn-ghost",
      glass: "glass",
      link: "btn-link",
      outline: "btn-outline",
    },
    width: {
      full: "w-full",
    },
  },
});

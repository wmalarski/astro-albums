import type { VariantProps } from "class-variance-authority";

import { twCva } from "../utils/twCva";

export const alertClass = twCva("alert justify-start", {
  defaultVariants: {
    variant: null,
  },
  variants: {
    variant: {
      error: "alert-error",
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
    },
  },
});

export type AlertVariants = NonNullable<
  VariantProps<typeof alertClass>["variant"]
>;

export const alertIconClass = twCva("size-6 shrink-0 stroke-current");

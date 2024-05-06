import { createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { AlertCircleIcon } from "../Icons/AlertCircleIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { XCircleIcon } from "../Icons/XCircleIcon";
import {
  alertClass,
  alertIconClass,
  type AlertVariants,
} from "./Alert.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";

export type AlertProps = ComponentVariantProps<"div", typeof alertClass>;

export function Alert(props: AlertProps) {
  const [split, rest] = splitProps(props, ["variant"]);

  return <div class={alertClass(split)} {...rest} />;
}

const alertIconMap: Record<AlertVariants, typeof CheckCircleIcon> = {
  error: XCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertCircleIcon,
};

export type AlertIconProps = {
  variant: keyof typeof alertIconMap;
};

export function AlertIcon(props: AlertIconProps) {
  const component = createMemo(() => {
    return alertIconMap[props.variant];
  });
  return <Dynamic class={alertIconClass()} component={component()} />;
}

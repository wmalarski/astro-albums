import { createMemo, splitProps, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { ComponentVariantProps } from "@components/utils/twCva";
import type { ClassValue } from "class-variance-authority/types";
import { AlertCircleIcon } from "../Icons/AlertCircleIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { XCircleIcon } from "../Icons/XCircleIcon";
import {
  alertClass,
  alertIconClass,
  type AlertVariants,
} from "./Alert.recipes";

export type AlertProps = ComponentVariantProps<"div", typeof alertClass>;

export const Alert: Component<AlertProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant", "class"]);

  return <div {...rest} class={alertClass(split)} />;
};

const alertIconMap: Record<AlertVariants, typeof CheckCircleIcon> = {
  error: XCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertCircleIcon,
};

export type AlertIconProps = {
  variant: keyof typeof alertIconMap;
  class?: ClassValue;
};

export const AlertIcon: Component<AlertIconProps> = (props) => {
  const component = createMemo(() => {
    return alertIconMap[props.variant];
  });
  return (
    <Dynamic
      class={alertIconClass({ class: props.class })}
      component={component()}
    />
  );
};

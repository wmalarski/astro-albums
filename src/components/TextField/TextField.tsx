import { splitProps, type Component } from "solid-js";

import {
  textFieldErrorMessage,
  textFieldInputClass,
  textFieldRootClass,
} from "./TextField.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";

export type TextFieldRootProps = ComponentVariantProps<
  "fieldset",
  typeof textFieldRootClass
>;

export const TextFieldRoot: Component<TextFieldRootProps> = (props) => {
  return <fieldset {...props} class={textFieldRootClass()} />;
};

export type TextFieldErrorMessageProps = ComponentVariantProps<
  "span",
  typeof textFieldErrorMessage
>;

export const TextFieldErrorMessage: Component<TextFieldErrorMessageProps> = (
  props,
) => {
  return <span {...props} class={textFieldErrorMessage()} />;
};

const variantPropsList = ["color", "size", "variant", "width"] as const;

export type TextFieldInputProps = ComponentVariantProps<
  "input",
  typeof textFieldInputClass
>;

export const TextFieldInput: Component<TextFieldInputProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return <input {...rest} class={textFieldInputClass(split)} />;
};

export type TextFieldTextAreaProps = ComponentVariantProps<
  "textarea",
  typeof textFieldInputClass
>;

export const TextFieldTextArea: Component<TextFieldTextAreaProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return <textarea {...rest} class={textFieldInputClass(split)} />;
};

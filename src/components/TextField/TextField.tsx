import { splitProps, type Component } from "solid-js";

import {
  textFieldDescription,
  textFieldErrorMessage,
  textFieldInputClass,
  textFieldLabelClass,
  textFieldLabelText,
  textFieldRootClass,
} from "./TextField.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";

export type TextFieldRootProps = ComponentVariantProps<
  "fieldset",
  typeof textFieldRootClass
>;

export const TextFieldRoot: Component<TextFieldRootProps> = (props) => {
  return (
    <fieldset {...props} class={textFieldRootClass({ class: props.class })} />
  );
};

export type TextFieldLabelProps = ComponentVariantProps<
  "label",
  typeof textFieldLabelClass
>;

export const TextFieldLabel: Component<TextFieldLabelProps> = (props) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...props} class={textFieldLabelClass({ class: props.class })} />
  );
};

export type TextFieldLabelTextProps = ComponentVariantProps<
  "span",
  typeof textFieldLabelText
>;

export const TextFieldLabelText: Component<TextFieldLabelTextProps> = (
  props,
) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <span {...props} class={textFieldLabelText({ class: props.class })} />
  );
};

export type TextFieldDescriptionProps = ComponentVariantProps<
  "span",
  typeof textFieldDescription
>;

export const TextFieldDescription: Component<TextFieldDescriptionProps> = (
  props,
) => {
  return (
    <span {...props} class={textFieldDescription({ class: props.class })} />
  );
};

export type TextFieldErrorMessageProps = ComponentVariantProps<
  "span",
  typeof textFieldErrorMessage
>;

export const TextFieldErrorMessage: Component<TextFieldErrorMessageProps> = (
  props,
) => {
  return (
    <span {...props} class={textFieldErrorMessage({ class: props.class })} />
  );
};

const variantPropsList = ["color", "size", "variant", "width"] as const;

export type TextFieldInputProps = ComponentVariantProps<
  "input",
  typeof textFieldInputClass
>;

export const TextFieldInput: Component<TextFieldInputProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <input
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
};

export type TextFieldTextAreaProps = ComponentVariantProps<
  "textarea",
  typeof textFieldInputClass
>;

export const TextFieldTextArea: Component<TextFieldTextAreaProps> = (props) => {
  const [split, rest] = splitProps(props, variantPropsList);

  return (
    <textarea
      {...rest}
      class={textFieldInputClass({ class: props.class, ...split })}
    />
  );
};

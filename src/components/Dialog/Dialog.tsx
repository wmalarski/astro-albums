import { buttonSplitProps } from "@components/Button/Button";
import { buttonClass } from "@components/Button/Button.recipes";
import type { ComponentVariantProps } from "@components/utils/twCva";
import { splitProps, type Component } from "solid-js";
import {
  dialogActionsClass,
  dialogContainerClass,
  dialogContentClass,
} from "./Dialog.recipes";

export type DialogTriggerProps = ComponentVariantProps<
  "button",
  typeof buttonClass
> & { dialogId: string };

export const DialogTrigger: Component<DialogTriggerProps> = (props) => {
  const [variants, propsNoStyle] = splitProps(props, buttonSplitProps);
  const [split, rest] = splitProps(propsNoStyle, ["dialogId"]);

  const onClick: DialogTriggerProps["onClick"] = () => {
    const elementId = `dialog#${split.dialogId}`;
    const element = document.querySelector<HTMLDialogElement>(elementId);
    element?.showModal();
  };

  return <button {...rest} onClick={onClick} class={buttonClass(variants)} />;
};

export type DialogCloseProps = ComponentVariantProps<
  "button",
  typeof buttonClass
>;

export const DialogClose: Component<DialogCloseProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <form method="dialog">
      <button {...rest} class={buttonClass(split)} />
    </form>
  );
};

export type DialogContainerProps = ComponentVariantProps<
  "dialog",
  typeof dialogContainerClass
> & { id: string };

export const DialogContainer: Component<DialogContainerProps> = (props) => {
  return (
    <dialog {...props} class={dialogContainerClass({ class: props.class })} />
  );
};

export type DialogContentProps = ComponentVariantProps<
  "div",
  typeof dialogContentClass
>;

export const DialogContent: Component<DialogContentProps> = (props) => {
  return <div {...props} class={dialogContentClass({ class: props.class })} />;
};

export type DialogActionsProps = ComponentVariantProps<
  "div",
  typeof dialogActionsClass
>;

export const DialogActions: Component<DialogActionsProps> = (props) => {
  return <div {...props} class={dialogActionsClass({ class: props.class })} />;
};

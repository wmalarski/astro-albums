/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@components/Button/Button";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "@components/TextField/TextField";
import { Show, createEffect, createSignal, type JSX } from "solid-js";

export type ReviewFormData = {
  text: string;
  rate: number;
};

type Props = {
  error: string;
  initial?: ReviewFormData;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (args: ReviewFormData) => void;
};

export const ReviewForm = (props: Props): JSX.Element => {
  const [text, setText] = createSignal("");
  const [rate, setRate] = createSignal(5);

  const handleSubmit = () => {
    props.onSubmit({ rate: rate(), text: text() });
  };

  createEffect(() => {
    if (!props.initial) {
      return;
    }
    setText(props.initial.text);
    setRate(props.initial.rate);
  });

  return (
    <div class="w-full flex flex-col gap-2">
      <TextFieldRoot class="flex gap-2 w-full">
        <TextFieldLabel for="review" class="label label-text font-semibold">
          <TextFieldLabelText>Review:</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          class="input input-sm flex-grow"
          disabled={props.isLoading}
          id="review"
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Review"
          type="text"
          value={text()}
        />
      </TextFieldRoot>
      <TextFieldRoot class="flex gap-2  w-full">
        <TextFieldLabel for="rate" class="label label-text font-semibold">
          <TextFieldLabelText>Rate:</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          class="input input-sm flex-grow"
          disabled={props.isLoading}
          id="rate"
          max={10}
          min={0}
          onChange={(event) => setRate(event.currentTarget.valueAsNumber)}
          placeholder="Rate"
          step={0.1}
          type="number"
          value={rate()}
        />
      </TextFieldRoot>
      <Show when={props.error} keyed>
        {(error) => <div class="text-sm text-red-400">{error}</div>}
      </Show>
      <div class="flex justify-end w-full gap-2">
        <Button
          variant="ghost"
          isLoading={props.isLoading}
          disabled={props.isLoading}
          type="button"
          onClick={() => props.onCancel()}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={props.isLoading}
          disabled={props.isLoading}
          type="button"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from "@components/Button/Button";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "@components/TextField/TextField";
import { Show, createEffect, createSignal, type JSX } from "solid-js";

export type AlbumFormData = {
  title: string;
  year: number | null;
};

type Props = {
  error: string;
  initial?: AlbumFormData;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (args: AlbumFormData) => void;
};

export const AlbumForm = (props: Props): JSX.Element => {
  const [title, setTitle] = createSignal("");
  const [year, setYear] = createSignal(1980);

  const handleSubmit = () => {
    props.onSubmit({ title: title(), year: year() });
  };

  createEffect(() => {
    if (!props.initial) {
      return;
    }
    setTitle(props.initial.title);
    setYear((current) => props.initial?.year ?? current);
  });

  return (
    <div class="w-full flex flex-col gap-2">
      <TextFieldRoot>
        <TextFieldLabel for="title">
          <TextFieldLabelText>Title:</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          disabled={props.isLoading}
          id="title"
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="Title"
          type="text"
          value={title()}
        />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldLabel for="year">
          <TextFieldLabelText>Year:</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          disabled={props.isLoading}
          id="year"
          max={2100}
          min={0}
          onChange={(event) => setYear(event.currentTarget.valueAsNumber)}
          placeholder="Year"
          step={1}
          type="number"
          value={year()}
        />
      </TextFieldRoot>
      <Show when={props.error} keyed>
        {(error) => <div class="text-sm text-red-400">{error}</div>}
      </Show>
      <div class="flex justify-end w-full gap-2">
        <Button
          isLoading={props.isLoading}
          disabled={props.isLoading}
          type="button"
          onClick={() => props.onCancel()}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          isLoading={props.isLoading}
          disabled={props.isLoading}
          type="button"
          onClick={handleSubmit}
          color="primary"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

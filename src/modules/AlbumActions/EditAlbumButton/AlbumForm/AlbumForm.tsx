/* eslint-disable jsx-a11y/label-has-associated-control */
import clsx from "clsx";
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
      <div class="flex gap-2 w-full">
        <label for="title" class="label label-text font-semibold">
          Title:
        </label>
        <input
          class="input input-sm flex-grow"
          disabled={props.isLoading}
          id="title"
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="Title"
          type="text"
          value={title()}
        />
      </div>
      <div class="flex gap-2  w-full">
        <label for="year" class="label label-text font-semibold">
          Year:
        </label>
        <input
          class="input input-sm flex-grow"
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
      </div>
      <Show when={props.error} keyed>
        {(error) => <div class="text-sm text-red-400">{error}</div>}
      </Show>
      <div class="flex justify-end w-full gap-2">
        <button
          disabled={props.isLoading}
          class={clsx("btn btn-ghost", { loading: props.isLoading })}
          type="button"
          onClick={() => props.onCancel()}
        >
          Cancel
        </button>
        <button
          disabled={props.isLoading}
          class={clsx("btn btn-primary", { loading: props.isLoading })}
          type="button"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

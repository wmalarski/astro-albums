/* eslint-disable jsx-a11y/label-has-associated-control */
import clsx from "clsx";
import { createSignal, JSX, Show } from "solid-js";

type Props = {
  albumId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export const ReviewForm = (props: Props): JSX.Element => {
  const [text, setText] = createSignal("");
  const [rate, setRate] = createSignal(5);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({
      albumId: props.albumId,
      rate: rate(),
      text: text(),
    });
    const response = await fetch("/api/review", { body });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);

    if (!result.error) {
      props.onSuccess();
    }
  };

  return (
    <div class="w-full flex flex-col gap-2">
      <div class="flex gap-2 w-full">
        <label for="review" class="label label-text">
          Review
        </label>
        <input
          class="input input-sm  flex-grow"
          disabled={isLoading()}
          id="review"
          onChange={(event) => setText(event.currentTarget.value)}
          placeholder="Review"
          type="text"
          value={text()}
        />
      </div>
      <div class="flex gap-2  w-full">
        <label for="rate" class="label label-text">
          Rate
        </label>
        <input
          class="input input-sm flex-grow"
          disabled={isLoading()}
          id="rate"
          max={10}
          min={0}
          onChange={(event) => setRate(event.currentTarget.valueAsNumber)}
          placeholder="Rate"
          step={0.1}
          type="number"
          value={rate()}
        />
      </div>
      <Show when={error()} keyed>
        {(error) => <div class="text-sm text-red-400">{error}</div>}
      </Show>
      <div class="flex justify-end w-full gap-2">
        <button
          disabled={isLoading()}
          class={clsx("btn btn-ghost", { loading: isLoading() })}
          type="button"
          onClick={() => props.onCancel()}
        >
          Cancel
        </button>
        <button
          disabled={isLoading()}
          class={clsx("btn btn-primary", { loading: isLoading() })}
          type="button"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

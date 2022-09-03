/* eslint-disable jsx-a11y/label-has-associated-control */
import { paths } from "@utils/paths";
import { createEffect, createSignal, JSX } from "solid-js";

type Props = {
  query?: string;
};

export const AlbumSearch = (props: Props): JSX.Element => {
  const [input, setInput] = createSignal("");

  createEffect(() => {
    setInput(props.query || "");
  });

  const handleSubmit = () => {
    window.location.replace(paths.index({ page: 0, query: input() }));
  };

  return (
    <div class="w-full flex flex-row gap-2">
      <div class="flex gap-2 w-full grow items-center">
        <label for="input" class="label label-text">
          Search
        </label>
        <input
          class="input flex-grow"
          id="input"
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="Search"
          type="text"
          value={input()}
        />
      </div>
      <button class="btn btn-primary" type="button" onClick={handleSubmit}>
        Search
      </button>
      <a class="btn btn-ghost" href={paths.index()}>
        Random
      </a>
    </div>
  );
};

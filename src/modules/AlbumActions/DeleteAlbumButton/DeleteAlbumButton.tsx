import clsx from "clsx";
import { createSignal, JSX, Show } from "solid-js";

type Props = {
  albumId: string;
  header: string;
};

export const DeleteAlbumButton = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({ albumId: props.albumId });
    const response = await fetch("/api/album", { body, method: "DELETE" });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button class="btn btn-xs" onClick={() => setIsOpen(true)}>
        Delete
      </button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{`Delete ${props.header}`}</h3>
          <Show when={error()} keyed>
            {(error) => <div class="text-sm text-red-400">{error}</div>}
          </Show>
          <div class="flex justify-end w-full gap-2">
            <button
              disabled={isLoading()}
              class={clsx("btn btn-ghost", { loading: isLoading() })}
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={isLoading()}
              class={clsx("btn btn-warning", { loading: isLoading() })}
              type="button"
              onClick={handleSubmit}
            >
              Confirm
            </button>
          </div>
        </div>
      </Show>
    </>
  );
};

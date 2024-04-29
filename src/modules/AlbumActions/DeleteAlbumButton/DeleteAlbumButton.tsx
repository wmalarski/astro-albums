import { Button } from "@components/Button/Button";
import { Show, createSignal, type JSX } from "solid-js";

type Props = {
  albumId: string;
  header: string;
  redirect?: string | undefined;
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

    if (props.redirect) {
      window.location.replace(props.redirect);
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Button size="xs" onClick={() => setIsOpen(true)}>
        Delete
      </Button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{`Delete ${props.header}`}</h3>
          <Show when={error()} keyed>
            {(error) => <div class="text-sm text-red-400">{error}</div>}
          </Show>
          <div class="flex justify-end w-full gap-2">
            <Button
              disabled={isLoading()}
              variant="ghost"
              isLoading={isLoading()}
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading()}
              color="warning"
              isLoading={isLoading()}
              type="button"
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Show>
    </>
  );
};

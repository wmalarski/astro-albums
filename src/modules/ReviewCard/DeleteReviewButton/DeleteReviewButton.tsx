import { Button } from "@components/Button/Button";
import { Show, createSignal, type JSX } from "solid-js";

type Props = {
  reviewId: string;
  header: string;
};

export const DeleteReviewButton = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({ reviewId: props.reviewId });
    const response = await fetch("/api/review", { body, method: "DELETE" });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);
    setIsOpen(false);

    window.location.reload();
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
              variant="ghost"
              isLoading={isLoading()}
              disabled={isLoading()}
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="warning"
              disabled={isLoading()}
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

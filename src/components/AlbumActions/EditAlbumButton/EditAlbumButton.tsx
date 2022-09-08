import { ReviewForm, ReviewFormData } from "@components/ReviewForm/ReviewForm";
import { createSignal, JSX, Show } from "solid-js";

type Props = {
  albumId: string;
  title: string;
};

export const EditReviewButton = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (data: ReviewFormData) => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({ albumId: props.albumId, ...data });
    const response = await fetch("/api/album", { body, method: "POST" });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <button class="btn btn-xs" onClick={() => setIsOpen(true)}>
        Review
      </button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{props.title}</h3>
          <ReviewForm
            error={error()}
            isLoading={isLoading()}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </Show>
    </>
  );
};

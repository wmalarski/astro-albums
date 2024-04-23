import { Button } from "@components/Button/Button";
import {
  ReviewForm,
  type ReviewFormData,
} from "@modules/ReviewForm/ReviewForm";
import { Show, createSignal, type JSX } from "solid-js";

type Props = {
  reviewId: string;
  rate: number;
  text: string;
  header: string;
};

export const EditReviewButton = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (data: ReviewFormData) => {
    setError("");
    setIsLoading(true);

    const body = JSON.stringify({ reviewId: props.reviewId, ...data });
    const response = await fetch("/api/review", { body, method: "POST" });
    const result = await response.json();

    setError(result.error || "");
    setIsLoading(false);
    setIsOpen(false);

    window.location.reload();
  };

  const initial = () => {
    return {
      rate: props.rate,
      text: props.text,
    };
  };

  return (
    <>
      <Button size="xs" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{`Edit review: ${props.header}`}</h3>
          <ReviewForm
            error={error()}
            initial={initial()}
            isLoading={isLoading()}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </Show>
    </>
  );
};

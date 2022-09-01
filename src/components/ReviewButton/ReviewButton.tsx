import { ReviewForm } from "@components/ReviewForm/ReviewForm";
import { createSignal, JSX, Show } from "solid-js";

export type ReviewButtonProps = {
  albumId: string;
  title: string;
};

export const ReviewButton = (props: ReviewButtonProps): JSX.Element => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <button class="btn" onClick={() => setIsOpen(true)}>
        Review
      </button>
      <Show when={isOpen()}>
        <div class="absolute inset-0 bg-base-300 p-8 flex flex-col gap-4">
          <h3 class="text-xl font-semibold truncate">{props.title}</h3>
          <ReviewForm
            albumId={props.albumId}
            onSuccess={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </Show>
    </>
  );
};

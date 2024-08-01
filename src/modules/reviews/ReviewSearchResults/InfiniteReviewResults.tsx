import { Button } from "@components/Button/Button";
import { CardGrid } from "@modules/common/CardGrid";
import { actions } from "astro:actions";
import { For, createSignal, type Component, type ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { ReviewCard } from "../ReviewCard/ReviewCard";

type ResultsStore = Awaited<ReturnType<typeof actions.findReviews>> & {
  page: number;
};

export const InfiniteReviewResults: Component<ParentProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const [reviews, setReviews] = createStore<ResultsStore>({
    page: 1,
    data: [],
    error: undefined,
  });

  const onClick = async () => {
    setIsLoading(true);

    try {
      const newReviews = await actions.findReviews({ page: reviews.page });

      setReviews(
        produce((state) => {
          state.page += 1;
          state.data?.push(...(newReviews.data ?? []));
          state.error = newReviews.error;
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex flex-col gap-4">
      <CardGrid>
        {props.children}
        <For each={reviews.data}>
          {(entry) => (
            <ReviewCard
              review={entry.Review}
              album={entry.Album}
              artist={entry.Artist}
            />
          )}
        </For>
      </CardGrid>
      <Button onClick={onClick} isLoading={isLoading()}>
        Load more
      </Button>
    </div>
  );
};

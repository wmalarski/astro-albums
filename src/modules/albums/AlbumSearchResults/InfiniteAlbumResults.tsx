import { Button } from "@components/Button/Button";
import { CardGrid } from "@modules/common/CardGrid";
import { actions } from "astro:actions";
import { For, createSignal, type Component, type ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { AlbumCard } from "../AlbumCard/AlbumCard";

type InfiniteAlbumResultsProps = ParentProps<{
  query: string;
}>;

type ResultsStore = {
  page: number;
  results: Awaited<ReturnType<typeof actions.findAlbumsByQuery>>;
};

export const InfiniteAlbumResults: Component<InfiniteAlbumResultsProps> = (
  props,
) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const [albums, setAlbums] = createStore<ResultsStore>({
    page: 1,
    results: [],
  });

  const onClick = async () => {
    setIsLoading(true);

    try {
      const newAlbums = await actions.findAlbumsByQuery({
        page: albums.page,
        query: props.query,
      });

      setAlbums(
        produce((state) => {
          state.page += 1;
          state.results.push(...newAlbums);
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
        <For each={albums.results}>
          {(entry) => (
            <AlbumCard
              album={entry.Album}
              artist={entry.Artist}
              reminder={entry.Reminder}
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

import { Button } from "@components/Button/Button";
import { CardGrid } from "@modules/common/CardGrid";
import { actions } from "astro:actions";
import { For, createSignal, type Component, type ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { AlbumCard } from "../AlbumCard/AlbumCard";

type ResultsStore = {
  results: Awaited<ReturnType<typeof actions.findRandomAlbums>>;
};

export const InfiniteRandomAlbums: Component<ParentProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const [albums, setAlbums] = createStore<ResultsStore>({
    results: [],
  });

  const onClick = async () => {
    setIsLoading(true);

    try {
      const newAlbums = await actions.findRandomAlbums();

      setAlbums(
        produce((state) => {
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
              reminder={entry.Visit}
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

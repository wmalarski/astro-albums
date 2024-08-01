import { Button } from "@components/Button/Button";
import { CardGrid } from "@modules/common/CardGrid";
import { actions } from "astro:actions";
import { For, createSignal, type Component, type ParentProps } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { AlbumCard } from "../AlbumCard/AlbumCard";

type ResultsStore = Awaited<ReturnType<typeof actions.findReminders>> & {
  page: number;
};

export const InfiniteAlbumReminders: Component<ParentProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal(false);

  const [albums, setAlbums] = createStore<ResultsStore>({
    data: [],
    error: undefined,
    page: 1,
  });

  const onClick = async () => {
    setIsLoading(true);

    try {
      const newAlbums = await actions.findReminders({
        page: albums.page,
      });

      setAlbums(
        produce((state) => {
          state.page += 1;
          state.data?.push(...(newAlbums.data ?? []));
          state.error = newAlbums.error;
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
        <For each={albums.data}>
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

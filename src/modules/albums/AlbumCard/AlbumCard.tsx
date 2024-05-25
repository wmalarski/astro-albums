import { formatAlbum } from "@utils/format";
import { jsonToCoversField } from "@server/coverArt";
import { AlbumActions } from "@modules/albums/AlbumCard/AlbumActions";
import CoversCarousel from "@modules/common/CoversCarousel.astro";
import type { Album, Artist, Visit } from "astro:db";
import { twCx } from "@components/utils/twCva";
import type { Component } from "solid-js";

type AlbumCardProps = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
  reminder?: typeof Visit.$inferSelect | null | undefined;
  reviews?: number;
};

export const AlbumCard: Component<AlbumCardProps> = (props) => {
  const header = () =>
    formatAlbum({ album: props.album, artist: props.artist });

  return (
    <article
      class={twCx("card card-side card-compact bg-base-300 w-full h-60", {
        "card-bordered border-green-400": props.reviews,
      })}
    >
      <figure class="max-w-[250px]">
        <CoversCarousel
          header={header()}
          covers={jsonToCoversField(props.album.covers).small}
        />
      </figure>
      <div class="card-body">
        <h3 class="card-title line-clamp-2">{header()}</h3>
        <AlbumActions
          album={props.album}
          artist={props.artist}
          reminder={props.reminder}
        />
      </div>
    </article>
  );
};

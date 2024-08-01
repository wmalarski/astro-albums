import { Link } from "@components/Link/Link";
import { twCx } from "@components/utils/twCva";
import { AlbumActions } from "@modules/albums/AlbumCard/AlbumActions";
import { CoversCarousel } from "@modules/common/CoversCarousel";
import { jsonToCoversField } from "@utils/coverArt";
import { formatAlbum } from "@utils/format";
import { paths } from "@utils/paths";
import type { Album, Artist, Reminder } from "astro:db";
import type { Component } from "solid-js";

type AlbumCardProps = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
  reminder?: typeof Reminder.$inferSelect | null | undefined;
  reviews?: number;
};

export const AlbumCard: Component<AlbumCardProps> = (props) => {
  const header = () =>
    formatAlbum({ album: props.album, artist: props.artist });

  return (
    <article
      class={twCx(
        "card card-side card-compact bg-base-300 w-full h-60 relative",
        { "card-bordered border-green-400": props.reviews },
      )}
    >
      <a
        href={paths.album(props.album.id)}
        class="absolute inset-0"
        aria-label="Details"
      />
      <figure class="max-w-[250px]">
        <CoversCarousel
          header={header()}
          covers={jsonToCoversField(props.album.covers).small}
        />
      </figure>
      <div class="card-body z-10 h-min">
        <Link href={paths.album(props.album.id)} variant="ghost">
          <span class="line-clamp-2">{header()}</span>
        </Link>
        <AlbumActions
          album={props.album}
          artist={props.artist}
          reminder={props.reminder}
        />
      </div>
    </article>
  );
};

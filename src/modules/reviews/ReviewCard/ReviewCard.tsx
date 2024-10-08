import { Link } from "@components/Link/Link";
import { CoversCarousel } from "@modules/common/CoversCarousel";
import { GoogleButton } from "@modules/common/GoogleButton";
import { YtButton } from "@modules/common/YtButton";
import { jsonToCoversField } from "@utils/coverArt";
import { formatAlbum } from "@utils/format";
import { paths } from "@utils/paths";
import type { Album, Artist, Review } from "astro:db";
import { Show, type Component } from "solid-js";
import { DeleteReviewDialog } from "./DeleteReviewDialog";

type ReviewCardProps = {
  review: typeof Review.$inferSelect;
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
};

export const ReviewCard: Component<ReviewCardProps> = (props) => {
  const details = () =>
    props.album.release ||
    (props.album.sid && paths.albumRelease(props.album.sid));

  const header = () =>
    formatAlbum({ album: props.album, artist: props.artist });

  const covers = () => jsonToCoversField(props.album.covers);

  return (
    <article class="card card-side card-compact bg-base-300 w-full h-60">
      <figure class="max-w-[250px]">
        <CoversCarousel header={header()} covers={covers().small} />
      </figure>
      <div class="card-body flex flex-col gap-2">
        <h3 class="card-title line-clamp-2">{header()}</h3>
        <div class="flex gap-2">
          <span class="font-semibold">Date:</span>
          <span>
            {new Intl.DateTimeFormat().format(props.review.createdAt)}
          </span>
        </div>
        <div class="flex gap-2">
          <span class="font-semibold">Rate:</span>
          <span>{props.review.rate}</span>
        </div>
        <div class="flex gap-2">
          <span class="font-semibold">Text:</span>
          <span>{props.review.text}</span>
        </div>
        <div class="card-actions gap-1">
          <YtButton title={props.album.title} name={props.artist.name} />
          <GoogleButton title={props.album.title} name={props.artist.name} />
          <Link size="xs" href={paths.album(props.album.id)}>
            Show more
          </Link>
          <Show when={details()}>
            {(details) => (
              <Link size="xs" href={details()}>
                Details
              </Link>
            )}
          </Show>
          <Link
            size="xs"
            color="secondary"
            href={paths.editReview(props.review.id)}
          >
            Edit
          </Link>
          <DeleteReviewDialog
            review={props.review}
            album={props.album}
            artist={props.artist}
          />
        </div>
      </div>
    </article>
  );
};

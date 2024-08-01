import { Link } from "@components/Link/Link";
import { GoogleButton } from "@modules/common/GoogleButton";
import { YtButton } from "@modules/common/YtButton";
import { paths } from "@utils/paths";
import type { Album, Artist, Reminder } from "astro:db";
import { Show, type Component } from "solid-js";
import { CreateReminderDialog } from "./CreateReminderDialog.tsx";
import { DeleteAlbumDialog } from "./DeleteAlbumDialog.tsx";
import { DeleteReminderDialog } from "./DeleteReminderDialog.tsx";

type AlbumActionsProps = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
  reminder?: typeof Reminder.$inferSelect | undefined | null;
};

export const AlbumActions: Component<AlbumActionsProps> = (props) => {
  const details = () =>
    props.album.release ||
    (props.album.sid && paths.albumRelease(props.album.sid));

  return (
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
      <Show
        when={props.reminder}
        fallback={<CreateReminderDialog album={props.album} />}
      >
        {(reminder) => <DeleteReminderDialog reminder={reminder()} />}
      </Show>
      <Link size="xs" href={paths.review(props.album.id)}>
        Review
      </Link>
      <Link size="xs" href={paths.editAlbum(props.album.id)}>
        Edit
      </Link>
      <DeleteAlbumDialog album={props.album} artist={props.artist} />
    </div>
  );
};

import { Button } from "@components/Button/Button";
import {
  DialogActions,
  DialogClose,
  DialogContainer,
  DialogContent,
  DialogTrigger,
} from "@components/Dialog/Dialog";
import { formatAlbum } from "@utils/format";
import { actions } from "astro:actions";
import type { Album, Artist } from "astro:db";
import type { Component } from "solid-js";

type DeleteAlbumDialogProps = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
};

export const DeleteAlbumDialog: Component<DeleteAlbumDialogProps> = (props) => {
  const dialogId = () => `dialog-delete-album-${props.album.id}`;
  const formId = () => `form-delete-album-${props.album.id}`;

  return (
    <>
      <DialogTrigger dialogId={dialogId()} size="xs" color="error">
        Delete
      </DialogTrigger>
      <DialogContainer id={dialogId()}>
        <DialogContent>
          <h3 class="font-bold text-lg">
            {`Delete album ${formatAlbum({ album: props.album, artist: props.artist })}`}
          </h3>
          <form id={formId()} action={actions.deleteAlbum} method="post">
            <input type="hidden" name="albumId" value={props.album.id} />
          </form>
          <DialogActions>
            <DialogClose>Close</DialogClose>
            <Button form={formId()} type="submit">
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </DialogContainer>
    </>
  );
};

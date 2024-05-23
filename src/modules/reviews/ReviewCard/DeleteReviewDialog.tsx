import { Button } from "@components/Button/Button";
import {
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogActions,
  DialogClose,
} from "@components/Dialog/Dialog";
import { formatAlbum } from "@utils/format";
import { Album, Artist } from "astro:db";
import { getActionProps, actions } from "astro:actions";
import type { Review } from "astro:db";
import type { Component } from "solid-js";

type DeleteReviewDialogProps = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
  review: typeof Review.$inferInsert;
};

export const DeleteReviewDialog: Component<DeleteReviewDialogProps> = (
  props,
) => {
  const dialogId = () => `dialog-delete-review-${props.review.id}`;
  const formId = () => `form-delete-review-${props.review.id}`;

  return (
    <>
      <DialogTrigger dialogId={dialogId()} size="xs">
        Delete
      </DialogTrigger>
      <DialogContainer id={dialogId()}>
        <DialogContent>
          <h3 class="font-bold text-lg">
            {`Delete review ${formatAlbum({ album: props.album, artist: props.artist })}`}
          </h3>
          <form>
            <input {...getActionProps(actions.deleteReview)} />
            <input type="hidden" name="reviewId" value={props.review.id} />
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

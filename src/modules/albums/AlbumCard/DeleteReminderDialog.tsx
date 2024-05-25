import { Button } from "@components/Button/Button";
import {
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogActions,
  DialogClose,
} from "@components/Dialog/Dialog";
import { Visit } from "astro:db";
import { getActionProps, actions } from "astro:actions";
import type { Component } from "solid-js";

type DeleteAlbumDialogProps = {
  reminder: typeof Visit.$inferSelect;
};

export const DeleteAlbumDialog: Component<DeleteAlbumDialogProps> = (props) => {
  const dialogId = () => `dialog-delete-reminder-${props.reminder.id}`;
  const formId = () => `form-delete-reminder-${props.reminder.id}`;

  return (
    <>
      <DialogTrigger dialogId={dialogId()} color="success" size="xs">
        Delete
      </DialogTrigger>
      <DialogContainer id={dialogId()}>
        <DialogContent>
          <h3 class="font-bold text-lg">Delete reminder</h3>
          <form>
            <input {...getActionProps(actions.deleteReminder)} />
            <input type="hidden" name="reminderId" value={props.reminder.id} />
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

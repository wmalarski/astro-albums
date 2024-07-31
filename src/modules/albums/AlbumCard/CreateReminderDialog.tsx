import { Button } from "@components/Button/Button";
import {
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogActions,
  DialogClose,
} from "@components/Dialog/Dialog";
import type { Album } from "astro:db";
import { actions } from "astro:actions";
import type { Component } from "solid-js";

type CreateReminderDialogProps = {
  album: typeof Album.$inferSelect;
};

export const CreateReminderDialog: Component<CreateReminderDialogProps> = (
  props,
) => {
  const dialogId = () => `dialog-create-reminder-${props.album.id}`;
  const formId = () => `form-create-reminder-${props.album.id}`;

  return (
    <>
      <DialogTrigger dialogId={dialogId()} color="accent" size="xs">
        Remind me
      </DialogTrigger>
      <DialogContainer id={dialogId()}>
        <DialogContent>
          <h3 class="font-bold text-lg">Create reminder</h3>
          <form id={formId()} action={actions.createReminder} method="post">
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

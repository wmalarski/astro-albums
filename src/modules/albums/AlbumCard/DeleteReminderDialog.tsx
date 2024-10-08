import { Button } from "@components/Button/Button";
import {
  DialogActions,
  DialogClose,
  DialogContainer,
  DialogContent,
  DialogTrigger,
} from "@components/Dialog/Dialog";
import { actions } from "astro:actions";
import type { Reminder } from "astro:db";
import type { Component } from "solid-js";

type DeleteReminderDialogProps = {
  reminder: typeof Reminder.$inferSelect;
};

export const DeleteReminderDialog: Component<DeleteReminderDialogProps> = (
  props,
) => {
  const dialogId = () => `dialog-delete-reminder-${props.reminder.id}`;
  const formId = () => `form-delete-reminder-${props.reminder.id}`;

  return (
    <>
      <DialogTrigger dialogId={dialogId()} color="accent" size="xs">
        Remove reminder
      </DialogTrigger>
      <DialogContainer id={dialogId()}>
        <DialogContent>
          <h3 class="font-bold text-lg">Delete reminder</h3>
          <form id={formId()} action={actions.deleteReminder} method="post">
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

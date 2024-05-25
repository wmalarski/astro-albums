import { reviews } from "./reviews";
import { albums } from "./albums";
import { reminders } from "./reminders";

export const server = {
  ...reviews,
  ...albums,
  ...reminders,
};

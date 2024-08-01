import {
  createReminder,
  deleteReminder,
  findReminders,
} from "@server/data/reminders";
import { ActionError, defineAction, z } from "astro:actions";
import { DB_ERROR, UNAUTHORIZED_ERROR } from "./errors";

export const reminders = {
  createReminder: defineAction({
    accept: "form",
    handler: async (args, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await createReminder({ ...args, userId });

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
    input: z.object({
      albumId: z.string(),
    }),
  }),
  deleteReminder: defineAction({
    accept: "form",
    handler: async (args, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await deleteReminder(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
    input: z.object({
      reminderId: z.string(),
    }),
  }),
  findReminders: defineAction({
    accept: "json",
    handler: ({ page }, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const take = 20;
      return findReminders({ skip: page * take, take });
    },
    input: z.object({
      page: z.number(),
    }),
  }),
};

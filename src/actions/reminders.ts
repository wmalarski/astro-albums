import { getActionSession } from "@server/auth";
import {
  createReminder,
  deleteReminder,
  findReminders,
} from "@server/reminders";
import { ActionError, defineAction, z } from "astro:actions";
import { DB_ERROR, UNAUTHORIZED_ERROR } from "./errors";

export const reminders = {
  findReminders: defineAction({
    accept: "json",
    input: z.object({
      page: z.number(),
    }),
    handler: async ({ page }, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const take = 20;
      return findReminders({ skip: page * take, take });
    },
  }),
  createReminder: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await createReminder({ ...args, userId: session.userId });

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
  deleteReminder: defineAction({
    accept: "form",
    input: z.object({
      reminderId: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await deleteReminder(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
};

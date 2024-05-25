import {
  deleteAlbum,
  findAlbumsByQuery,
  findRandomAlbums,
  updateAlbum,
} from "@server/albums";
import { getActionSession } from "@server/auth";
import {
  createReminder,
  deleteReminder,
  findReminders,
} from "@server/reminders";
import {
  createReview,
  deleteReview,
  findReviews,
  updateReview,
} from "@server/reviews";
import { ActionError, defineAction, z } from "astro:actions";

const UNAUTHORIZED_ERROR = {
  code: "UNAUTHORIZED",
  message: "Access denied",
} as const;

const DB_ERROR = {
  code: "BAD_REQUEST",
  message: "Something went wrong",
} as const;

export const server = {
  findReviews: defineAction({
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
      return findReviews({ skip: page * take, take });
    },
  }),
  createReview: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await createReview({ ...args, userId: session.userId });

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
  updateReview: defineAction({
    accept: "form",
    input: z.object({
      reviewId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await updateReview(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
  deleteReview: defineAction({
    accept: "form",
    input: z.object({
      reviewId: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await deleteReview(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
  findRandomAlbums: defineAction({
    accept: "json",
    handler: async (_input, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      return findRandomAlbums({ userId: session.userId, take: 20 });
    },
  }),
  findAlbumsByQuery: defineAction({
    accept: "json",
    input: z.object({
      query: z.string(),
      page: z.number(),
    }),
    handler: async ({ query, page }, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const take = 20;
      return findAlbumsByQuery({ query, skip: page * take, take });
    },
  }),
  updateAlbum: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      title: z.string().optional(),
      year: z.coerce.number().optional(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await updateAlbum(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
  deleteAlbum: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
    }),
    handler: async (args, context) => {
      const session = await getActionSession(context.cookies);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await deleteAlbum(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
  }),
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

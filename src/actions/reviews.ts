import {
  createReview,
  deleteReview,
  findReviews,
  updateReview,
} from "@server/data/reviews";
import { ActionError, defineAction, z } from "astro:actions";
import { DB_ERROR, UNAUTHORIZED_ERROR } from "./errors";

export const reviews = {
  createReview: defineAction({
    accept: "form",
    handler: async (args, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await createReview({ ...args, userId });

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
    input: z.object({
      albumId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    }),
  }),
  deleteReview: defineAction({
    accept: "form",
    handler: async (args, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await deleteReview(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
    input: z.object({
      reviewId: z.string(),
    }),
  }),
  findReviews: defineAction({
    accept: "json",
    handler: ({ page }, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const take = 20;
      return findReviews({ skip: page * take, take });
    },
    input: z.object({
      page: z.number(),
    }),
  }),
  updateReview: defineAction({
    accept: "form",
    handler: async (args, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const result = await updateReview(args);

      if (result.rowsAffected === 0) {
        throw new ActionError(DB_ERROR);
      }

      return { success: true };
    },
    input: z.object({
      rate: z.number().min(0).max(10),
      reviewId: z.string(),
      text: z.string(),
    }),
  }),
};

import { deleteAlbum, updateAlbum } from "@server/albums";
import { getActionSession } from "@server/auth";
import { createReview, deleteReview, updateReview } from "@server/reviews";
import { ActionError, defineAction, getApiContext, z } from "astro:actions";

const UNAUTHORIZED_ERROR = {
  code: "UNAUTHORIZED",
  message: "Access denied",
} as const;

const DB_ERROR = {
  code: "BAD_REQUEST",
  message: "Something went wrong",
} as const;

export const server = {
  createReview: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    }),
    handler: async (args) => {
      const context = getApiContext();
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
    handler: async (args) => {
      const context = getApiContext();
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
    handler: async (args) => {
      const context = getApiContext();
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
  updateAlbum: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      title: z.string().optional(),
      year: z.coerce.number().optional(),
    }),
    handler: async (args) => {
      const context = getApiContext();
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
    handler: async (args) => {
      const context = getApiContext();
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
};

import {
  deleteAlbum,
  findAlbumsByQuery,
  findRandomAlbums,
  updateAlbum,
} from "@server/data/albums";
import { ActionError, defineAction, z } from "astro:actions";
import { DB_ERROR, UNAUTHORIZED_ERROR } from "./errors";

export const albums = {
  findRandomAlbums: defineAction({
    accept: "json",
    handler: async (_input, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      return findRandomAlbums({ userId, take: 20 });
    },
  }),
  findAlbumsByQuery: defineAction({
    accept: "json",
    input: z.object({
      query: z.string(),
      page: z.number(),
    }),
    handler: async ({ query, page }, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
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
      const userId = context.locals.session?.userId;

      if (!userId) {
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
      const userId = context.locals.session?.userId;

      if (!userId) {
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

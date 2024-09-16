import {
  deleteAlbum,
  findAlbumsByQuery,
  findRandomAlbums,
  updateAlbum,
} from "@server/data/albums";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { DB_ERROR, UNAUTHORIZED_ERROR } from "./errors";

export const albums = {
  deleteAlbum: defineAction({
    accept: "form",
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
    input: z.object({
      albumId: z.string(),
    }),
  }),
  findAlbumsByQuery: defineAction({
    accept: "json",
    handler: ({ query, page }, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      const take = 20;
      return findAlbumsByQuery({ query, skip: page * take, take });
    },
    input: z.object({
      page: z.number(),
      query: z.string(),
    }),
  }),
  findRandomAlbums: defineAction({
    accept: "json",
    handler: (_input, context) => {
      const userId = context.locals.session?.userId;

      if (!userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      return findRandomAlbums({ take: 20, userId });
    },
  }),
  updateAlbum: defineAction({
    accept: "form",
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
    input: z.object({
      albumId: z.string(),
      title: z.string().optional(),
      year: z.coerce.number().optional(),
    }),
  }),
};

import { getActionSession } from "@server/auth";
import { createReview } from "@server/reviews";
import { paths } from "@utils/paths";
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
  review: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      rate: z.number().min(0).max(10),
      text: z.string(),
    }),
    handler: async (args) => {
      const context = getApiContext();
      const session = await getActionSession(context.cookies);

      console.log("userId", context.locals, session);

      if (!session?.userId) {
        throw new ActionError(UNAUTHORIZED_ERROR);
      }

      try {
        const result = await createReview({
          ...args,
          userId: session.userId,
        });
        if (result.rowsAffected === 0) {
          throw new ActionError(DB_ERROR);
        }
      } catch (error) {
        console.log({ error });
      }

      return context.redirect(paths.album(args.albumId));
    },
  }),
};

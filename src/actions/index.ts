import { defineAction, z } from "astro:actions";

export const server = {
  review: defineAction({
    accept: "form",
    input: z.object({
      albumId: z.string(),
      rate: z.number().min(6).max(10),
      text: z.string().min(2),
    }),
    handler: async ({ albumId, rate, text }) => {
      console.log({ albumId, rate, text });
      // call a mailing service, or store to a database
      return { success: true };
    },
  }),
};

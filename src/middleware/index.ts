import { initServerEnv } from "@server/serverEnv";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  await initServerEnv(context);

  console.log("AAA");

  // initSupabase(context);

  // await initSession(context);

  return next();
});

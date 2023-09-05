import { initServerEnv } from "@server/serverEnv";
import { initSession } from "@server/session";
import { initSupabase } from "@server/supabase";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  await initServerEnv(context);

  initSupabase(context);

  await initSession(context);

  return next();
});

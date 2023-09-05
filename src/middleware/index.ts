import { initSession } from "@server/session";
import { initSupabase } from "@server/supabase";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  initSupabase(context);

  await initSession(context);

  return next();
});

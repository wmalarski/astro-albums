import { paths } from "@utils/paths";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context): Response => {
  context.locals.supabase.auth.signOut();

  return context.redirect(paths.login);
};

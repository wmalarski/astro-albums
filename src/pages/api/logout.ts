import { setBlankSessionCookie } from "@server/auth";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context): Response => {
  setBlankSessionCookie(context);

  return context.redirect(paths.login);
};

import { removeAuthCookies } from "@server/session";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context): Response => {
  removeAuthCookies(context);

  return context.redirect(paths.login);
};

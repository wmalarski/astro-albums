import { lucia } from "@server/session";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context): Response => {
  const sessionCookie = lucia.createBlankSessionCookie();

  context.cookies.set("Set-Cookie", sessionCookie.serialize());

  return context.redirect(paths.login);
};

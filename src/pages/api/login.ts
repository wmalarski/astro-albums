import type { APIContext } from "astro";
import { createAuthorizationUrl } from "@server/auth/session";

export const GET = async (context: APIContext): Promise<Response> => {
  const url = await createAuthorizationUrl(context);

  return context.redirect(url.toString());
};

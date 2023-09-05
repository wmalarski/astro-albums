import { invalidRequestError } from "@server/errors";
import { getSessionSchema, updateAuthCookies } from "@server/session";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context): Promise<Response> => {
  const body = await context.request.json();

  const parsed = await getSessionSchema().safeParseAsync(body);

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.error.message });
  }

  updateAuthCookies(context, parsed.data);

  return context.redirect(paths.index());
};

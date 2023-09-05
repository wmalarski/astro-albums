import { invalidRequestError } from "@server/errors";
import { getSessionSchema, updateAuthCookies } from "@server/session";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";
import { safeParseAsync } from "valibot";

export const POST: APIRoute = async (context): Promise<Response> => {
  const body = await context.request.json();

  const parsed = await safeParseAsync(getSessionSchema(), body);

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.error.message });
  }

  updateAuthCookies(context, parsed.output);

  return context.redirect(paths.index());
};

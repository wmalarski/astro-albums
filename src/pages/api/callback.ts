import { invalidRequestError } from "@server/errors";
import { paths } from "@utils/paths";
import type { APIRoute } from "astro";
import { object, safeParseAsync, string } from "valibot";

export const GET: APIRoute = async (context): Promise<Response> => {
  const parsed = await safeParseAsync(
    object({ code: string() }),
    Object.fromEntries(context.url.searchParams.entries()),
  );

  if (!parsed.success) {
    return invalidRequestError({ text: parsed.issues[0].message });
  }

  await context.locals.supabase.auth.exchangeCodeForSession(parsed.output.code);

  return context.redirect(paths.index());
};

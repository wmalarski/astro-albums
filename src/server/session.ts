import type { APIContext } from "astro";
import { object, string } from "valibot";

export const getSessionSchema = () => {
  return object({ access_token: string(), refresh_token: string() });
};

export const initSession = async (context: APIContext) => {
  const result = await context.locals.supabase.auth.getSession();

  context.locals.session = result.data.session;
};

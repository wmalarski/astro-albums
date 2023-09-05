import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { APIContext } from "astro";
import { object, safeParseAsync, string } from "valibot";

const cookieName = "_session";

export const getSessionSchema = () => {
  return object({ access_token: string(), refresh_token: string() });
};

export const updateAuthCookies = (
  context: APIContext,
  session: Pick<Session, "refresh_token" | "access_token">,
) => {
  context.cookies.set(cookieName, session, {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "strict",
  });
};

export const removeAuthCookies = (context: APIContext) => {
  context.cookies.delete(cookieName, {
    path: "/",
  });
};

const getSession = async (context: APIContext) => {
  const cookieHeader = context.cookies.get(cookieName)?.json();

  const parsed = await safeParseAsync(getSessionSchema(), cookieHeader);

  if (!parsed.success) {
    return null;
  }

  const supabase: SupabaseClient = context.locals.supabase;
  const sessionResponse = await supabase.auth.setSession(parsed.output);

  if (sessionResponse.data.session) {
    return sessionResponse.data.session;
  }

  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: parsed.output.refresh_token,
  });

  if (!refreshResponse.data.session) {
    removeAuthCookies(context);
    return null;
  }

  const session = refreshResponse.data.session;
  updateAuthCookies(context, session);

  return session;
};

export const initSession = async (context: APIContext) => {
  const session = await getSession(context);

  context.locals.session = session;
};

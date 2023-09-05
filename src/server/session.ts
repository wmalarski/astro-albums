import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { APIContext } from "astro";
import cookie from "cookie";
import { z } from "zod";

export const getUser = async (req: Request) => {
  const parsedCookie = cookie.parse(req.headers.get("cookie") ?? "");

  if (!parsedCookie.sbat) {
    return {};
  }

  const result = await supabase.auth.getUser(parsedCookie.sbat);

  if (result.data.user && result.data.user?.role === "authenticated") {
    return { user: result.data.user };
  }

  if (!parsedCookie.sret) {
    return {};
  }

  const refresh = await supabase.auth.refreshSession({
    refresh_token: parsedCookie.sret,
  });

  if (!refresh.data || !refresh.data.user) {
    return {};
  }

  return { session: refresh.data, user: refresh.data.user };
};

export const getSessionHeaders = (session?: Session | null): HeadersInit => {
  if (!session) {
    return [];
  }

  const refreshCookie = cookie.serialize("sret", session.refresh_token || "", {
    expires: session.expires_at ? new Date(session.expires_at) : undefined,
    httpOnly: true,
    maxAge: 86400,
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  const accessTokenCookie = cookie.serialize("sbat", session.access_token, {
    expires: session.expires_at ? new Date(session.expires_at) : undefined,
    httpOnly: true,
    maxAge: 604800,
    path: "/",
    sameSite: "lax",
    secure: true,
  });

  return [
    ["Set-Cookie", refreshCookie],
    ["Set-Cookie", accessTokenCookie],
  ];
};

export const updateSessionHeaders = (
  headers: Headers,
  session?: Session | null,
) => {
  if (!session) {
    return;
  }

  headers.delete("Set-Cookie");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (getSessionHeaders(session) as any).forEach(([key, value]: string[]) => {
    if (!key || !value) {
      return;
    }
    headers.append(key, value);
  });
};

const cookieName = "_session";

export const updateAuthCookies = (
  event: APIContext,
  session: Pick<Session, "refresh_token" | "expires_in" | "access_token">,
) => {
  event.cookies.set(cookieName, session, {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "strict",
  });
};

export const removeAuthCookies = (context: APIContext) => {
  context.cookies.delete(cookieName);
};

const getSession = async (context: APIContext) => {
  const cookieHeader = context.request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const parsed = z
    .object({ access_token: z.string(), refresh_token: z.string() })
    .safeParse(cookie.parse(cookieHeader));

  if (!parsed.success) {
    return null;
  }

  const supabase: SupabaseClient = context.locals.supabase;
  const sessionResponse = await supabase.auth.setSession(parsed.data);

  if (sessionResponse.data.session) {
    return sessionResponse.data.session;
  }

  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
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

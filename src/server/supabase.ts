import { createClient, Session } from "@supabase/supabase-js";
import cookie from "cookie";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_KEY,
);

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

export const isLoggedIn = async (req: Request) => {
  const user = await getUser(req);
  return user != null;
};

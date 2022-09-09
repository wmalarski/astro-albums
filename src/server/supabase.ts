import { createClient, Session } from "@supabase/supabase-js";
import cookie from "cookie";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_KEY
);

export const getUser = async (req: Request) => {
  const parsedCookie = cookie.parse(req.headers.get("cookie") ?? "");

  if (!parsedCookie.sbat) {
    return {};
  }

  const result = await supabase.auth.api.getUser(parsedCookie.sbat);

  if (result.user && result.user.role === "authenticated") {
    return { user: result.user };
  }

  if (!parsedCookie.sret) {
    return {};
  }

  const refresh = await supabase.auth.api.refreshAccessToken(parsedCookie.sret);

  if (!refresh.data || !refresh.data.user) {
    return {};
  }

  return { session: refresh.data, user: refresh.data.user };
};

export const getSessionHeaders = (session?: Session | null): HeadersInit => {
  if (!session) {
    return [];
  }

  return [
    [
      "Set-Cookie",
      cookie.serialize("sbat", session.access_token, { path: "/" }),
    ],
    // [
    //   "Set-Cookie",
    //   cookie.serialize("sret", session.refresh_token || "", { path: "/" }),
    // ],
  ];
};

export const updateSessionHeaders = (
  headers: Headers,
  session?: Session | null
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

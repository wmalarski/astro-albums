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

  const refresh = await supabase.auth.setSession(parsedCookie.sret);

  console.log({ parsedCookie, refresh, result });

  if (!refresh.session || !refresh.session.user) {
    return {};
  }

  return { session: refresh.session, user: refresh.session.user };
};

export const updateSessionHeaders = (
  headers: Headers,
  session?: Session | null
) => {
  if (!session) {
    return;
  }

  headers.set(
    "Set-Cookie",
    cookie.serialize("sbat", session.access_token, { path: "/" })
  );
  headers.append(
    "Set-Cookie",
    cookie.serialize("sret", session.refresh_token || "", { path: "/" })
  );
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
    [
      "Set-Cookie",
      cookie.serialize("sret", session.refresh_token || "", { path: "/" }),
    ],
  ];
};

export const isLoggedIn = async (req: Request) => {
  const user = await getUser(req);
  return user != null;
};

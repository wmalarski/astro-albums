import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_KEY
);

export const getUser = async (req: Request) => {
  const parsedCookie = cookie.parse(req.headers.get("cookie") ?? "");

  if (!parsedCookie.sbat) {
    return null;
  }

  const result = await supabase.auth.api.getUser(parsedCookie.sbat);
  if (!result.user || result.user.role !== "authenticated") {
    return null;
  }

  return result.user;
};

export const isLoggedIn = async (req: Request) => {
  const user = await getUser(req);
  return user != null;
};

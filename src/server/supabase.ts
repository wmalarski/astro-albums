import { createClient } from "@supabase/supabase-js";
import type { SupabaseAuthClientOptions } from "@supabase/supabase-js/dist/module/lib/types";
import type { APIContext } from "astro";

export const getCookieStorage = (
  context: APIContext,
): SupabaseAuthClientOptions["storage"] => {
  return {
    getItem(key: string): string | Promise<string | null> | null {
      return context.cookies.get(key)?.json() || null;
    },
    removeItem(key: string): void | Promise<void> {
      context.cookies.delete(key, {
        path: "/",
      });
    },
    setItem(key: string, value: string): void | Promise<void> {
      context.cookies.set(key, value, {
        httpOnly: true,
        maxAge: 610000,
        path: "/",
        sameSite: "strict",
      });
    },
  };
};

export const initSupabase = (context: APIContext) => {
  const supabase = createClient(
    context.locals.env.PUBLIC_SUPABASE_URL,
    context.locals.env.PUBLIC_SUPABASE_KEY,
    { auth: { flowType: "pkce", storage: getCookieStorage(context) } },
  );

  context.locals.supabase = supabase;
};

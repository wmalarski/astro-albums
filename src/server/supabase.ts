import { createClient } from "@supabase/supabase-js";
import type { APIContext } from "astro";

export const initSupabase = (context: APIContext) => {
  const supabase = createClient(
    context.locals.env.PUBLIC_SUPABASE_URL,
    context.locals.env.PUBLIC_SUPABASE_KEY,
    { auth: { persistSession: false } },
  );

  context.locals.supabase = supabase;
};

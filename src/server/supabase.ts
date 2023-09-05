import { createClient } from "@supabase/supabase-js";
import type { APIContext } from "astro";

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_KEY,
  { auth: { persistSession: false } },
);

const localsKey = "__supabase";

export const getSupabase = (context: APIContext) => {
  const cached = context.locals[localsKey];

  //
};

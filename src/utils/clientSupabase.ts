export const getClientSupabase = async () => {
  const { createClient } = await import("@supabase/supabase-js");

  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_KEY,
  );
};

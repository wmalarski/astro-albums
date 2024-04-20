/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    supabase: import("@supabase/supabase-js").SupabaseClient;
    session: import("@supabase/supabase-js").Session | null;
    env: import("@server/serverEnv").ServerEnv;
  }
}

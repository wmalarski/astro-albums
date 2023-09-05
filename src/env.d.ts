/// <reference types="astro/client" />

declare namespace App {
  import type { Session, SupabaseClient } from "@supabase/supabase-js";
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Locals {
    supabase: SupabaseClient;
    session: Session | null;
  }
}

import type { APIContext } from "astro";
import { object, parseAsync, string, type Input } from "valibot";

const serverEnvSchema = () => {
  return object({
    PUBLIC_SUPABASE_KEY: string(),
    PUBLIC_SUPABASE_URL: string(),
  });
};

export type ServerEnv = Input<ReturnType<typeof serverEnvSchema>>;

export const initServerEnv = async (context: APIContext) => {
  const parsed = await parseAsync(serverEnvSchema(), import.meta.env);

  context.locals.env = parsed;
};

import type { Session } from "@supabase/supabase-js";
import { getSessionHeaders } from "./supabase";

export const unauthorizedError = () => {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
  });
};

type InvalidRequestError = {
  session?: Session | null | undefined;
  text?: string;
};

export const invalidRequestError = ({
  session,
  text,
}: InvalidRequestError = {}) => {
  return new Response(JSON.stringify({ error: text || "Invalid Request" }), {
    headers: getSessionHeaders(session),
    status: 400,
  });
};

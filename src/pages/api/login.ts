import { generateCodeVerifier, generateState } from "arctic";

import type { APIContext } from "astro";
import { google } from "@server/session";

export const GET = async (context: APIContext): Promise<Response> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier);

  context.cookies.set("state", state, {
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    path: "/",
    secure: true,
  });

  context.cookies.set("code_verifier", codeVerifier, {
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
    path: "/",
    secure: true,
  });

  return context.redirect(url.toString());
};

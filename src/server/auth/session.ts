import { generateCodeVerifier, generateState, type GoogleTokens } from "arctic";

import type { APIContext, AstroCookieSetOptions } from "astro";
import { lucia } from "@server/auth/lucia";
import { verifyRequestOrigin } from "lucia";
import { googleClient } from "./google";

const CODE_KEY = "code";
const CODE_VERIFIER_KEY = "code_verifier";
const STATE_KEY = "state";
const COOKIE_OPTIONS: AstroCookieSetOptions = {
  httpOnly: true,
  maxAge: 60 * 10, // 10 min
  path: "/",
  secure: import.meta.env.PROD,
};

export const createAuthorizationUrl = async (
  context: APIContext,
): Promise<string> => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await googleClient.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  context.cookies.set(STATE_KEY, state, COOKIE_OPTIONS);
  context.cookies.set(CODE_VERIFIER_KEY, codeVerifier, COOKIE_OPTIONS);

  return url.toString();
};

export const validateAuthorizationCode = (
  context: APIContext,
): Promise<GoogleTokens | null> => {
  const code = context.url.searchParams.get(CODE_KEY);
  const state = context.url.searchParams.get(STATE_KEY);

  const storedState = context.cookies.get(STATE_KEY)?.value;
  const storedCodeVerifier = context.cookies.get(CODE_VERIFIER_KEY)?.value;

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return Promise.resolve(null);
  }

  return googleClient.validateAuthorizationCode(code, storedCodeVerifier);
};

export const setSessionCookie = async (context: APIContext, userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
};

export const setBlankSessionCookie = (context: APIContext) => {
  const sessionCookie = lucia.createBlankSessionCookie();

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
};

export const verifyRequest = (context: APIContext) => {
  const originHeader = context.request.headers.get("Origin");
  const hostHeader = context.request.headers.get("Host");

  return (
    originHeader &&
    hostHeader &&
    verifyRequestOrigin(originHeader, [hostHeader])
  );
};

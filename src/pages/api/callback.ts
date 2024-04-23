import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { APIContext } from "astro";
import { google, lucia } from "@server/session";
import { User, db, eq } from "astro:db";
import { paths } from "@utils/paths";

const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export const GET = async (context: APIContext): Promise<Response> => {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");

  const storedState = context.cookies.get("state")?.value;
  const storedCodeVerifier = context.cookies.get("code_verifier")?.value;

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedState);

    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });

    const user = await response.json();

    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.google_id, user.id))
      .get();

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return context.redirect(paths.index());
    }

    const userId = generateId(15);

    await db.insert(User).values({
      google_id: user.id,
      id: userId,
      username: user.login,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return context.redirect(paths.index());
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};

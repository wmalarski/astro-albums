import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { APIContext } from "astro";
import { google, lucia } from "@server/session";
import { db } from "astro:db";

export const GET = async (context: APIContext): Promise<Response> => {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("google_oauth_state")?.value ?? null;

  if (!code || !state || !storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedState);

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${tokens.accessToken}` } },
    );

    const user = await response.json();

    // Replace this with your own DB client.
    const existingUser = await db
      .table("user")
      .where("github_id", "=", githubUser.id)
      .get();

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return context.redirect("/");
    }

    const userId = generateId(15);

    // Replace this with your own DB client.
    await db.table("user").insert({
      id: userId,
      github_id: githubUser.id,
      username: githubUser.login,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return context.redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};

interface GitHubUser {
  id: string;
  login: string;
}

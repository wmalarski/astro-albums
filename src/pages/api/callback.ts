import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";

import type { APIContext } from "astro";
import { User, db, eq } from "astro:db";
import { paths } from "@utils/paths";
import { setSessionCookie, validateAuthorizationCode } from "@server/auth";

const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export const GET = async (context: APIContext): Promise<Response> => {
  try {
    const tokens = await validateAuthorizationCode(context);

    if (!tokens) {
      return new Response(null, { status: 400 });
    }
    console.log({ tokens });

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
      await setSessionCookie(context, existingUser.id);

      return context.redirect(paths.index());
    }

    const userId = generateId(15);

    await db.insert(User).values({
      google_id: user.id,
      id: userId,
      username: user.login,
    });

    await setSessionCookie(context, userId);

    return context.redirect(paths.index());
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      console.log({ error });

      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};

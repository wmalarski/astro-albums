import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import { paths } from "@utils/paths";
import { setSessionCookie, validateAuthorizationCode } from "@server/auth";
import { getGoogleUser, getUserByGoogleId, insertUser } from "@server/user";

export const GET = async (context: APIContext): Promise<Response> => {
  try {
    const tokens = await validateAuthorizationCode(context);

    if (!tokens) {
      return new Response(null, { status: 400 });
    }

    const googleUser = await getGoogleUser(tokens);

    const existingUser = await getUserByGoogleId(googleUser.sub);

    if (existingUser) {
      await setSessionCookie(context, existingUser.id);

      return context.redirect(paths.index());
    }

    const newUser = await insertUser(googleUser);

    await setSessionCookie(context, newUser.id);

    return context.redirect(paths.index());
  } catch (error) {
    console.error({ error });
    if (error instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};

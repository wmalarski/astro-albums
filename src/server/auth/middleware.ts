import type { APIContext } from "astro";
import { lucia } from "@server/auth/lucia";
import { setBlankSessionCookie } from "@server/auth/session";

export const authMiddleware = async (context: APIContext) => {
    const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
  
    if (!sessionId) {
      context.locals.user = null;
      context.locals.session = null;
      return;
    }
  
    const { session, user } = await lucia.validateSession(sessionId);
  
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
  
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  
    if (!session) {
      setBlankSessionCookie(context);
    }
  
    context.locals.session = session;
    context.locals.user = user;
  };
  
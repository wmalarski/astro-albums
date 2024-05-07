import { Lucia } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";
import { db, Session, User } from "astro:db";
import { Google } from "arctic";

const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      sub: attributes.sub,
      name: attributes.name,
      picture: attributes.picture,
      id: attributes.id,
    };
  },
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
});

export const google = new Google(
  import.meta.env.GOOGLE_ID,
  import.meta.env.GOOGLE_SECRET,
  import.meta.env.GOOGLE_REDIRECT,
);

declare module "lucia" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof User.$inferSelect;
  }
}

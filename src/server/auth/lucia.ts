import { Lucia } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";
import { db, Session, User } from "astro:db";

const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      picture: attributes.picture,
      sub: attributes.sub,
    };
  },
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },
});

declare module "lucia" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof User.$inferSelect;
  }
}

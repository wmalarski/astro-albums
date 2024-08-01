import type { GoogleUser } from "@server/auth/google";
import { User, db, eq } from "astro:db";
import { generateId } from "lucia";

export const getUserByGoogleId = (googleId: string) => {
  return db.select().from(User).where(eq(User.sub, googleId)).get();
};

export const insertUser = (googleUser: GoogleUser) => {
  const userId = generateId(15);

  const values = {
    sub: googleUser.sub,
    id: userId,
    name: googleUser.name,
    picture: googleUser.picture,
  };

  return db.insert(User).values(values).returning().get();
};

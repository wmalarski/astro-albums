import type { GoogleTokens } from "arctic";
import { User, db, eq } from "astro:db";
import { generateId } from "lucia";

type GoogleUser = {
  sub: string;
  name: string;
  picture: string;
};

const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export const getGoogleUser = async (
  tokens: GoogleTokens,
): Promise<GoogleUser> => {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  return response.json();
};

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

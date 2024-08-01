import { Google, type GoogleTokens } from "arctic";

export type GoogleUser = {
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

export const googleClient = new Google(
  import.meta.env.GOOGLE_ID,
  import.meta.env.GOOGLE_SECRET,
  import.meta.env.GOOGLE_REDIRECT,
);

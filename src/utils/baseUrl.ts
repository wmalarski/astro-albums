export const getBaseUrl = (): string => {
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.PUBLIC_VERCEL_URL) {
    return `https://${process.env.PUBLIC_VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

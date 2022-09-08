export const getBaseUrl = (): string => {
  // reference for vercel.com
  if (import.meta.env.VERCEL_URL) {
    return `https://${import.meta.env.VERCEL_URL}`;
  }

  if (import.meta.env.PUBLIC_VERCEL_URL) {
    return `https://${import.meta.env.PUBLIC_VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${import.meta.env.PORT ?? 3000}`;
};

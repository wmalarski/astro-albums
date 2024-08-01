import { buildSearchParams } from "./searchParams";

export const paths = {
  album: (id: string): string => {
    return `/album/${id}`;
  },
  albumRelease: ({ sid }: { sid: string }): string => {
    return `http://coverartarchive.org/release/${sid}`;
  },
  callback: "/api/callback",
  editAlbum: (albumId: string) => `/album/${albumId}/edit`,
  editReview: (reviewId: string) => `/review/${reviewId}/edit`,
  error: "/error",
  index: ({ page, query }: { page?: number; query?: string } = {}) =>
    `/?${buildSearchParams({ page, query })}`,
  login: "/login",
  logout: "/api/logout",
  notFound: "/notFound",
  reminders: "/reminders",
  review: (albumId: string) => `/album/${albumId}/review`,
  reviews: (
    args: {
      query?: string;
      lower?: number;
      upper?: number;
      order?: string;
    } = {},
  ) => `/reviews?${buildSearchParams(args)}`,
};

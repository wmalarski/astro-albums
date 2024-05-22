import { buildSearchParams } from "./searchParams";

export const paths = {
  album: (id: string): string => {
    return `/album/${id}`;
  },
  albumRelease: ({ sid }: { sid: string }): string => {
    return `http://coverartarchive.org/release/${sid}`;
  },
  callback: "/api/callback",
  error: "/error",
  index: ({ page, query }: { page?: number; query?: string } = {}) =>
    `/?${buildSearchParams({ page, query })}`,
  login: "/login",
  logout: "/api/logout",
  notFound: "/notFound",
  review: (albumId: string) => `/album/${albumId}/review`,
  editReview: (reviewId: string) => `/review/${reviewId}/edit`,
  editAlbum: (albumId: string) => `/album/${albumId}/edit`,
  reviews: (
    args: {
      page?: number;
      query?: string;
      lower?: number;
      upper?: number;
      order?: string;
    } = {},
  ) => `/reviews?${buildSearchParams(args)}`,
};

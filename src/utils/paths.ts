import { buildSearchParams } from "./searchParams";

export const loginPath = "/login";
export const errorPath = "/error";

export const paths = {
  album: (id: string): string => {
    return `/album/${id}`;
  },
  albumRelease: ({ sid }: { sid: string }): string => {
    return `http://coverartarchive.org/release/${sid}`;
  },
  callback: "/api/callback",
  error: "/error",
  index: ({ page, query }: { page?: number; query?: string } = {}): string => {
    return `/?${buildSearchParams({ page, query })}`;
  },
  login: "/login",
  logout: "/api/logout",
  notFound: "/notFound",
  review: (albumId: string) => `/album/${albumId}/review`,
  editReview: (reviewId: string) => `/review/${reviewId}/edit`,
  reviews: ({
    lower,
    page,
    query,
    upper,
  }: {
    page?: number;
    query?: string;
    lower?: number;
    upper?: number;
  } = {}): string => {
    return `/reviews?${buildSearchParams({ lower, page, query, upper })}`;
  },
};

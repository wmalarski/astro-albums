export const paths = {
  album: ({ id }: { id: string }): string => {
    return `/album/${id}`;
  },
  albumRelease: ({ sid }: { sid: string }): string => {
    return `http://coverartarchive.org/release/${sid}`;
  },
  index: ({ page, query }: { page?: number; query?: string } = {}): string => {
    const pageParam = page ? { page: `${page}` } : {};
    const queryParam = query ? { query } : {};
    const params = { ...pageParam, ...queryParam };
    return `/?${new URLSearchParams(params)}`;
  },
  login: "/login",
  logout: "/logout",
  notFound: "/notFound",
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
    const params = {
      ...(page ? { page: `${page}` } : {}),
      ...(query ? { query } : {}),
      ...(lower ? { lower: `${lower}` } : {}),
      ...(upper ? { upper: `${upper}` } : {}),
    };
    return `/reviews?${new URLSearchParams(params)}`;
  },
};

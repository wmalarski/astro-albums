export const paths = {
  album: (id: string) => `/album/${id}`,
  albumRelease: (sid: string) => `http://coverartarchive.org/release/${sid}`,
  apiLogin: "/api/login",
  callback: "/api/callback",
  editAlbum: (albumId: string) => `/album/${albumId}/edit`,
  editReview: (reviewId: string) => `/review/${reviewId}/edit`,
  error: "/error",
  index: "/",
  login: "/login",
  logout: "/api/logout",
  notFound: "/notFound",
  reminders: "/reminders",
  review: (albumId: string) => `/album/${albumId}/review`,
  reviews: "/reviews",
};

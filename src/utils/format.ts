import { Album, Artist } from "astro:db";

type FormatAlbum = {
  album: typeof Album.$inferSelect;
  artist: typeof Artist.$inferSelect;
};

export const formatAlbum = ({ album, artist }: FormatAlbum) => {
  const year = album.year ? `(${album.year})` : "";
  return `${artist.name} - ${album.title}${year}`;
};

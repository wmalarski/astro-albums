import type { Album, Artist } from "@prisma/client";

type FormatAlbum = {
  album: Album;
  artist: Artist;
};

export const formatAlbum = ({ album, artist }: FormatAlbum) => {
  const year = album.year ? `(${album.year})` : "";
  return `${artist.name} - ${album.title}${year}`;
};

import { Album, Artist, Review, db, eq } from "astro:db";

type FindArtistAlbumsAndReviewsArgs = {
  artistId: string;
};

export const findArtistAlbumsAndReviewsArgs = async ({
  artistId,
}: FindArtistAlbumsAndReviewsArgs) => {
  const artistReviewsAndAlbums = await db
    .select()
    .from(Review)
    .fullJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(eq(Artist.id, artistId))
    .all();

  const reviews = new Map<string, typeof Review.$inferSelect>();
  const albums = new Map<string, typeof Album.$inferSelect>();

  artistReviewsAndAlbums.forEach((row) => {
    if (row.Review) {
      reviews.set(row.Review.id, row.Review);
    }
    if (row.Album) {
      albums.set(row.Album.id, row.Album);
    }
  });

  return {
    albums: Array.from(albums.values()),
    reviews: Array.from(reviews.values()),
  };
};

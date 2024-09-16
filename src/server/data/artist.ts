import { Album, Artist, Reminder, Review, db, eq } from "astro:db";

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
    .leftJoin(Reminder, eq(Album.id, Reminder.albumId))
    .where(eq(Artist.id, artistId))
    .all();

  const reviews = new Map<string, typeof Review.$inferSelect>();
  const albums = new Map<string, typeof Album.$inferSelect>();
  const reminders = new Map<string, typeof Reminder.$inferSelect>();

  artistReviewsAndAlbums.forEach((row) => {
    if (row.Review) {
      reviews.set(row.Review.id, row.Review);
    }
    if (row.Album) {
      albums.set(row.Album.id, row.Album);
    }
    if (row.Reminder) {
      reminders.set(row.Reminder.albumId, row.Reminder);
    }
  });

  return {
    albums: Array.from(albums.values()),
    reminders,
    reviews: Array.from(reviews.values()),
  };
};

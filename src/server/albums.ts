import {
  Album,
  and,
  count,
  db,
  eq,
  or,
  like,
  Artist,
  Review,
  inArray,
  sql,
} from "astro:db";

const addReviewCounts = async <T extends { id: string }>(
  albums: T[],
  userId: string,
) => {
  const albumIds = albums.map((album) => album.id);

  const groups = await db
    .select({ albumId: Review.albumId, count: count() })
    .from(Review)
    .groupBy(Review.albumId)
    .having(inArray(Review.albumId, albumIds))
    .where(eq(Review.userId, userId));

  const reviewsCount = new Map<string, number>();

  groups.forEach((group) => {
    reviewsCount.set(group.albumId, group.count);
  });

  return albums.map((album) => ({
    ...album,
    reviews: reviewsCount.get(album.id) ?? 0,
  }));
};

type FindAlbum = {
  id: string;
  userId: string;
};

export const findAlbum = async ({ id }: FindAlbum) => {
  const albumWithArtist = await db
    .select()
    .from(Album)
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(eq(Album.id, id))
    .get();

  if (!albumWithArtist) {
    return { album: null, albums: [], reviews: [], artist: null };
  }

  const artistReviewsAndAlbums = await db
    .select()
    .from(Review)
    .fullJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(eq(Artist.id, albumWithArtist.Album.artistId))
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
    album: albumWithArtist.Album,
    artist: albumWithArtist.Artist,
    albums: Array.from(albums.values()),
    reviews: Array.from(reviews.values()),
  };
};

type FindAlbumsByQueryArgs = {
  take: number;
  skip: number;
  query: string;
};

export const findAlbumsByQuery = ({
  skip,
  take,
  query,
}: FindAlbumsByQueryArgs) => {
  const pattern = `%${query}%`;

  return db
    .select()
    .from(Album)
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(or(like(Album.title, pattern), like(Artist.name, pattern)))
    .limit(take)
    .offset(skip)
    .orderBy(Album.createdAt)
    .all();
};

type FindRandomAlbums = {
  take: number;
  userId: string;
};

const findRandomAlbums = async ({ take, userId }: FindRandomAlbums) => {
  const result = await db.all<{ id: string }>(sql`
    select "Album".id from "Album" 
    left join "Review" on "Album".id = "Review"."albumId" 
    where "Review".id is NULL or "Review"."userId" != ${userId}
    order by random()
    LIMIT ${take};
  `);

  const ids = result.map((entry) => entry.id);

  const albums = await db
    .select()
    .from(Album)
    .where(inArray(Album.id, ids))
    .innerJoin(Artist, eq(Album.artistId, Artist.id));

  const withReviews = albums.map((album) => ({ ...album, reviews: 0 }));

  return withReviews;
};

type FindHomepageAlbums = {
  take: number;
  skip: number;
  query: string;
  userId: string;
};

export const findHomepageAlbums = ({
  query,
  skip,
  take,
  userId,
}: FindHomepageAlbums) => {
  if (query.length === 0) {
    return findRandomAlbums({ take, userId });
  }
  return findAlbumsByQuery({ skip, take, query });
};

type UpdateAlbum = {
  year?: number | undefined;
  title?: string | undefined;
  albumId: string;
  userId: string;
};

export const updateAlbum = ({ albumId, title, userId, year }: UpdateAlbum) => {
  return db
    .update(Album)
    .set({
      ...(title ? { title } : {}),
      ...(year || year === 0 ? { year } : {}),
    })
    .where(and(eq(Album.id, albumId), eq(Album.userId, userId)))
    .run();
};

type DeleteAlbum = {
  albumId: string;
  userId: string;
};

export const deleteAlbum = ({ albumId, userId }: DeleteAlbum) => {
  return db
    .delete(Album)
    .where(and(eq(Album.id, albumId), eq(Album.userId, userId)))
    .run();
};

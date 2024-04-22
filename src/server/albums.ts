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

type FindRandomAlbums = {
  take: number;
  userId: string;
};

export const findRandomAlbums = async ({ take, userId }: FindRandomAlbums) => {
  const result = await db.get<{ id: string }[]>(sql`
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

  return { albums: withReviews };
};

const addReviewCounts = async <T extends { id: string }>(
  albums: T[],
  userId: string
) => {
  const albumIds = albums.map((album) => album.id);

  const groups = await db
    .select({ count: count(), albumId: Review.albumId })
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

export const findAlbum = async ({ id, userId }: FindAlbum) => {
  const album = await db
    .select()
    .from(Review)
    .limit(1)
    .where(eq(Review.albumId, id))
    .innerJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.id, Artist.id))
    .then((result) => result.at(0));

  if (!album) {
    return { album: null, albums: [], reviews: [] };
  }

  // const [albums, reviews] = await Promise.all([
  //   db.select().from(Album).where(eq(Album.artistId, album.Artist.id)),
  //   db.select().from(Review).where()
  //   prisma.review.findMany({
  //     where: { album: { artistId: album.artistId }, userId },
  //   }),
  // ]);

  // const counts = reviews.reduce<Record<string, number>>((prev, curr) => {
  //   const count = prev[curr.albumId] || 0;
  //   prev[curr.albumId] = count + 1;
  //   return prev;
  // }, {});

  // const withCounts = albums.map((album) => ({
  //   ...album,
  //   reviews: counts[album.id] || 0,
  // }));

  return { album, albums: [], reviews: [] };
};

type FindAlbums = {
  take: number;
  skip: number | null;
  query: string;
  userId: string;
};

export const findAlbums = async ({ skip, take, query, userId }: FindAlbums) => {
  const [albums, counts] = await Promise.all([
    db
      .select()
      .from(Album)
      .innerJoin(Artist, eq(Album.artistId, Artist.id))
      .where(or(like(Album.title, query)))
      .limit(take)
      .offset(skip ?? 0)
      .orderBy(Album.createdAt),
    db
      .select({ count: count() })
      .from(Album)
      .where(or(like(Album.title, query))),
  ]);

  const albumsWithCounts = await addReviewCounts([], userId);

  return { albums: albumsWithCounts, count: counts };
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

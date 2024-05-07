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

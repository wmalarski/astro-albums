import { Album, db, eq, or, like, Artist, inArray, sql } from "astro:db";

type FindAlbumArgs = {
  albumId: string;
};

export const findAlbum = ({ albumId }: FindAlbumArgs) => {
  return db
    .select()
    .from(Album)
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(eq(Album.id, albumId))
    .get();
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

export const findRandomAlbums = async ({ take, userId }: FindRandomAlbums) => {
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

type UpdateAlbum = {
  year?: number | undefined;
  title?: string | undefined;
  albumId: string;
};

export const updateAlbum = ({ albumId, title, year }: UpdateAlbum) => {
  return db
    .update(Album)
    .set({
      ...(title ? { title } : {}),
      ...(year || year === 0 ? { year } : {}),
    })
    .where(eq(Album.id, albumId))
    .run();
};

type DeleteAlbum = {
  albumId: string;
};

export const deleteAlbum = ({ albumId }: DeleteAlbum) => {
  return db.delete(Album).where(eq(Album.id, albumId)).run();
};

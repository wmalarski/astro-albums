import {
  Album,
  Artist,
  db,
  eq,
  inArray,
  like,
  or,
  Reminder,
  sql,
} from "astro:db";

type FindAlbumArgs = {
  albumId: string;
};

export const findAlbum = ({ albumId }: FindAlbumArgs) => {
  return db
    .select()
    .from(Album)
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .leftJoin(Reminder, eq(Album.id, Reminder.albumId))
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
    .leftJoin(Reminder, eq(Album.id, Reminder.albumId))
    .where(or(like(Album.title, pattern), like(Artist.name, pattern)))
    .limit(take)
    .offset(skip)
    .orderBy(Album.createdAt)
    .all();
};

type FindRandomAlbumsArgs = {
  take: number;
  userId: string;
};

export const findRandomAlbums = async ({
  take,
  userId,
}: FindRandomAlbumsArgs) => {
  const result = await db.all<{ id: string }>(sql`
    select "Album".id from "Album" 
    left join "Review" on "Album".id = "Review"."albumId" 
    where "Review".id is NULL or "Review"."userId" != ${userId}
    order by random()
    LIMIT ${take};
  `);

  const ids = result.map((entry) => entry.id);

  if (ids.length < 1) {
    return [];
  }

  const albums = await db
    .select()
    .from(Album)
    .where(inArray(Album.id, ids))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .leftJoin(Reminder, eq(Album.id, Reminder.albumId));

  const withReviews = albums.map((album) => ({ ...album, reviews: 0 }));

  return withReviews;
};

export type FindRandomAlbumsResult = Awaited<
  ReturnType<typeof findRandomAlbums>
>;

type UpdateAlbumArgs = {
  year?: number | undefined;
  title?: string | undefined;
  albumId: string;
};

export const updateAlbum = ({ albumId, title, year }: UpdateAlbumArgs) => {
  return db
    .update(Album)
    .set({
      ...(title ? { title } : {}),
      ...(year || year === 0 ? { year } : {}),
    })
    .where(eq(Album.id, albumId))
    .run();
};

type DeleteAlbumArgs = {
  albumId: string;
};

export const deleteAlbum = ({ albumId }: DeleteAlbumArgs) => {
  return db.delete(Album).where(eq(Album.id, albumId)).run();
};

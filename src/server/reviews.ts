import { Album, and, Artist, count, db, eq, Review, sql } from "astro:db";

type FindReviews = {
  take: number;
  skip: number;
  userId: string;
};

export const findReviews = async ({ skip, take, userId }: FindReviews) => {
  const [reviews, countResult] = await Promise.all([
    db
      .select()
      .from(Review)
      .where(eq(Review.userId, userId))
      .innerJoin(Album, eq(Review.albumId, Album.id))
      .innerJoin(Artist, eq(Album.artistId, Artist.id))
      .limit(take)
      .offset(skip)
      .orderBy(Review.createdAt),
    db.select().from(Review).where(eq(Review.userId, userId)),
  ]);

  return { count: countResult, reviews };
};

type FindReviewsByArtist = {
  artistId: string;
  skip: number;
  take: number;
  userId: string;
};

export const findReviewsByArtist = async ({
  artistId,
  skip,
  take,
  userId,
}: FindReviewsByArtist) => {
  const [reviews, countResult] = await Promise.all([
    db
      .select()
      .from(Review)
      .innerJoin(Album, eq(Review.albumId, Album.id))
      .where(and(eq(Album.artistId, artistId), eq(Review.userId, userId)))
      .limit(take)
      .offset(skip)
      .orderBy(Review.createdAt),
    db
      .select({ count: count() })
      .from(Review)
      .innerJoin(Album, eq(Review.albumId, Album.id))
      .where(and(eq(Album.artistId, artistId), eq(Review.userId, userId))),
  ]);

  return { count: countResult, reviews };
};

type CountReviewsByDates = {
  userId: string;
};

export type CountReviewsByDatesResult = {
  count: number;
  date: Date;
};

export const countReviewsByDates = async ({ userId }: CountReviewsByDates) => {
  const groups = await db.get<CountReviewsByDatesResult[]>(sql`
    SELECT DATE_TRUNC('day', "created_at") as date, count(id) 
    FROM "public"."Review" 
    WHERE "created_at" > CURRENT_DATE - INTERVAL '1 year' AND "user_id" = ${userId} 
    GROUP BY DATE_TRUNC('day', "created_at") 
    ORDER BY DATE_TRUNC('day', "created_at") DESC
  `);

  return { groups };
};

type CreateReview = {
  rate: number;
  text: string;
  albumId: string;
  userId: string;
};

export const createReview = ({ rate, text, albumId, userId }: CreateReview) => {
  return db.insert(Review).values({ albumId, rate, text, userId }).run();
};

type UpdateReview = {
  rate?: number | undefined;
  text?: string | undefined;
  reviewId: string;
  userId: string;
};

export const updateReview = ({
  rate,
  text,
  reviewId,
  userId,
}: UpdateReview) => {
  return db
    .update(Review)
    .set({ ...(rate || rate === 0 ? { rate } : {}), ...(text ? { text } : {}) })
    .where(and(eq(Review.id, reviewId), eq(Review.userId, userId)))
    .run();
};

type DeleteReview = {
  reviewId: string;
  userId: string;
};

export const deleteReview = ({ reviewId, userId }: DeleteReview) => {
  return db
    .delete(Review)
    .where(and(eq(Review.id, reviewId), eq(Review.userId, userId)))
    .run();
};

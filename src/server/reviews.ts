import { Album, Artist, count, db, eq, Review, sql } from "astro:db";

type FindReviewArgs = {
  reviewId: string;
};

export const findReview = ({ reviewId }: FindReviewArgs) => {
  return db
    .select()
    .from(Review)
    .innerJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .where(eq(Review.id, reviewId))
    .get();
};

type FindReviews = {
  take: number;
  skip: number;
};

export const findReviews = async ({ skip, take }: FindReviews) => {
  const [reviews, countResult] = await Promise.all([
    db
      .select()
      .from(Review)
      .innerJoin(Album, eq(Review.albumId, Album.id))
      .innerJoin(Artist, eq(Album.artistId, Artist.id))
      .limit(take)
      .offset(skip)
      .orderBy(Review.createdAt)
      .all(),
    db.select({ count: count() }).from(Review),
  ]);

  return { count: countResult, reviews };
};

export type CountReviewsByDatesResult = {
  "count(id)": number;
  date: string;
};

export const countReviewsByDates = async () => {
  const groups = await db.all<CountReviewsByDatesResult>(sql`
    SELECT datetime("Review".createdAt, 'start of day') as date, count(id) 
    FROM "Review" 
    WHERE "Review".createdAt > DATE('now', '-1 year')
    GROUP BY datetime("Review".createdAt, 'start of day') 
    ORDER BY datetime("Review".createdAt, 'start of day') DESC
  `);
  return groups;
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
};

export const updateReview = ({ rate, text, reviewId }: UpdateReview) => {
  return db
    .update(Review)
    .set({ ...(rate || rate === 0 ? { rate } : {}), ...(text ? { text } : {}) })
    .where(eq(Review.id, reviewId))
    .run();
};

type DeleteReview = {
  reviewId: string;
};

export const deleteReview = ({ reviewId }: DeleteReview) => {
  return db.delete(Review).where(eq(Review.id, reviewId)).run();
};

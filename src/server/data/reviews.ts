import { Album, Artist, db, eq, Reminder, Review, sql } from "astro:db";

type FindReviewArgs = {
  reviewId: string;
};

export const findReview = ({ reviewId }: FindReviewArgs) => {
  return db
    .select()
    .from(Review)
    .innerJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .leftJoin(Reminder, eq(Album.id, Reminder.albumId))
    .where(eq(Review.id, reviewId))
    .get();
};

type FindReviewsArgs = {
  take: number;
  skip: number;
};

export const findReviews = ({ skip, take }: FindReviewsArgs) => {
  return db
    .select()
    .from(Review)
    .innerJoin(Album, eq(Review.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .limit(take)
    .offset(skip)
    .orderBy(Review.createdAt)
    .all();
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

type CreateReviewArgs = {
  rate: number;
  text: string;
  albumId: string;
  userId: string;
};

export const createReview = ({
  rate,
  text,
  albumId,
  userId,
}: CreateReviewArgs) => {
  const id = crypto.randomUUID();
  return db.insert(Review).values({ albumId, id, rate, text, userId }).run();
};

type UpdateReviewArgs = {
  rate?: number | undefined;
  text?: string | undefined;
  reviewId: string;
};

export const updateReview = ({ rate, text, reviewId }: UpdateReviewArgs) => {
  return db
    .update(Review)
    .set({ ...(rate || rate === 0 ? { rate } : {}), ...(text ? { text } : {}) })
    .where(eq(Review.id, reviewId))
    .run();
};

type DeleteReviewArgs = {
  reviewId: string;
};

export const deleteReview = ({ reviewId }: DeleteReviewArgs) => {
  return db.delete(Review).where(eq(Review.id, reviewId)).run();
};

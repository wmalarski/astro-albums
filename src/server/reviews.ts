import { prisma } from "./prisma";

type FindReviews = {
  take: number;
  skip: number;
  userId: string;
};

export const findReviews = async ({ skip, take, userId }: FindReviews) => {
  const [reviews, count] = await Promise.all([
    prisma.review.findMany({
      include: { album: { include: { artist: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      where: { userId },
    }),
    prisma.review.count({
      where: { userId },
    }),
  ]);

  return { count, reviews };
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
  const [reviews, count] = await Promise.all([
    prisma.review.findMany({
      include: { album: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      where: { album: { artistId }, userId },
    }),
    prisma.review.count({
      where: { album: { artistId }, userId },
    }),
  ]);

  return { count, reviews };
};

type CountReviewsByDates = {
  userId: string;
};

export type CountReviewsByDatesResult = {
  count: number;
  date: Date;
};

export const countReviewsByDates = async ({ userId }: CountReviewsByDates) => {
  const groups = await prisma.$queryRaw<CountReviewsByDatesResult[]>`
    SELECT DATE_TRUNC('day', "createdAt") as date, count(id) FROM "public"."Review" WHERE "createdAt" > CURRENT_DATE - INTERVAL '1 year' AND "userId" = ${userId} GROUP BY DATE_TRUNC('day', "createdAt") ORDER BY DATE_TRUNC('day', "createdAt") DESC
  `;

  return { groups };
};

type CreateReview = {
  rate: number;
  text: string;
  albumId: string;
  userId: string;
};

export const createReview = ({ rate, text, albumId, userId }: CreateReview) => {
  return prisma.review.create({
    data: { albumId, rate, text, userId },
  });
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
  return prisma.review.updateMany({
    data: {
      ...(rate || rate === 0 ? { rate } : {}),
      ...(text ? { text } : {}),
    },
    where: { id: reviewId, userId },
  });
};

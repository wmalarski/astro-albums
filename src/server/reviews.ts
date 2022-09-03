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
      // where: { userId },
    }),
    prisma.review.count({
      // where: { userId },
    }),
  ]);

  return { count, reviews };
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

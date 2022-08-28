import { prisma } from "./prisma";

type FindRandomAlbums = {
  take: number;
  userId: string;
};

const randomNumber = (min: number, max: number) => {
  return Math.max(0, Math.floor(Math.random() * (max - min + 1)) + min);
};

export const findRandomAlbums = async ({ take, userId }: FindRandomAlbums) => {
  const count = await prisma.album.count({
    where: { reviews: { none: { userId } } },
  });

  return prisma.album.findMany({
    orderBy: { id: Math.random() < 0.5 ? "asc" : "desc" },
    skip: randomNumber(0, count - take - 1),
    take,
    where: { reviews: { none: { userId } } },
  });
};

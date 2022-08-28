import { prisma } from "./prisma";

const randomNumber = (min: number, max: number) => {
  return Math.max(0, Math.floor(Math.random() * (max - min + 1)) + min);
};

const randomSkip = async (take: number, userId: string) => {
  const count = await prisma.album.count({
    where: { reviews: { none: { userId } } },
  });

  const skip = randomNumber(0, count - take - 1);

  return skip;
};

type FindRandomAlbums = {
  take: number;
  userId: string;
  skip?: number | null;
};

export const findRandomAlbums = async ({
  take,
  userId,
  skip,
}: FindRandomAlbums) => {
  const findSkip = skip || (await randomSkip(take, userId));

  const albums = await prisma.album.findMany({
    include: { artist: true },
    skip: findSkip,
    take,
    where: { reviews: { none: { userId } } },
  });

  return { albums, skip: findSkip };
};

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

type FindAlbum = {
  id: string;
  userId: string;
};

export const findAlbum = async ({ id, userId }: FindAlbum) => {
  const album = await prisma.album.findFirst({
    include: { artist: true, reviews: true },
    where: { id },
  });

  if (!album) {
    return { album: null, albums: [], reviews: [] };
  }

  const [albums, reviews] = await Promise.all([
    prisma.album.findMany({
      where: { artistId: album.artistId },
    }),
    prisma.review.findMany({
      where: { album: { artistId: album.artistId }, userId },
    }),
  ]);

  return { album, albums, reviews };
};

type FindAlbums = {
  take: number;
  skip: number | null;
  query: string;
};

export const findAlbums = async ({ skip, take, query }: FindAlbums) => {
  const [albums, count] = await Promise.all([
    prisma.album.findMany({
      include: { artist: true },
      orderBy: { createdAt: "desc" },
      skip: skip || 0,
      take,
      where: {
        OR: [
          { title: { contains: query } },
          { artist: { name: { contains: query } } },
        ],
      },
    }),
    prisma.album.count({
      where: {
        OR: [
          { title: { contains: query } },
          { artist: { name: { contains: query } } },
        ],
      },
    }),
  ]);

  return { albums, count };
};

import { prisma } from "./prisma";

type FindRandomAlbums = {
  take: number;
  userId: string;
};

export const findRandomAlbums = async ({ take, userId }: FindRandomAlbums) => {
  const result = await prisma.$queryRaw<{ id: string }[]>`
    select "Album".id from "Album" 
    left join "Review" on "Album".id = "Review"."albumId" 
    where "Review".id is NULL or "Review"."userId" != ${userId}
    order by random()
    LIMIT ${take};
  `;

  const ids = result.map((entry) => entry.id);

  const albums = await prisma.album.findMany({
    include: { artist: true },
    where: { id: { in: ids } },
  });

  const withReviews = albums.map((album) => ({ ...album, reviews: 0 }));

  return { albums: withReviews };
};

const addReviewCounts = async <T extends { id: string }>(
  albums: T[],
  userId: string,
) => {
  const albumIds = albums.map((album) => album.id);

  const groups = await prisma.review.groupBy({
    _count: { albumId: true },
    by: ["albumId"],
    having: { albumId: { in: albumIds } },
    where: { userId },
  });

  const counts = groups.reduce<Record<string, number>>((prev, curr) => {
    prev[curr.albumId] = curr._count.albumId;
    return prev;
  }, {});

  return albums.map((album) => ({ ...album, reviews: counts[album.id] || 0 }));
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

  const counts = reviews.reduce<Record<string, number>>((prev, curr) => {
    const count = prev[curr.albumId] || 0;
    prev[curr.albumId] = count + 1;
    return prev;
  }, {});

  const withCounts = albums.map((album) => ({
    ...album,
    reviews: counts[album.id] || 0,
  }));

  return { album, albums: withCounts, reviews };
};

type FindAlbums = {
  take: number;
  skip: number | null;
  query: string;
  userId: string;
};

export const findAlbums = async ({ skip, take, query, userId }: FindAlbums) => {
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

  const albumsWithCounts = await addReviewCounts(albums, userId);

  return { albums: albumsWithCounts, count };
};

type UpdateAlbum = {
  year?: number | undefined;
  title?: string | undefined;
  albumId: string;
  userId: string;
};

export const updateAlbum = ({ albumId, title, userId, year }: UpdateAlbum) => {
  return prisma.album.updateMany({
    data: {
      ...(title ? { title } : {}),
      ...(year || year === 0 ? { year } : {}),
    },
    where: { id: albumId, userId },
  });
};

type DeleteAlbum = {
  albumId: string;
  userId: string;
};

export const deleteAlbum = ({ albumId, userId }: DeleteAlbum) => {
  return prisma.album.deleteMany({
    where: { id: albumId, userId },
  });
};

export type CoverKind = "small" | "large";

type FetchCovers = {
  mBid: string;
  kind: CoverKind;
};

type ImageData = {
  thumbnails: Record<CoverKind, string>;
};

export const fetchCovers = async ({
  mBid,
  kind,
}: FetchCovers): Promise<string[]> => {
  const response = await fetch(`https://coverartarchive.org/release/${mBid}`);

  if (response.status !== 200) {
    return [];
  }

  const json = await response.json();

  const thumbnails = json.images.map(
    (image: ImageData) => image.thumbnails[kind]
  );

  return thumbnails;
};

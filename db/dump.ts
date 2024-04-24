import fs from "node:fs/promises";

export const loadDumpData = async () => {
  const file = await fs.readFile("db/dump.sql", { encoding: "utf8" });
  const lines = file.split("\n");

  const startRegex = /^COPY public\."([a-zA-Z]+)"/g;
  const endRegex = /^\\\.$/g;

  const detectedChanges = lines
    .map((line, index) => ({
      end: line.match(endRegex),
      index,
      start: line.match(startRegex),
    }))
    .filter((changes) => changes.start || changes.end);

  const ranges = Array.from({ length: detectedChanges.length / 2 }).map(
    (_, index) => {
      const start = detectedChanges[index * 2]!;
      const end = detectedChanges[index * 2 + 1]!;
      const kind = start.start?.[0].match(/"(.+)"$/g)?.[0].replaceAll('"', "");
      return { end: end.index, kind, start: start.index };
    },
  );

  const tables = new Map<string, string[][]>();
  ranges.forEach((range) => {
    if (range.kind) {
      const rows = lines.slice(range.start + 1, range.end);
      tables.set(
        range.kind,
        rows.map((row) => row.split("\t")),
      );
    }
  });

  console.log(tables.get("User"));

  const users = tables.get("User")?.map((entry) => {
    const [id, name] = entry;
    return { google_id: id!, id: id!, username: name! };
  });

  const albums = tables.get("Album")?.map((entry) => {
    const [id, artistId, createdAt, sid, title, userId, year, release, covers] =
      entry;
    return {
      artistId: artistId!,
      covers: covers === "\\N" ? null : covers,
      createdAt: new Date(createdAt!),
      id: id!,
      release: release === "\\N" ? null : release ?? null,
      sid: sid === "\\N" ? null : sid ?? null,
      title: title!,
      userId: userId!,
      year: (year === "\\N" ? null : Number(year)) ?? null,
    };
  });

  const artists = tables.get("Artist")?.map((entry) => {
    const [id, createdAt, name, sid, userId] = entry;
    return {
      createdAt: new Date(createdAt!),
      id: id!,
      name: name!,
      sid: sid === "\\N" ? null : sid ?? null,
      userId: userId!,
    };
  });

  const reviews = tables.get("Review")?.map((entry) => {
    const [id, albumId, createdAt, rate, text, userId] = entry;
    return {
      albumId: albumId!,
      createdAt: new Date(createdAt!),
      id: id!,
      rate: Number(rate!),
      text: text!,
      userId: userId!,
    };
  });

  return { albums, artists, reviews, users };
};

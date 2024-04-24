import { Album, Artist, Review, User, db } from "astro:db";
import { loadDumpData } from "./dump";

// https://astro.build/db/seed
export default async function seed() {
  const { albums, artists, reviews, users } = await loadDumpData();

  await db
    .insert(User)
    .values(users ?? [])
    .execute();

  await db
    .insert(Artist)
    .values(artists ?? [])
    .execute();

  await db
    .insert(Album)
    .values(albums ?? [])
    .execute();

  await db
    .insert(Review)
    .values(reviews ?? [])
    .execute();
}

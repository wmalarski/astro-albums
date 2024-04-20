import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    userId: column.text({ references: () => User.columns.id }),
  },
});

const Artist = defineTable({
  columns: {
    createdAt: column.date({ default: NOW, name: "created_at" }),
    id: column.text({ primaryKey: true }),
    name: column.text(),
    sid: column.text({ optional: true }),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }],
});

const Album = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    artistId: column.text({
      name: "artist_id",
      references: () => Artist.columns.id,
    }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    sid: column.text({ optional: true }),
    title: column.text(),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
    year: column.number({ optional: true }),
    release: column.text({ optional: true }),
    covers: column.json({ optional: true }),
  },
  indexes: [{ on: "userId" }],
});

const Review = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    albumId: column.text({
      name: "albumId",
      references: () => Album.columns.id,
    }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    rate: column.number(),
    text: column.text(),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }],
});

const Visit = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    albumId: column.text({
      name: "album_id",
      references: () => Album.columns.id,
    }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }],
});

export default defineDb({
  tables: {
    User,
    Session,
    Artist,
    Album,
    Review,
    Visit,
  },
});

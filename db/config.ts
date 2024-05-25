import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    sub: column.text(),
    id: column.text({ primaryKey: true }),
    name: column.text(),
    picture: column.text(),
  },
  indexes: [{ on: "id" }],
});

const Session = defineTable({
  columns: {
    expiresAt: column.date(),
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
  },
  indexes: [{ on: "id" }, { on: "userId" }],
});

const Artist = defineTable({
  columns: {
    createdAt: column.date({ default: NOW, name: "created_at" }),
    id: column.text({ primaryKey: true }),
    name: column.text(),
    sid: column.text({ optional: true }),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }, { on: "id" }],
});

const Album = defineTable({
  columns: {
    artistId: column.text({
      name: "artist_id",
      references: () => Artist.columns.id,
    }),
    covers: column.json({ optional: true }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    id: column.text({ primaryKey: true }),
    release: column.text({ optional: true }),
    sid: column.text({ optional: true }),
    title: column.text(),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
    year: column.number({ optional: true }),
  },
  indexes: [{ on: "userId" }, { on: "artistId" }, { on: "id" }],
});

const Review = defineTable({
  columns: {
    albumId: column.text({
      name: "album_id",
      references: () => Album.columns.id,
    }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    id: column.text({ primaryKey: true }),
    rate: column.number(),
    text: column.text(),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }, { on: "albumId" }, { on: "id" }],
});

const Reminder = defineTable({
  columns: {
    albumId: column.text({
      name: "album_id",
      references: () => Album.columns.id,
    }),
    createdAt: column.date({ default: NOW, name: "created_at" }),
    id: column.text({ primaryKey: true }),
    userId: column.text({ name: "user_id", references: () => User.columns.id }),
  },
  indexes: [{ on: "userId" }, { on: "albumId" }, { on: "id" }],
});

export default defineDb({
  tables: {
    Album,
    Artist,
    Review,
    Session,
    User,
    Reminder,
  },
});

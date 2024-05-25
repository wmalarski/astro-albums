import { Album, db, eq, Artist, Visit } from "astro:db";

type FindRemindersArgs = {
  take: number;
  skip: number;
};

export const findReminders = ({ skip, take }: FindRemindersArgs) => {
  return db
    .select()
    .from(Visit)
    .innerJoin(Album, eq(Visit.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .limit(take)
    .offset(skip)
    .orderBy(Visit.createdAt)
    .all();
};

type CreateReminderArgs = {
  albumId: string;
  userId: string;
};

export const createReminder = ({ albumId, userId }: CreateReminderArgs) => {
  return db.insert(Visit).values({ albumId, userId }).run();
};

type DeleteReminderArgs = {
  reminderId: string;
};

export const deleteReminder = ({ reminderId }: DeleteReminderArgs) => {
  return db.delete(Visit).where(eq(Visit.id, reminderId)).run();
};

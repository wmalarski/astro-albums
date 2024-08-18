import { Album, Artist, db, eq, Reminder } from "astro:db";

type FindRemindersArgs = {
  take: number;
  skip: number;
};

export const findReminders = ({ skip, take }: FindRemindersArgs) => {
  return db
    .select()
    .from(Reminder)
    .innerJoin(Album, eq(Reminder.albumId, Album.id))
    .innerJoin(Artist, eq(Album.artistId, Artist.id))
    .limit(take)
    .offset(skip)
    .orderBy(Reminder.createdAt)
    .all();
};

type CreateReminderArgs = {
  albumId: string;
  userId: string;
};

export const createReminder = ({ albumId, userId }: CreateReminderArgs) => {
  const id = crypto.randomUUID();
  return db.insert(Reminder).values({ albumId, id, userId }).run();
};

type DeleteReminderArgs = {
  reminderId: string;
};

export const deleteReminder = ({ reminderId }: DeleteReminderArgs) => {
  return db.delete(Reminder).where(eq(Reminder.id, reminderId)).run();
};

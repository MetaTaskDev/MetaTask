import { pgTable, text, serial, integer, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 1. Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // used as email
  password: text("password").notNull(),
  name: text("name").notNull(),
  isPremium: boolean("is_premium").default(false),
  currentTrackLevel: integer("current_track_level").default(1),
  lastAssessmentDate: timestamp("last_assessment_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Tracks (Levels 1-4)
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull().unique(), // 1, 2, 3, 4
  title: text("title").notNull(),
  description: text("description").notNull(),
  objective: text("objective").notNull(),
});

// 3. Track Pillars (Health, Finance, Mind, etc.)
export const trackPillars = pgTable("track_pillars", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").notNull(), // FK to tracks
  category: text("category").notNull(),
  description: text("description").notNull(),
});

// 4. Daily Tasks (The prescriptive habits)
export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  trackPillarId: integer("track_pillar_id").notNull(), // FK to track_pillars
  title: text("title").notNull(),
  frequencyPerWeek: integer("frequency_per_week").notNull(),
  isHabit: boolean("is_habit").default(true),
});

// 5. User Progress (Daily completions)
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  completedAt: date("completed_at").defaultNow(), // YYYY-MM-DD
  status: text("status").default("completed"),
});

// 6. Assessment Answers
export const assessmentAnswers = pgTable("assessment_answers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  answers: jsonb("answers").notNull(), // Store full assessment result as JSON
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  assessments: many(assessmentAnswers),
}));

export const tracksRelations = relations(tracks, ({ many }) => ({
  pillars: many(trackPillars),
}));

export const trackPillarsRelations = relations(trackPillars, ({ one, many }) => ({
  track: one(tracks, {
    fields: [trackPillars.trackId],
    references: [tracks.id],
  }),
  tasks: many(dailyTasks),
}));

export const dailyTasksRelations = relations(dailyTasks, ({ one }) => ({
  pillar: one(trackPillars, {
    fields: [dailyTasks.trackPillarId],
    references: [trackPillars.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  task: one(dailyTasks, {
    fields: [userProgress.taskId],
    references: [dailyTasks.id],
  }),
}));

// === SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  lastAssessmentDate: true,
  currentTrackLevel: true,
  isPremium: true
});

export const insertAssessmentSchema = createInsertSchema(assessmentAnswers).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

// === TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Track = typeof tracks.$inferSelect;
export type TrackPillar = typeof trackPillars.$inferSelect;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;

export type TrackWithDetails = Track & {
  pillars: (TrackPillar & {
    tasks: DailyTask[];
  })[];
};

export type DashboardData = {
  user: User;
  currentTrack: TrackWithDetails;
  todayProgress: UserProgress[];
};

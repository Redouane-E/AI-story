import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  content: text("content").notNull(),
  svgData: text("svg_data").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStorySchema = createInsertSchema(stories).pick({
  title: true,
  prompt: true,
  content: true,
  svgData: true,
  userId: true,
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  traits: text("traits").array().notNull(),
  svgData: text("svg_data").notNull(),
  storyId: integer("story_id").notNull().references(() => stories.id),
});

export const insertCharacterSchema = createInsertSchema(characters).pick({
  name: true,
  role: true,
  description: true,
  traits: true,
  svgData: true,
  storyId: true,
});

export const generateStorySchema = z.object({
  prompt: z.string().min(10).max(1000),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof characters.$inferSelect;

export type StoryWithCharacters = Story & {
  characters: Character[];
};

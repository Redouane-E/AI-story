import { 
  users,
  stories,
  characters,
  type User, 
  type InsertUser, 
  type Story, 
  type InsertStory,
  type Character,
  type InsertCharacter
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Define a type for upsert user operations
export type UpsertUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getAllStories(): Promise<Story[]>;
  getFeaturedStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryContent(id: number, content: string): Promise<Story>;
  
  // Characters
  getCharacter(id: number): Promise<Character | undefined>;
  getCharactersByStoryId(storyId: number): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }
  
  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }
  
  async getFeaturedStories(): Promise<Story[]> {
    // Get three most recent stories
    return await db.select().from(stories).orderBy(desc(stories.createdAt)).limit(3);
  }
  
  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
    return story;
  }
  
  async updateStoryContent(id: number, content: string): Promise<Story> {
    const [story] = await db
      .update(stories)
      .set({ content })
      .where(eq(stories.id, id))
      .returning();
    return story;
  }
  
  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }
  
  async getCharactersByStoryId(storyId: number): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.storyId, storyId));
  }
  
  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(insertCharacter).returning();
    return character;
  }
}

export const storage = new DatabaseStorage();
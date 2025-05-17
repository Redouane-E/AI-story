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

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Generate a random ID for the user
    const id = Math.floor(Math.random() * 1000000).toString();
    const [user] = await db
      .insert(users)
      .values({
        id,
        email: userData.email,
        password: userData.password,
        updatedAt: new Date(),
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
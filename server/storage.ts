import { 
  users, 
  type User, 
  type InsertUser, 
  type Story, 
  type InsertStory,
  type Character,
  type InsertCharacter
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stories: Map<number, Story>;
  private characters: Map<number, Character>;
  private userIdCounter: number;
  private storyIdCounter: number;
  private characterIdCounter: number;

  constructor() {
    this.users = new Map();
    this.stories = new Map();
    this.characters = new Map();
    this.userIdCounter = 1;
    this.storyIdCounter = 1;
    this.characterIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getAllStories(): Promise<Story[]> {
    return Array.from(this.stories.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getFeaturedStories(): Promise<Story[]> {
    // In a real implementation, this might have different criteria
    // For now, just return the three most recent stories
    return Array.from(this.stories.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.storyIdCounter++;
    const story: Story = {
      ...insertStory,
      id,
      createdAt: new Date().toISOString(),
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStoryContent(id: number, content: string): Promise<Story> {
    const story = this.stories.get(id);
    if (!story) {
      throw new Error(`Story with id ${id} not found`);
    }
    
    const updatedStory = { ...story, content };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  // Character methods
  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharactersByStoryId(storyId: number): Promise<Character[]> {
    return Array.from(this.characters.values())
      .filter(character => character.storyId === storyId);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.characterIdCounter++;
    const character: Character = {
      ...insertCharacter,
      id,
    };
    this.characters.set(id, character);
    return character;
  }
}

export const storage = new MemStorage();

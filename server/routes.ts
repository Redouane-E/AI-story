import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateStorySchema, 
  type Story, 
  type Character, 
  type StoryWithCharacters 
} from "@shared/schema";
import { z } from "zod";
import { generateStory, extractCharacters } from "./openai";
import { generateSVGIllustration, generateCharacterSVG } from "./svg-generator";
import { setupAuth, isAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Generate a new story from a prompt
  app.post("/api/stories", isAuthenticated, async (req: any, res) => {
    // Get the user ID from the authenticated session
    const userId = req.user.id;
    try {
      const { prompt } = generateStorySchema.parse(req.body);
      
      // Generate story content using OpenAI
      const { title, content, characters } = await generateStory(prompt);
      
      // Generate SVG illustration for the story
      const svgData = await generateSVGIllustration(title, content, characters);
      
      // Create story in storage with the authenticated user's ID
      const story = await storage.createStory({
        title,
        prompt,
        content,
        svgData,
        userId: userId, // Link the story to the authenticated user
      });
      
      // Create character profiles
      const characterEntities: Character[] = [];
      
      for (const character of characters) {
        const characterSvg = await generateCharacterSVG(character);
        
        const savedCharacter = await storage.createCharacter({
          name: character.name,
          role: character.role,
          description: character.description,
          traits: character.traits,
          svgData: characterSvg,
          storyId: story.id,
        });
        
        characterEntities.push(savedCharacter);
      }
      
      // Return the complete story with characters
      const storyWithCharacters: StoryWithCharacters = {
        ...story,
        characters: characterEntities,
      };
      
      res.status(201).json(storyWithCharacters);
    } catch (error) {
      console.error("Error generating story:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate story" });
    }
  });
  
  // Continue an existing story
  app.post("/api/stories/:id/continue", isAuthenticated, async (req: any, res) => {
    // Get the user ID from the authenticated session
    const userId = req.user.id;
    try {
      const storyId = parseInt(req.params.id);
      const story = await storage.getStory(storyId);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      // Check if the user is the creator of the story
      if (story.userId && story.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to continue this story" });
      }
      
      // Generate continuation of the story
      const { content: continuedContent } = await generateStory(story.prompt, story.content);
      
      // Update the story content
      const updatedContent = story.content + "\n\n" + continuedContent;
      const updatedStory = await storage.updateStoryContent(storyId, updatedContent);
      
      // Get characters for the story
      const characters = await storage.getCharactersByStoryId(storyId);
      
      // Return the updated story with characters
      const storyWithCharacters: StoryWithCharacters = {
        ...updatedStory,
        characters,
      };
      
      res.status(200).json(storyWithCharacters);
    } catch (error) {
      console.error("Error continuing story:", error);
      res.status(500).json({ message: "Failed to continue story" });
    }
  });
  
  // Get all stories
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.status(200).json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });
  
  // Get a specific story by ID with its characters
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const story = await storage.getStory(storyId);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      const characters = await storage.getCharactersByStoryId(storyId);
      
      const storyWithCharacters: StoryWithCharacters = {
        ...story,
        characters,
      };
      
      res.status(200).json(storyWithCharacters);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });
  
  // Get featured/example stories
  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.status(200).json(stories);
    } catch (error) {
      console.error("Error fetching featured stories:", error);
      res.status(500).json({ message: "Failed to fetch featured stories" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type StoryCharacter = {
  name: string;
  role: string;
  description: string;
  traits: string[];
};

type StoryResponse = {
  title: string;
  content: string;
  characters: StoryCharacter[];
};

export async function generateStory(
  prompt: string,
  existingContent?: string
): Promise<StoryResponse> {
  try {
    // Define our system prompt
    let systemPrompt = `You are a creative children's storybook author who specializes in creating illustrated tales. 
    Create a short, engaging story (2-3 paragraphs) based on the user's prompt.
    Include creative, whimsical elements appropriate for children.
    The story should have interesting characters and settings.
    
    In addition to the story, identify 1-3 main characters and provide their details.
    
    Format your response as a JSON object with the following structure:
    {
      "title": "The story title",
      "content": "The story content...",
      "characters": [
        {
          "name": "Character name",
          "role": "protagonist|antagonist|supporting",
          "description": "A brief description of the character",
          "traits": ["trait1", "trait2"]
        }
      ]
    }`;

    const userPrompt = existingContent 
      ? `Continue this story: ${existingContent}\n\nMake sure the continuation flows naturally from the existing content and adds meaningful progression to the narrative.`
      : `Create a short story based on this prompt: ${prompt}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const storyData = JSON.parse(content) as StoryResponse;
    
    return {
      title: existingContent ? storyData.title || "Continued Story" : storyData.title,
      content: storyData.content,
      characters: storyData.characters || []
    };
  } catch (error) {
    console.error("Error generating story with OpenAI:", error);
    throw new Error(`Failed to generate story: ${error.message}`);
  }
}

export async function extractCharacters(
  storyContent: string
): Promise<StoryCharacter[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `Analyze the following story and extract the main characters.
          For each character, provide their name, role in the story (protagonist, antagonist, or supporting),
          a brief description, and 2-3 personality traits.
          Format your response as a JSON array.` 
        },
        { role: "user", content: storyContent }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const characterData = JSON.parse(content);
    return characterData.characters || [];
  } catch (error) {
    console.error("Error extracting characters with OpenAI:", error);
    throw new Error(`Failed to extract characters: ${error.message}`);
  }
}

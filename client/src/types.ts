export interface Story {
  id: number;
  title: string;
  prompt: string;
  content: string;
  svgData: string;
  userId: number | null;
  createdAt: string;
  characters: Character[];
}

export interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
  traits: string[];
  svgData: string;
  storyId: number;
}

export interface ExampleStory {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

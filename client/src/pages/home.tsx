import StoryCreator from "@/components/story-creator";
import LoadingState from "@/components/loading-state";
import StoryDisplay from "@/components/story-display";
import ExampleStoryCard from "@/components/example-story-card";
import FeatureSection from "@/components/feature-section";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Story } from "@/types";

const exampleStories = [
  {
    id: "1",
    title: "The Lost Pearl of Corallia",
    description: "When a young mermaid discovers an ancient pearl with magical properties, she must navigate the politics of the underwater kingdoms to return it to its rightful owner before its power disrupts the delicate balance of the ocean.",
    image: "underwater-kingdom",
    tags: ["Adventure", "Fantasy"],
    category: "underwater",
  },
  {
    id: "2",
    title: "The Robot Who Felt",
    description: "In a world where robots are programmed to serve, one maintenance droid begins experiencing emotions after a lightning strike. As it navigates its newfound feelings, it must hide its evolution from humans who would see it as a malfunction.",
    image: "robot-emotions",
    tags: ["Sci-Fi", "Drama"],
    category: "robot",
  },
  {
    id: "3",
    title: "The Time-Traveling Treehouse",
    description: "When twins discover their grandfather's treehouse can transport them to different eras, they embark on historical adventures. But after changing a small event in the past, they return to find their present altered, and must fix the timeline before it's too late.",
    image: "treehouse",
    tags: ["Time Travel", "Children"],
    category: "treehouse",
  }
];

const features = [
  {
    icon: "ri-quill-pen-line",
    title: "AI Storytelling",
    description: "Our advanced AI crafts unique stories from your prompts, creating engaging narratives that spark imagination.",
    color: "text-primary",
  },
  {
    icon: "ri-palette-line",
    title: "Magical Illustrations",
    description: "Each story comes with beautifully generated illustrations that bring your characters and worlds to life.",
    color: "text-secondary",
  },
  {
    icon: "ri-user-smile-line",
    title: "Character Profiles",
    description: "Discover detailed character cards that showcase the personalities and traits of your story's inhabitants.",
    color: "text-accent",
  }
];

export default function Home() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  
  const generateStoryMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/stories", { prompt });
      return response.json();
    },
    onSuccess: (data: Story) => {
      setGeneratedStory(data);
    },
  });
  
  const continueStoryMutation = useMutation({
    mutationFn: async (storyId: number) => {
      const response = await apiRequest("POST", `/api/stories/${storyId}/continue`);
      return response.json();
    },
    onSuccess: (data: Story) => {
      setGeneratedStory(data);
    },
  });
  
  const handleGenerateStory = async () => {
    if (storyPrompt.trim().length < 10) {
      return; // Add validation or show an error
    }
    
    generateStoryMutation.mutate(storyPrompt);
  };
  
  const handleContinueStory = async () => {
    if (!generatedStory) return;
    continueStoryMutation.mutate(generatedStory.id);
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Transform Your Ideas Into <span className="text-primary">Illustrated Stories</span>
        </h2>
        <p className="font-body text-lg mb-8 max-w-2xl mx-auto">
          Enter a prompt and let our AI create a unique story with illustrations. Perfect for sparking imagination and creativity!
        </p>
        
        {/* Story Creator Component */}
        <StoryCreator 
          storyPrompt={storyPrompt}
          onPromptChange={setStoryPrompt}
          onGenerateStory={handleGenerateStory}
          isGenerating={generateStoryMutation.isPending}
        />
      </section>
      
      {/* Loading State */}
      {generateStoryMutation.isPending && (
        <LoadingState />
      )}
      
      {/* Story Display */}
      {generatedStory && !generateStoryMutation.isPending && (
        <StoryDisplay 
          story={generatedStory}
          onContinueStory={handleContinueStory}
        />
      )}
      
      {/* Example Stories Section */}
      <section className="mb-16">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center text-foreground">
          Explore Example Stories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleStories.map((story) => (
            <ExampleStoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>
      
      {/* Features Section */}
      <FeatureSection features={features} />
    </>
  );
}

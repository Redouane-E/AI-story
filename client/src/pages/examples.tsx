import { useState } from "react";
import { useLocation } from "wouter";
import ExampleStoryCard from "@/components/example-story-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  },
  {
    id: "4",
    title: "The Dragon's Apprentice",
    description: "A young village girl becomes the reluctant apprentice to an ancient dragon who needs to pass on his knowledge before his time ends. As she learns magic beyond her wildest dreams, she uncovers a plot that threatens both humans and dragons alike.",
    image: "dragon-apprentice",
    tags: ["Fantasy", "Adventure"],
    category: "fantasy",
  },
  {
    id: "5",
    title: "Stellar Pioneers",
    description: "The first children born on Mars face unique challenges as they explore their red planet home. When communication with Earth suddenly ceases, these young explorers must use their ingenuity to solve the mystery and possibly save both worlds.",
    image: "mars-pioneers",
    tags: ["Sci-Fi", "Adventure"],
    category: "space",
  },
  {
    id: "6",
    title: "The Clockwork Bird",
    description: "In a steampunk Victorian London, a lonely watchmaker creates a mechanical bird that comes to life. As the bird develops consciousness and yearns for freedom, the watchmaker must decide whether to keep his creation or let it find its own path.",
    image: "clockwork-bird",
    tags: ["Steampunk", "Drama"],
    category: "steampunk",
  }
];

const categories = [
  { value: "all", label: "All Stories" },
  { value: "fantasy", label: "Fantasy" },
  { value: "space", label: "Space" },
  { value: "underwater", label: "Underwater" },
  { value: "steampunk", label: "Steampunk" },
];

export default function Examples() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredStories = activeCategory === "all" 
    ? exampleStories 
    : exampleStories.filter(story => story.category === activeCategory || story.tags.includes(activeCategory));
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Example Stories</h1>
        <Button onClick={() => setLocation('/')}>Create Your Own</Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
        <TabsList className="mb-6">
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.value} value={category.value} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map(story => (
                <ExampleStoryCard key={story.id} story={story} />
              ))}
            </div>
            
            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No stories found in this category</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Want to create your own unique story?</p>
        <Button onClick={() => setLocation('/')}>Create a Story Now</Button>
      </div>
    </div>
  );
}

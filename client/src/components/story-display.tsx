import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CharacterCard from "@/components/character-card";
import SVGIllustration from "@/components/svg-illustration";
import { type Story } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface StoryDisplayProps {
  story: Story;
  onContinueStory: () => void;
  isLoading?: boolean;
}

export default function StoryDisplay({ 
  story, 
  onContinueStory,
  isLoading = false
}: StoryDisplayProps) {
  const { toast } = useToast();
  
  const copyStory = () => {
    const textToCopy = `${story.title}\n\n${story.content}`;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Your story has been copied to the clipboard!",
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy story to clipboard",
          variant: "destructive",
        });
      }
    );
  };
  
  const shareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this story: ${story.title}`,
          url: window.location.href,
        });
      } catch (err) {
        toast({
          title: "Share failed",
          description: "Could not share the story",
          variant: "destructive",
        });
      }
    } else {
      copyStory();
      toast({
        title: "Link copied",
        description: "Story link copied to clipboard for sharing!",
      });
    }
  };
  
  return (
    <section className="mb-16 animate-page-turn">
      <Card className="relative bg-white rounded-xl shadow-xl p-6 md:p-10 page-curl overflow-hidden mb-8">
        {/* Story Title */}
        <h3 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">{story.title}</h3>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyStory}
            className="p-2 text-gray-500 hover:text-primary transition-colors rounded"
            title="Copy story"
          >
            <i className="ri-file-copy-line text-xl"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={shareStory}
            className="p-2 text-gray-500 hover:text-primary transition-colors rounded"
            title="Share story"
          >
            <i className="ri-share-line text-xl"></i>
          </Button>
        </div>
        
        {/* Story Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl aspect-[16/9] rounded-lg overflow-hidden shadow-md">
            <SVGIllustration svgData={story.svgData} />
          </div>
        </div>
        
        {/* Story Content */}
        <div className="prose max-w-none mb-8">
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="font-body text-lg leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Continue Reading Button */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={onContinueStory}
            className="inline-flex items-center font-semibold text-secondary hover:text-primary transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Continuing..." : "Continue the story"}
            <i className="ri-arrow-right-line ml-1"></i>
          </Button>
        </div>
      </Card>
      
      {/* Character Cards */}
      {story.characters && story.characters.length > 0 && (
        <>
          <h4 className="font-heading text-2xl font-bold mb-4 text-foreground text-center">Character Profiles</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {story.characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

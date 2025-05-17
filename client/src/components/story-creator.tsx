import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface StoryCreatorProps {
  storyPrompt: string;
  onPromptChange: (value: string) => void;
  onGenerateStory: () => void;
  isGenerating: boolean;
}

export default function StoryCreator({
  storyPrompt,
  onPromptChange,
  onGenerateStory,
  isGenerating,
}: StoryCreatorProps) {
  return (
    <Card className="bg-white rounded-xl shadow-lg p-6 mb-12 page-curl">
      <CardContent className="p-0">
        <div className="mb-4">
          <Label htmlFor="storyPrompt" className="block text-left mb-2 font-body font-semibold text-foreground">
            Start your story
          </Label>
          <Textarea
            id="storyPrompt"
            placeholder="Once upon a time in a magical forest..."
            className="w-full rounded-lg border-2 border-gray-200 p-3 font-body focus:border-secondary transition-colors"
            rows={3}
            value={storyPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center"
            onClick={onGenerateStory}
            disabled={isGenerating || storyPrompt.trim().length < 10}
          >
            <i className="ri-magic-line mr-2"></i>
            Create Story
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

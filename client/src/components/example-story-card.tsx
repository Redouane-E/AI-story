import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { type ExampleStory } from "@/types";

interface ExampleStoryCardProps {
  story: ExampleStory;
}

export default function ExampleStoryCard({ story }: ExampleStoryCardProps) {
  const [, setLocation] = useLocation();
  
  const handleCardClick = () => {
    // In a real implementation, this would navigate to the story or load it
    // For now, just navigate to home page
    setLocation('/');
  };
  
  // Generate a pattern SVG based on the story category
  const generateCategoryPattern = (category: string) => {
    switch (category) {
      case 'underwater':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="underwater-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 5 Q 15 10, 10 15 Q 5 10, 10 5" fill="#4ECDC4" fillOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#underwater-pattern)" />
          </svg>
        );
      case 'robot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="robot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="10" fill="#2C3E50" fillOpacity="0.1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#robot-pattern)" />
          </svg>
        );
      case 'treehouse':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="treehouse-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="#4ECDC4" fillOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#treehouse-pattern)" />
          </svg>
        );
      case 'fantasy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="fantasy-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15 5 L20 15 L15 25 L10 15 Z" fill="#FFE66D" fillOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#fantasy-pattern)" />
          </svg>
        );
      case 'space':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="space-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="white" fillOpacity="0.4" />
              <circle cx="15" cy="15" r="1" fill="white" fillOpacity="0.4" />
              <circle cx="25" cy="5" r="1" fill="white" fillOpacity="0.4" />
            </pattern>
            <rect width="100%" height="100%" fill="#2C3E50" fillOpacity="0.9" />
            <rect width="100%" height="100%" fill="url(#space-pattern)" />
          </svg>
        );
      case 'steampunk':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute inset-0">
            <pattern id="steampunk-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="10" stroke="#FF6B6B" strokeWidth="1" fill="none" opacity="0.2" />
              <circle cx="15" cy="15" r="5" stroke="#FF6B6B" strokeWidth="1" fill="none" opacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#steampunk-pattern)" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card 
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer page-curl"
      onClick={handleCardClick}
    >
      <div className="h-48 overflow-hidden relative">
        {generateCategoryPattern(story.category)}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold bg-black bg-opacity-30 px-4 py-2 rounded-lg">{story.category}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">{story.title}</h3>
        <p className="font-body text-gray-600 text-sm gradient-mask h-16">{story.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, index) => {
              const bgColorClass = index % 2 === 0 
                ? 'bg-accent bg-opacity-20' 
                : 'bg-secondary bg-opacity-20';
              
              return (
                <span 
                  key={index} 
                  className={`text-xs px-2 py-1 ${bgColorClass} rounded-full`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <span className="font-accent text-primary">Read</span>
        </div>
      </CardContent>
    </Card>
  );
}

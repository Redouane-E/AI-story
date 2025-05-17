import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import StoryDisplay from "@/components/story-display";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Story } from "@/types";

export default function StoryPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  // Fetch story details
  const { data: story, isLoading, error, refetch } = useQuery({
    queryKey: [`/api/stories/${id}`],
  });
  
  const continueStoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/stories/${id}/continue`);
      return response.json();
    },
    onSuccess: (data: Story) => {
      // Refresh the story data without full page reload
      refetch();
    },
  });
  
  const handleContinueStory = async () => {
    continueStoryMutation.mutate();
  };
  
  const handleGoBack = () => {
    setLocation("/");
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error || !story) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Oops! Story Not Found</h2>
        <p className="mb-6">We couldn't find the story you're looking for.</p>
        <Button onClick={handleGoBack}>Go Back Home</Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={handleGoBack} className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Button>
      </div>
      
      <StoryDisplay 
        story={story} 
        onContinueStory={handleContinueStory} 
        isLoading={continueStoryMutation.isPending}
      />
    </div>
  );
}

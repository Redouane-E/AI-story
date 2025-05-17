import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CharacterCard from "@/components/character-card";
import SVGIllustration from "@/components/svg-illustration";
import { type Story } from "@/types";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  const storyContentRef = useRef<HTMLDivElement>(null);
  
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
  
  const exportToPDF = async () => {
    if (!storyContentRef.current) return;
    
    try {
      toast({
        title: "Preparing PDF",
        description: "Creating your PDF, please wait...",
      });
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Capture story content as canvas
      const canvas = await html2canvas(storyContentRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
      });
      
      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate dimensions to fit on PDF
      const imgWidth = 210; // A4 width in mm (210mm)
      const pageHeight = 297; // A4 height in mm (297mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add image to first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${story.title.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: "PDF created",
        description: "Your story has been exported as a PDF!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Export failed",
        description: "Failed to create PDF. Please try again.",
        variant: "destructive",
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={exportToPDF}
            className="p-2 text-gray-500 hover:text-primary transition-colors rounded"
            title="Export as PDF"
          >
            <i className="ri-file-pdf-line text-xl"></i>
          </Button>
        </div>
        
        {/* Story Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl aspect-[16/9] rounded-lg overflow-hidden shadow-md">
            <SVGIllustration svgData={story.svgData} />
          </div>
        </div>
        
        {/* Story Content */}
        <div ref={storyContentRef} className="prose max-w-none mb-8">
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

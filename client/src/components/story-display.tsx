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
    try {
      toast({
        title: "Preparing PDF",
        description: "Creating your PDF, please wait...",
      });
      
      // Create a new PDF document with more appropriate margins
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Set document properties
      pdf.setProperties({
        title: story.title,
        subject: 'AI Generated Story',
        creator: 'Story Generator App'
      });
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(33, 33, 33);
      const titleWidth = pdf.getStringUnitWidth(story.title) * 24 / pdf.internal.scaleFactor;
      const titleX = (pdf.internal.pageSize.width - titleWidth) / 2;
      pdf.text(story.title, titleX > 0 ? titleX : 15, 20);
      
      // Add horizontal line
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.5);
      pdf.line(15, 25, 195, 25);
      
      // Process the SVG data to add illustration
      if (story.svgData) {
        try {
          // Convert SVG to Base64 image
          const svgContainer = document.createElement('div');
          svgContainer.innerHTML = story.svgData;
          const svgElement = svgContainer.querySelector('svg');
          
          if (svgElement) {
            // Set fixed dimensions for the SVG
            svgElement.setAttribute('width', '800');
            svgElement.setAttribute('height', '450');
            
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            
            // Create a canvas element to draw the SVG
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 450;
            const ctx = canvas.getContext('2d');
            
            // Create image from SVG
            const img = new Image();
            img.onload = () => {
              if (ctx) {
                ctx.drawImage(img, 0, 0, 800, 450);
                const imgData = canvas.toDataURL('image/png', 1.0);
                
                // Calculate image dimensions for PDF
                const imgWidth = 180; // slightly less than A4 width with margins
                const imgHeight = (450 * imgWidth) / 800;
                
                // Add image to PDF centered
                pdf.addImage(
                  imgData, 
                  'PNG', 
                  (210 - imgWidth) / 2, // center horizontally
                  35, // position below title
                  imgWidth, 
                  imgHeight
                );
                
                // Add story content
                addStoryContent(imgHeight + 45); // Start text below image
              }
            };
            
            // Set the image source to SVG blob URL
            img.src = URL.createObjectURL(svgBlob);
          } else {
            // If SVG element is not found, still add content without image
            addStoryContent(35);
          }
        } catch (svgError) {
          console.error("Error processing SVG:", svgError);
          // Continue with text only if SVG fails
          addStoryContent(35);
        }
      } else {
        // No SVG data, just add content
        addStoryContent(35);
      }
      
      function addStoryContent(startY) {
        // Set font for content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(51, 51, 51);
        
        // Split content into paragraphs and add to PDF
        const paragraphs = story.content.split('\n\n');
        let currentY = startY;
        
        paragraphs.forEach((paragraph) => {
          // Split paragraph into lines that fit within the page width
          const textLines = pdf.splitTextToSize(paragraph, 170); // 170mm width with margins
          
          // Check if content will overflow the page
          if (currentY + (textLines.length * 7) > 280) { // 280mm is close to A4 height with margins
            pdf.addPage();
            currentY = 20; // Reset Y position on new page
          }
          
          // Add each line of text
          pdf.text(textLines, 20, currentY);
          currentY += textLines.length * 7 + 7; // Add paragraph spacing
        });
        
        // Add character information if available
        if (story.characters && story.characters.length > 0) {
          // Check if we need a new page for characters
          if (currentY > 240) {
            pdf.addPage();
            currentY = 20;
          }
          
          // Add character section title
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(18);
          pdf.text('Character Profiles', 20, currentY);
          currentY += 10;
          
          // Add each character
          story.characters.forEach((character) => {
            // Check if we need a new page
            if (currentY > 260) {
              pdf.addPage();
              currentY = 20;
            }
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.text(`${character.name} - ${character.role}`, 20, currentY);
            currentY += 7;
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            const descLines = pdf.splitTextToSize(character.description, 170);
            pdf.text(descLines, 20, currentY);
            currentY += descLines.length * 6 + 5;
            
            if (character.traits && character.traits.length > 0) {
              pdf.setFont('helvetica', 'italic');
              pdf.text(`Traits: ${character.traits.join(', ')}`, 20, currentY);
              currentY += 10;
            }
          });
        }
        
        // Save the PDF after content is added
        pdf.save(`${story.title.replace(/\s+/g, '_')}.pdf`);
        
        toast({
          title: "PDF created",
          description: "Your story has been exported as a PDF!",
        });
      }
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

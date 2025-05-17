interface SVGIllustrationProps {
  svgData: string;
}

export default function SVGIllustration({ svgData }: SVGIllustrationProps) {
  // This component safely renders the SVG data from the server
  return (
    <div 
      className="w-full h-full"
      dangerouslySetInnerHTML={{ __html: svgData }}
    />
  );
}

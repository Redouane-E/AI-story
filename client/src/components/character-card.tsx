import { Card } from "@/components/ui/card";
import { type Character } from "@/types";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  // Get appropriate color based on character role
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'protagonist':
        return 'text-secondary';
      case 'antagonist':
        return 'text-primary';
      case 'supporting':
      default:
        return 'text-accent';
    }
  };
  
  const roleColor = getRoleColor(character.role);
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: character.svgData }} className="w-full h-full" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="font-heading text-xl font-bold text-foreground">{character.name}</h5>
          <span className={`font-accent ${roleColor}`}>{character.role}</span>
        </div>
        <p className="font-body text-sm text-gray-600 mb-2">{character.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {character.traits.map((trait, index) => {
            // Alternate between accent and secondary background colors
            const bgColorClass = index % 2 === 0 
              ? 'bg-accent bg-opacity-30' 
              : 'bg-secondary bg-opacity-30';
            
            return (
              <span 
                key={index} 
                className={`px-2 py-1 ${bgColorClass} rounded-full text-foreground`}
              >
                {trait}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

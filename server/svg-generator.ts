type CharacterInfo = {
  name: string;
  role: string;
  description: string;
  traits: string[];
};

// Helper to generate a random color from our palette
function getRandomPaletteColor(): string {
  const colors = [
    '#FF6B6B', // primary/coral
    '#4ECDC4', // secondary/teal
    '#FFE66D', // accent/yellow
    '#F7F9FC', // background/soft white
    '#2C3E50', // text/navy
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper to get a color based on character role
function getRoleColor(role: string): string {
  switch (role.toLowerCase()) {
    case 'protagonist':
      return '#4ECDC4'; // secondary/teal
    case 'antagonist':
      return '#FF6B6B'; // primary/coral
    case 'supporting':
    default:
      return '#FFE66D'; // accent/yellow
  }
}

// Generate a basic background for the illustration
function generateBackground(): string {
  // Create a gradient background
  return `
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F7F9FC" />
        <stop offset="100%" stop-color="#E2E8F0" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg-gradient)" />
    
    <!-- Add some decorative elements in the background -->
    ${Array.from({ length: 20 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 0.5 + Math.random() * 3;
      const opacity = 0.1 + Math.random() * 0.3;
      const color = getRandomPaletteColor();
      
      return `<circle cx="${x}%" cy="${y}%" r="${size}" fill="${color}" opacity="${opacity}" />`;
    }).join('')}
  `;
}

// Generate elements representing a landscape or setting
function generateScenery(storyContent: string): string {
  // Default scenery with some generic elements
  const hasForest = storyContent.toLowerCase().includes('forest');
  const hasOcean = storyContent.toLowerCase().includes('ocean') || storyContent.toLowerCase().includes('sea');
  const hasMountain = storyContent.toLowerCase().includes('mountain');
  const hasCity = storyContent.toLowerCase().includes('city') || storyContent.toLowerCase().includes('village');
  const hasCastle = storyContent.toLowerCase().includes('castle');
  
  let scenery = '';
  
  // Base ground
  scenery += `<rect x="0" y="75%" width="100%" height="25%" fill="#4ECDC4" opacity="0.2" />`;
  
  // Add mountains if mentioned
  if (hasMountain) {
    scenery += `
      <polygon points="0,75% 15%,40% 30%,65% 45%,35% 60%,75%" fill="#2C3E50" opacity="0.7" />
      <polygon points="60%,75% 75%,45% 90%,55% 100%,65% 100%,75%" fill="#2C3E50" opacity="0.5" />
    `;
  }
  
  // Add forest elements if mentioned
  if (hasForest) {
    for (let i = 0; i < 10; i++) {
      const x = 10 + (i * 8);
      const y = 70;
      const size = 10 + Math.random() * 5;
      
      scenery += `
        <circle cx="${x}%" cy="${y}%" r="${size}" fill="#4ECDC4" opacity="0.8" />
        <rect x="${x - 1}%" y="${y}%" width="2%" height="5%" fill="#2C3E50" opacity="0.8" />
      `;
    }
  }
  
  // Add ocean if mentioned
  if (hasOcean) {
    scenery += `
      <rect x="0" y="70%" width="100%" height="30%" fill="#4ECDC4" opacity="0.6" />
      <!-- Waves -->
      ${Array.from({ length: 8 }, (_, i) => {
        return `
          <path d="M${i * 15},75% Q${i * 15 + 7.5},70% ${i * 15 + 15},75%" stroke="white" fill="none" stroke-width="1" opacity="0.5" />
        `;
      }).join('')}
    `;
  }
  
  // Add city/village if mentioned
  if (hasCity) {
    for (let i = 0; i < 7; i++) {
      const x = 20 + (i * 10);
      const height = 10 + Math.random() * 15;
      const width = 5 + Math.random() * 3;
      
      scenery += `
        <rect x="${x}%" y="${75 - height}%" width="${width}%" height="${height}%" fill="#2C3E50" opacity="0.7" />
        <!-- Windows -->
        ${Array.from({ length: 3 }, (_, j) => {
          return `
            <rect x="${x + 1}%" y="${75 - height + 2 + (j * 5)}%" width="1.5%" height="2%" fill="#FFE66D" opacity="0.8" />
          `;
        }).join('')}
      `;
    }
  }
  
  // Add castle if mentioned
  if (hasCastle) {
    scenery += `
      <rect x="40%" y="45%" width="20%" height="30%" fill="#2C3E50" opacity="0.8" />
      <rect x="38%" y="42%" width="24%" height="3%" fill="#2C3E50" opacity="0.8" />
      <rect x="43%" y="35%" width="4%" height="10%" fill="#2C3E50" opacity="0.8" />
      <rect x="53%" y="35%" width="4%" height="10%" fill="#2C3E50" opacity="0.8" />
      <!-- Castle detail -->
      <rect x="48%" y="55%" width="4%" height="7%" fill="#F7F9FC" opacity="0.9" />
      <rect x="42%" y="50%" width="3%" height="3%" fill="#FFE66D" opacity="0.7" />
      <rect x="55%" y="50%" width="3%" height="3%" fill="#FFE66D" opacity="0.7" />
    `;
  }
  
  return scenery;
}

// Generate a character representation based on role and description
function generateCharacterElement(character: CharacterInfo, position: number, totalCharacters: number): string {
  const spacing = 100 / (totalCharacters + 1);
  const xPos = spacing * (position + 1);
  const roleColor = getRoleColor(character.role);
  
  // Character head
  const head = `
    <circle cx="${xPos}%" cy="60%" r="8" fill="${roleColor}" />
  `;
  
  // Character body
  const body = `
    <rect x="${xPos - 5}%" y="68%" width="10%" height="12%" fill="${roleColor}" opacity="0.8" />
  `;
  
  // Character limbs
  const limbs = `
    <line x1="${xPos - 5}%" y1="72%" x2="${xPos - 10}%" y2="75%" stroke="${roleColor}" stroke-width="2" />
    <line x1="${xPos + 5}%" y1="72%" x2="${xPos + 10}%" y2="75%" stroke="${roleColor}" stroke-width="2" />
    <line x1="${xPos - 2}%" y1="80%" x2="${xPos - 2}%" y2="90%" stroke="${roleColor}" stroke-width="2" />
    <line x1="${xPos + 2}%" y1="80%" x2="${xPos + 2}%" y2="90%" stroke="${roleColor}" stroke-width="2" />
  `;
  
  // Character facial features
  const face = `
    <circle cx="${xPos - 2}%" cy="58%" r="1" fill="#2C3E50" />
    <circle cx="${xPos + 2}%" cy="58%" r="1" fill="#2C3E50" />
    <path d="M${xPos - 2}%,62% Q${xPos}%,64% ${xPos + 2}%,62%" stroke="#2C3E50" fill="none" stroke-width="1" />
  `;
  
  // Character name label
  const label = `
    <text x="${xPos}%" y="95%" text-anchor="middle" font-family="Arial" font-size="4" fill="#2C3E50">${character.name}</text>
  `;
  
  return `
    <g class="character">
      ${head}
      ${body}
      ${limbs}
      ${face}
      ${label}
    </g>
  `;
}

// Main function to generate an SVG illustration for a story
export async function generateSVGIllustration(
  title: string,
  storyContent: string,
  characters: CharacterInfo[]
): Promise<string> {
  // Create the SVG container
  const svgStart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">`;
  const svgEnd = `</svg>`;
  
  // Generate the background
  const background = generateBackground();
  
  // Generate the scenery based on the story content
  const scenery = generateScenery(storyContent);
  
  // Generate character elements
  const characterElements = characters
    .slice(0, 3) // Limit to 3 characters max
    .map((character, index, array) => 
      generateCharacterElement(character, index, array.length)
    )
    .join('');
  
  // Put it all together
  return `
    ${svgStart}
    ${background}
    ${scenery}
    ${characterElements}
    ${svgEnd}
  `.trim();
}

// Generate an SVG for a character card
export async function generateCharacterSVG(character: CharacterInfo): Promise<string> {
  const roleColor = getRoleColor(character.role);
  
  // Create the SVG container
  const svgStart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">`;
  const svgEnd = `</svg>`;
  
  // Generate a simple background
  const background = `
    <rect width="100%" height="100%" fill="#F7F9FC" />
    <!-- Decorative elements -->
    ${Array.from({ length: 10 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1 + Math.random() * 3;
      const opacity = 0.1 + Math.random() * 0.2;
      
      return `<circle cx="${x}%" cy="${y}%" r="${size}" fill="${roleColor}" opacity="${opacity}" />`;
    }).join('')}
  `;
  
  // Character avatar (more detailed than in the scene)
  const characterAvatar = `
    <!-- Head -->
    <circle cx="50%" cy="40%" r="50" fill="${roleColor}" />
    
    <!-- Eyes -->
    <circle cx="40%" cy="35%" r="5" fill="#F7F9FC" />
    <circle cx="60%" cy="35%" r="5" fill="#F7F9FC" />
    <circle cx="40%" cy="35%" r="2.5" fill="#2C3E50" />
    <circle cx="60%" cy="35%" r="2.5" fill="#2C3E50" />
    
    <!-- Mouth -->
    <path d="M40%,50% Q50%,60% 60%,50%" stroke="#2C3E50" stroke-width="3" fill="none" />
    
    <!-- Body -->
    <rect x="35%" y="65%" width="30%" height="50" rx="10" fill="${roleColor}" opacity="0.8" />
    
    <!-- Arms -->
    <line x1="35%" y1="70%" x2="20%" y2="80%" stroke="${roleColor}" stroke-width="10" stroke-linecap="round" />
    <line x1="65%" y1="70%" x2="80%" y2="80%" stroke="${roleColor}" stroke-width="10" stroke-linecap="round" />
    
    <!-- Traits circles -->
    ${character.traits.slice(0, 3).map((trait, i) => {
      const angle = (i * Math.PI / 4) + (Math.PI / 4);
      const x = 50 + 35 * Math.cos(angle);
      const y = 40 + 35 * Math.sin(angle);
      return `
        <circle cx="${x}%" cy="${y}%" r="10" fill="#FFE66D" opacity="0.8" />
      `;
    }).join('')}
  `;
  
  return `
    ${svgStart}
    ${background}
    ${characterAvatar}
    ${svgEnd}
  `.trim();
}

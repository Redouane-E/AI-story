export default function LoadingState() {
  return (
    <section className="text-center py-20">
      <div className="mb-8 relative">
        <div className="w-64 h-64 mx-auto rounded-lg shadow-lg animate-float bg-white flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Book shape */}
            <rect x="10" y="10" width="80" height="80" rx="2" fill="#4ECDC4" />
            <rect x="15" y="15" width="70" height="70" rx="1" fill="white" />
            
            {/* Page lines */}
            <line x1="25" y1="30" x2="75" y2="30" stroke="#EAEAEA" strokeWidth="2" />
            <line x1="25" y1="40" x2="75" y2="40" stroke="#EAEAEA" strokeWidth="2" />
            <line x1="25" y1="50" x2="75" y2="50" stroke="#EAEAEA" strokeWidth="2" />
            <line x1="25" y1="60" x2="60" y2="60" stroke="#EAEAEA" strokeWidth="2" />
            
            {/* Book spine */}
            <rect x="10" y="10" width="5" height="80" fill="#FF6B6B" />
            
            {/* Magic sparkles */}
            <circle className="animate-pulse" cx="80" cy="20" r="3" fill="#FFE66D" />
            <circle className="animate-pulse" cx="75" cy="30" r="2" fill="#FFE66D" />
            <circle className="animate-pulse" cx="85" cy="25" r="2" fill="#FFE66D" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      <h3 className="font-heading text-2xl font-bold mb-2 text-foreground">Creating Your Magical Story</h3>
      <p className="font-body text-gray-600 mb-4">Our storytelling gnomes are hard at work</p>
      <div className="flex justify-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-secondary loading-dot"></div>
        <div className="w-3 h-3 rounded-full bg-accent loading-dot"></div>
      </div>
    </section>
  );
}

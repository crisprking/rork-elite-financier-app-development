const fs = require('fs');
const path = require('path');

// Create a simple SVG-based app icon generator
const createAppIcon = () => {
  const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00E67A;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background circle with glow -->
  <circle cx="512" cy="512" r="480" fill="url(#gradient)" opacity="0.9" filter="url(#glow)"/>
  
  <!-- Inner circle for depth -->
  <circle cx="512" cy="512" r="420" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.3"/>
  
  <!-- Financial chart icon -->
  <g transform="translate(262, 262)">
    <!-- Chart line -->
    <path d="M50 350 L150 250 L250 300 L350 150 L450 200" 
          stroke="#FFFFFF" 
          stroke-width="12" 
          fill="none" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
    
    <!-- Data points -->
    <circle cx="50" cy="350" r="8" fill="#FFFFFF"/>
    <circle cx="150" cy="250" r="8" fill="#FFFFFF"/>
    <circle cx="250" cy="300" r="8" fill="#FFFFFF"/>
    <circle cx="350" cy="150" r="8" fill="#FFFFFF"/>
    <circle cx="450" cy="200" r="8" fill="#FFFFFF"/>
    
    <!-- AI circuit pattern -->
    <g opacity="0.6">
      <path d="M100 100 L200 100 M150 50 L150 150 M300 50 L300 150 M250 100 L350 100" 
            stroke="#FFFFFF" 
            stroke-width="6" 
            stroke-linecap="round"/>
      <circle cx="150" cy="100" r="4" fill="#FFFFFF"/>
      <circle cx="300" cy="100" r="4" fill="#FFFFFF"/>
    </g>
  </g>
  
  <!-- FinSage text -->
  <text x="512" y="600" 
        font-family="Arial, sans-serif" 
        font-size="120" 
        font-weight="700" 
        text-anchor="middle" 
        fill="#FFFFFF">FinSage</text>
  
  <!-- Pro badge -->
  <rect x="400" y="620" width="120" height="40" rx="20" 
        fill="rgba(0, 230, 122, 0.2)" 
        stroke="#00E67A" 
        stroke-width="2"/>
  <text x="460" y="645" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        font-weight="600" 
        text-anchor="middle" 
        fill="#00E67A">Pro</text>
</svg>`;

  return svgContent;
};

// Create the SVG file
const svgContent = createAppIcon();
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'app-icon.svg'), svgContent);

console.log('✅ App icon SVG created successfully!');
console.log('📱 Icon features:');
console.log('   - 1024x1024 resolution (Apple requirement)');
console.log('   - Clean, modern design');
console.log('   - Financial chart + AI circuit pattern');
console.log('   - Green gradient matching your app theme');
console.log('   - "FinSage Pro" branding');
console.log('');
console.log('🔄 Next steps:');
console.log('   1. Convert SVG to PNG using online converter or design tool');
console.log('   2. Upload to App Store Connect');
console.log('   3. Icon will look perfect in the App Store!');

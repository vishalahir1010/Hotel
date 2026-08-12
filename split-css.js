const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const stylesDir = path.join(srcDir, 'styles');
const indexCssPath = path.join(srcDir, 'index.css');

if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir, { recursive: true });
}

let cssContent = fs.readFileSync(indexCssPath, 'utf8');

// 1. Update Color Palette to Midnight Blue & Platinum
cssContent = cssContent.replace(/--bg-dark:\s*#09090b;/g, '--bg-dark: #0B101E;');
cssContent = cssContent.replace(/--bg-surface:\s*#111113;/g, '--bg-surface: #111827;');
cssContent = cssContent.replace(/--bg-card:\s*#18181b;/g, '--bg-card: #1F2937;');
cssContent = cssContent.replace(/--bg-card-elevated:\s*#242427;/g, '--bg-card-elevated: #374151;');

cssContent = cssContent.replace(/--gold-primary:\s*#c5a880;/g, '--accent-primary: #93C5FD;'); // Light Blue/Platinum
cssContent = cssContent.replace(/--gold-accent:\s*#d4af37;/g, '--accent-accent: #60A5FA;');
cssContent = cssContent.replace(/--gold-light:\s*#f3e5d0;/g, '--accent-light: #DBEAFE;');
cssContent = cssContent.replace(/--gold-dark:\s*#8e734d;/g, '--accent-dark: #3B82F6;');

// Replace other generic gold variables
cssContent = cssContent.replace(/--gold-/g, '--accent-');
cssContent = cssContent.replace(/gold-text/g, 'accent-text');
cssContent = cssContent.replace(/gold-button/g, 'accent-button');
cssContent = cssContent.replace(/gold-glow/g, 'accent-glow');
cssContent = cssContent.replace(/shadow-gold/g, 'shadow-accent');
cssContent = cssContent.replace(/rgba\(197,\s*168,\s*128,/g, 'rgba(147, 197, 253,');
cssContent = cssContent.replace(/#c5a880/g, '#93C5FD');

// Define sections and target files
const sections = [
  { marker: '/* CSS Design System', file: 'main.css' },
  { marker: '/* Root overwrite */', file: 'main.css' },
  { marker: '/* Header & Navbar */', file: 'Navbar.css' },
  { marker: '/* Hero Section */', file: 'Hero.css' },
  { marker: '/* Floating Search Bar */', file: 'Hero.css' }, // keep in hero
  { marker: '/* About / Brand Story Section */', file: 'About.css' },
  { marker: '/* Rooms Grid Section */', file: 'Rooms.css' },
  { marker: '/* Experiences / Amenities Section */', file: 'Amenities.css' },
  { marker: '/* Testimonials / Reviews Section */', file: 'Testimonials.css' },
  { marker: '/* FAQ Accordion Section */', file: 'FAQ.css' },
  { marker: '/* Newsletter & Club Section */', file: 'Footer.css' },
  { marker: '/* Booking Modal / Sidebar Checkout Drawer */', file: 'Booking.css' },
  { marker: '/* Booking Wizard Steps */', file: 'Booking.css' },
  { marker: '/* Step 1: Customize Addons */', file: 'Booking.css' },
  { marker: '/* Booking Summary Card */', file: 'Booking.css' },
  { marker: '/* Step 2: Checkout Form & Card */', file: 'Booking.css' },
  { marker: '/* Simulated Credit Card */', file: 'Booking.css' },
  { marker: '/* Step 3: Confirmation Ticket */', file: 'Booking.css' },
  { marker: '/* Ticket Side Cutouts */', file: 'Booking.css' },
  { marker: '/* Premium Entry Loader */', file: 'PremiumLoader.css' },
  { marker: '/* Footer Section */', file: 'Footer.css' },
  { marker: '/* Responsive Breakpoints */', file: 'responsive.css' }
];

// Helper to extract code blocks between sections
const extractedFiles = {};
let currentFile = 'main.css'; // default starting file

const lines = cssContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if line matches a new section marker
  const matchingSection = sections.find(s => line.startsWith(s.marker));
  if (matchingSection) {
    currentFile = matchingSection.file;
  }
  
  if (!extractedFiles[currentFile]) {
    extractedFiles[currentFile] = [];
  }
  extractedFiles[currentFile].push(line);
}

// Write the files
for (const [filename, contentLines] of Object.entries(extractedFiles)) {
  fs.writeFileSync(path.join(stylesDir, filename), contentLines.join('\n'));
  console.log(`Created ${filename}`);
}

console.log('Successfully split index.css and applied new color palette.');

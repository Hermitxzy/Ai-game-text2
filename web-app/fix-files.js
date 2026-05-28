
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToFix = [
  'src/components/Navbar.tsx',
  'src/components/CodeBlock.tsx',
  'src/pages/Home.tsx',
  'src/pages/SyntaxGuide.tsx',
  'src/pages/Examples.tsx',
  'src/pages/Assistant.tsx',
  'src/store/appStore.ts',
  'src/data/stKnowledge.ts',
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    console.log(`Processing: ${filePath}`);
    
    content = content.replace(/&amp;/g, '&');
    content = content.replace(/&lt;/g, '<');
    content = content.replace(/&gt;/g, '>');
    content = content.replace(/&quot;/g, '"');
    content = content.replace(/&#39;/g, "'");
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('\nAll files processed!');

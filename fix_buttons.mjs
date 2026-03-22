import fs from 'fs';
import path from 'path';

const pagesDir = 'frontend/src/pages';
const legalPages = ['terms.tsx', 'privacy.tsx', 'cookies.tsx', 'refund.tsx'];

for (const page of legalPages) {
    const file = path.join(pagesDir, page);
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');

    // Move to left
    content = content.replace(/right-4/g, 'left-4');
    content = content.replace(/right-6/g, 'left-6');
    content = content.replace(/right-8/g, 'left-8');
    
    // While I'm at it, fix the purple/amber button backgrounds
    content = content.replace(/bg-amber-500/g, 'bg-primary');
    content = content.replace(/bg-purple-600/g, 'bg-primary');

    fs.writeFileSync(file, content);
}
console.log("Moved buttons to left");

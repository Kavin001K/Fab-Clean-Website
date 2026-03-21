import fs from 'fs';
import path from 'path';

const pagesDir = 'frontend/src/pages';
const legalPages = ['terms.tsx', 'privacy.tsx', 'cookies.tsx', 'refund.tsx'];

for (const page of legalPages) {
    const file = path.join(pagesDir, page);
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');

    // Replace stray colors
    content = content.replace(/text-(emerald|blue|amber|purple)-(100|200)/g, 'text-muted-foreground');
    content = content.replace(/border-(emerald|blue|amber|purple)-200/g, 'border-primary/20');
    content = content.replace(/bg-(emerald|blue|amber|purple)-200/g, 'bg-primary/20');

    // Replace <a href=...> with <Link href=...> (but keep target="_blank" and mailto as <a>)
    // Actually, only replace internal paths: /terms, /privacy, /refund, /cookies, /
    content = content.replace(/<a href="\/(terms|privacy|refund|cookies|)"/g, '<Link href="/$1"');
    content = content.replace(/<\/a>/g, (match, offset, string) => {
        // Need to be careful here, only replace if it's the closing tag of a Link.
        // It's safer to just import Link from wouter at top, and manually replace the specific lines if needed, or:
        return match; 
    });

    if (!content.includes('import { Link } from "wouter";')) {
        content = `import { Link } from "wouter";\n` + content;
    }

    // A simpler regex for <a href="/something">...</a> to <Link href="/something">...</Link>
    // Just find all <a href="/..." and their closing </a>
    content = content.replace(/<a href="(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, '<Link href="$1"$2>$3</Link>');
    
    fs.writeFileSync(file, content);
}
console.log("Fixed stray colors and updated a tags to Links");

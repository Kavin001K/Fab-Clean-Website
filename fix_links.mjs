import fs from 'fs';
import path from 'path';

const pagesDir = 'frontend/src/pages';
const legalPages = ['terms.tsx', 'privacy.tsx', 'cookies.tsx', 'refund.tsx'];

for (const page of legalPages) {
    const file = path.join(pagesDir, page);
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');

    // To be safe, let's just reverse the previous broken replace:
    // If a block has <Link href="/terms" ...> ... </a>
    // We can replace all </a> that follow a <Link ...> with </Link>
    // A robust way:
    content = content.replace(/<Link ([^>]+)>([\s\S]*?)<\/a>/g, '<Link $1>$2</Link>');
    
    fs.writeFileSync(file, content);
}
console.log("Fixed JSX closing tags");

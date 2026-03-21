import fs from 'fs';
import path from 'path';

const pagesDir = 'frontend/src/pages';
const legalPages = ['terms.tsx', 'privacy.tsx', 'cookies.tsx', 'refund.tsx'];

for (const page of legalPages) {
    const file = path.join(pagesDir, page);
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');

    // Add AppLayout import if missing
    if (!content.includes('AppLayout')) {
        content = `import { AppLayout } from "@/components/layout";\nimport { SectionHeading } from "@/components/ui";\n` + content;
    }

    // Replace outer div with AppLayout
    content = content.replace(/<div className="min-h-screen[^>]*>/, '<AppLayout>\n            <div className="pt-32 pb-20 container-wide">');
    // Replace the last </div> with </AppLayout>
    content = content.replace(/<\/div>\n    \);\n}/, '</div>\n        </AppLayout>\n    );\n}');

    // Remove custom header
    content = content.replace(/<header[\s\S]*?<\/header>/g, '');

    // Remove custom footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/g, '');

    // Remove back to top
    content = content.replace(/\{showBackToTop[\s\S]*?<\/button>\n            \}/g, '');

    // Transform colors globally
    const colorMap = {
        'bg-white/95': 'bg-card/95',
        'bg-white': 'bg-card',
        'bg-slate-50': 'bg-background',
        'bg-slate-100': 'bg-muted/50',
        'bg-slate-200': 'bg-muted',
        'border-slate-200': 'border-border/10',
        'text-slate-800': 'text-foreground',
        'text-slate-700': 'text-foreground/80',
        'text-slate-600': 'text-muted-foreground',
        'text-slate-500': 'text-muted-foreground/50',
        'text-slate-400': 'text-muted-foreground/40',
        'prose-slate': 'prose-invert text-muted-foreground',
        
        // Theme specific colored backgrounds to primary
        'bg-emerald-50': 'bg-primary/5',
        'bg-emerald-100': 'bg-primary/10',
        'bg-emerald-600': 'bg-primary',
        'text-emerald-700': 'text-primary',
        'text-emerald-600': 'text-primary/90',
        'hover:bg-emerald-50': 'hover:bg-primary/10',

        'bg-blue-50': 'bg-primary/5',
        'bg-blue-100': 'bg-primary/10',
        'bg-blue-600': 'bg-primary',
        'text-blue-700': 'text-primary',
        'text-blue-600': 'text-primary/90',

        'bg-amber-50': 'bg-primary/5',
        'bg-amber-100': 'bg-primary/10',
        'bg-amber-600': 'bg-primary',
        'text-amber-700': 'text-primary',
        
        'bg-purple-50': 'bg-primary/5',
        'text-purple-600': 'text-primary',

        'bg-gradient-to-b from-slate-50 to-white': 'bg-background',
        'bg-gradient-to-r from-emerald-600 to-teal-600': 'bg-transparent',
        'bg-gradient-to-r from-blue-600 to-indigo-600': 'bg-transparent',
        'bg-gradient-to-r from-amber-500 to-orange-600': 'bg-transparent',
        'bg-gradient-to-r from-purple-600 to-indigo-600': 'bg-transparent',
        'text-white': 'text-foreground',
        'text-emerald-100': 'text-muted-foreground',
        'text-blue-100': 'text-muted-foreground',
        'bg-emerald-300': 'bg-primary',
        'bg-blue-300': 'bg-primary',
        'bg-amber-300': 'bg-primary',
    };

    for (const [find, replace] of Object.entries(colorMap)) {
        // Regex to replace class names safely
        const regex = new RegExp(`\\b${find}\\b`, 'g');
        content = content.replace(regex, replace);
    }
    
    // Replace the ugly <img src="/assets/logo.webp"> with empty or primary colored icon
    content = content.replace(/<img src="\/assets\/logo\.webp"/g, '<img src={`${import.meta.env.BASE_URL}logo.webp`} className="brightness-0 invert"');

    // Force all standard links to use primary color on hover instead of specific colors
    content = content.replace(/hover:text-(emerald|blue|amber|purple)-600/g, 'hover:text-primary');
    content = content.replace(/hover:bg-(emerald|blue|amber|purple)-50/g, 'hover:bg-primary/10');

    // For the hero section which now has no background, adjust the text colors which were set to white/blue-100
    // We already replaced text-white to text-foreground above.

    fs.writeFileSync(file, content);
}
console.log("Restyled all legal pages successfully.");

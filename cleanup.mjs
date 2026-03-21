import fs from 'fs';
import path from 'path';

const uiDir = 'frontend/src/components/ui';
const srcDir = 'frontend/src';

const getAllFiles = (dir, ext) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file, ext));
    } else if (file.endsWith(ext)) {
      results.push(file);
    }
  });
  return results;
};

const uiFiles = getAllFiles(uiDir, '.tsx');
const allSrcFiles = getAllFiles(srcDir, '.tsx').concat(getAllFiles(srcDir, '.ts'));

const importedIn = (componentName, fileContents) => {
  return fileContents.some(content => content.includes(componentName));
};

const allContents = allSrcFiles.map(f => fs.readFileSync(f, 'utf8'));

let deleted = 0;
// We skip specific files that export multiple, or check by filename
const keep = ['ui.tsx', 'LaundryText.tsx', 'LiquidText.tsx', 'FoamEffect.tsx', 'toaster.tsx', 'toast.tsx'];

for (const file of uiFiles) {
  const basename = path.basename(file);
  if (keep.includes(basename)) continue;
  
  // The component name is usually the filename without extension, camel or pascal cased
  // A safer check is if the precise filename (without tsx) is imported
  const importName = basename.replace('.tsx', '');
  
  // check if `import ... from "@/components/ui/${importName}"` or similar exists
  const isUsed = allContents.some(content => 
    content.includes(`ui/${importName}'`) || 
    content.includes(`ui/${importName}"`) ||
    content.includes(`ui/${importName}`)
  );
  
  if (!isUsed) {
    console.log("Deleting unused component:", file);
    fs.unlinkSync(file);
    deleted++;
  }
}
console.log(`Deleted ${deleted} unused UI components.`);

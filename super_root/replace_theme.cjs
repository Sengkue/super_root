const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-slate-900(?![/])/g, replace: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /bg-slate-800(?![/])/g, replace: 'bg-white dark:bg-slate-800' },
  { regex: /bg-slate-700(?![/])/g, replace: 'bg-slate-100 dark:bg-slate-700' },
  { regex: /bg-slate-600(?![/])/g, replace: 'bg-slate-200 dark:bg-slate-600' },
  { regex: /bg-black/g, replace: 'bg-white dark:bg-black' },
  // Text
  { regex: /text-white/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /text-slate-50(?![/])/g, replace: 'text-slate-900 dark:text-slate-50' },
  { regex: /text-slate-200(?![/])/g, replace: 'text-slate-800 dark:text-slate-200' },
  { regex: /text-slate-300(?![/])/g, replace: 'text-slate-700 dark:text-slate-300' },
  { regex: /text-slate-400(?![/])/g, replace: 'text-slate-600 dark:text-slate-400' },
  { regex: /text-slate-500(?![/])/g, replace: 'text-slate-500 dark:text-slate-400' },
  // Borders
  { regex: /border-slate-800(?![/])/g, replace: 'border-slate-200 dark:border-slate-800' },
  { regex: /border-slate-700(?![/])/g, replace: 'border-slate-300 dark:border-slate-700' },
  { regex: /border-slate-600(?![/])/g, replace: 'border-slate-400 dark:border-slate-600' },
  // Hover Backgrounds
  { regex: /hover:bg-slate-800(?![/])/g, replace: 'hover:bg-slate-100 dark:hover:bg-slate-800' },
  { regex: /hover:bg-slate-700(?![/])/g, replace: 'hover:bg-slate-200 dark:hover:bg-slate-700' },
  { regex: /hover:bg-slate-600(?![/])/g, replace: 'hover:bg-slate-300 dark:hover:bg-slate-600' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.vue')) {
      results.push(file);
    }
  });
  return results;
}

const vueFiles = walk(path.join(__dirname, 'app'));

let changedCount = 0;

for (const file of vueFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const r of replacements) {
    if (r.regex.test(content)) {
      content = content.replace(r.regex, r.replace);
      changed = true;
    }
  }

  // De-duplicate if already matched (e.g. if we run the script twice or overlap)
  // Simple fix for overlapping dark:bg-white dark:bg-slate-900 (not perfect, but okay for one run)

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log(`Updated ${path.relative(__dirname, file)}`);
  }
}

console.log(`Updated ${changedCount} files.`);

const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '..', 'public', 'events');
const manifestPath = path.join(eventsDir, 'manifest.json');

// Category names that map to their JSON files
const CATEGORY_FILES = [
  'conflict',
  'cultural',
  'diplomatic',
  'disasters',
  'exploration',
  'infrastructure'
];

function generateManifest() {
  const categories = [];

  for (const categoryName of CATEGORY_FILES) {
    const fileName = `${categoryName}.json`;
    const filePath = path.join(eventsDir, fileName);

    if (fs.existsSync(filePath)) {
      categories.push({
        name: categoryName,
        files: [fileName]
      });
    }
  }

  const manifest = { categories };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  const totalFiles = categories.reduce((sum, cat) => sum + cat.files.length, 0);
  console.log(`Generated manifest.json: ${categories.length} categories, ${totalFiles} files`);
}

generateManifest();

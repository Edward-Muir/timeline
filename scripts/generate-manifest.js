const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '..', 'public', 'events');
const manifestPath = path.join(eventsDir, 'manifest.json');

function generateManifest() {
  const categories = [];

  // Get all subdirectories in the events folder
  const entries = fs.readdirSync(eventsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(eventsDir, entry.name);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.json'))
        .sort();

      if (files.length > 0) {
        categories.push({
          name: entry.name,
          files: files
        });
      }
    }
  }

  // Sort categories alphabetically
  categories.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = { categories };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  const totalFiles = categories.reduce((sum, cat) => sum + cat.files.length, 0);
  console.log(`Generated manifest.json: ${categories.length} categories, ${totalFiles} files`);
}

generateManifest();

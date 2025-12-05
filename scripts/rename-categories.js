const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '../public/events');

// Category renaming map
const categoryRenames = {
  'conflict-politics': 'conflict',
  'disasters-crises': 'disasters',
  'exploration-discovery': 'exploration',
  'cultural-social': 'cultural',
  'infrastructure-construction': 'infrastructure',
  'diplomatic-institutional': 'diplomatic'
};

// File renaming map
const fileRenames = {
  'conflict-politics.json': 'conflict.json',
  'disasters-crises.json': 'disasters.json',
  'exploration-discovery.json': 'exploration.json',
  'cultural-social.json': 'cultural.json',
  'infrastructure-construction.json': 'infrastructure.json',
  'diplomatic-institutional.json': 'diplomatic.json'
};

async function renameCategories() {
  console.log('Starting category rename migration...\n');

  // 1. Update category field in each event JSON file and rename files
  for (const [oldFile, newFile] of Object.entries(fileRenames)) {
    const oldPath = path.join(eventsDir, oldFile);
    const newPath = path.join(eventsDir, newFile);

    if (fs.existsSync(oldPath)) {
      // Read the file
      const content = JSON.parse(fs.readFileSync(oldPath, 'utf8'));

      // Update category field in each event
      const updatedContent = content.map(event => ({
        ...event,
        category: categoryRenames[event.category] || event.category
      }));

      // Write to new filename
      fs.writeFileSync(newPath, JSON.stringify(updatedContent, null, 2));
      console.log(`✓ Updated and renamed: ${oldFile} → ${newFile}`);

      // Delete old file
      fs.unlinkSync(oldPath);
    } else {
      console.log(`⚠ File not found: ${oldFile}`);
    }
  }

  // 2. Update manifest.json
  const manifestPath = path.join(eventsDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    manifest.categories = manifest.categories.map(cat => ({
      name: categoryRenames[cat.name] || cat.name,
      files: cat.files.map(file => fileRenames[file] || file)
    }));

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\n✓ Updated manifest.json');
  }

  console.log('\nMigration complete!');
}

renameCategories().catch(console.error);

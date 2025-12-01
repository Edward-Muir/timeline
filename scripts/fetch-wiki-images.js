#!/usr/bin/env node

/**
 * Script to fetch Wikipedia thumbnail images for historical events
 * and update the event JSON files with image_url fields.
 *
 * Usage: node scripts/fetch-wiki-images.js
 */

const fs = require('fs');
const path = require('path');

const EVENTS_DIR = path.join(__dirname, '../public/events');
const RATE_LIMIT_MS = 100; // Delay between API calls to avoid rate limiting

// Wikipedia search terms that may help find better images
const SEARCH_OVERRIDES = {
  'wwi-start': 'World War I',
  'wwi-end': 'Armistice of 11 November 1918',
  'wwii-start': 'Invasion of Poland',
  'wwii-end': 'Victory over Japan Day',
  'pearl-harbor': 'Attack on Pearl Harbor',
  'd-day': 'Normandy landings',
  'hiroshima': 'Atomic bombings of Hiroshima and Nagasaki',
  'civil-war-start': 'Battle of Fort Sumter',
  'vietnam-end': 'Fall of Saigon',
  'september-11': 'September 11 attacks',
  'cuban-missile': 'Cuban Missile Crisis',
  'rome-falls': 'Fall of the Western Roman Empire',
  'constantinople-falls': 'Fall of Constantinople',
  'genghis-khan': 'Genghis Khan',
  'alexander-empire': 'Alexander the Great',
  'norman-conquest': 'Battle of Hastings',
  'first-crusade': 'First Crusade',
  'waterloo': 'Battle of Waterloo',
  'moon-landing': 'Apollo 11',
  'titanic': 'Sinking of the Titanic',
  'chernobyl': 'Chernobyl disaster',
  'black-death': 'Black Death',
  'spanish-flu': 'Spanish flu',
  'pompeii': 'Eruption of Mount Vesuvius in 79 AD',
  'krakatoa': '1883 eruption of Krakatoa',
  'tunguska': 'Tunguska event',
  'hindenburg': 'Hindenburg disaster',
  'challenger': 'Space Shuttle Challenger disaster',
  'eiffel-tower': 'Eiffel Tower',
  'statue-liberty': 'Statue of Liberty',
  'great-wall': 'Great Wall of China',
  'panama-canal': 'Panama Canal',
  'golden-gate': 'Golden Gate Bridge',
  'empire-state': 'Empire State Building',
  'sydney-opera': 'Sydney Opera House',
  'transcontinental-railroad': 'First Transcontinental Railroad',
  'printing-press': 'Printing press',
  'internet-birth': 'ARPANET',
  'wright-brothers': 'Wright brothers',
  'telephone-invention': 'Invention of the telephone',
  'electricity-grid': 'War of the currents',
  'first-photograph': 'View from the Window at Le Gras',
  'dna-structure': 'Molecular structure of nucleic acids',
  'penicillin': 'Penicillin',
  'columbus-america': 'Voyages of Christopher Columbus',
  'magellan-circumnavigation': 'Magellan expedition',
  'south-pole': 'Amundsen-Scott South Pole Station',
  'north-pole': 'Robert Peary',
  'moon-landing': 'Apollo 11',
  'mars-rover': 'Curiosity (rover)',
  'hubble-telescope': 'Hubble Space Telescope',
  'iss-assembly': 'International Space Station',
  'first-satellite': 'Sputnik 1',
  'first-spacewalk': 'Voskhod 2',
  'voyager-launch': 'Voyager program',
  'mona-lisa': 'Mona Lisa',
  'sistine-chapel': 'Sistine Chapel ceiling',
  'beethoven-ninth': 'Symphony No. 9 (Beethoven)',
  'shakespeare-hamlet': 'Hamlet',
  'gutenberg-bible': 'Gutenberg Bible',
  'king-tut-tomb': 'KV62',
  'rosetta-stone': 'Rosetta Stone',
  'declaration-independence': 'United States Declaration of Independence',
  'magna-carta': 'Magna Carta',
  'berlin-wall-fall': 'Fall of the Berlin Wall',
  'french-revolution': 'French Revolution',
  'russian-revolution': 'Russian Revolution',
  'industrial-revolution': 'Industrial Revolution',
  'civil-rights-act': 'Civil Rights Act of 1964',
  'womens-suffrage': "Women's suffrage in the United States",
  'abolition-slavery': 'Thirteenth Amendment to the United States Constitution',
  'first-olympics': '1896 Summer Olympics',
  'first-world-cup': '1930 FIFA World Cup',
  'treaty-versailles': 'Treaty of Versailles',
  'un-founding': 'United Nations',
  'eu-formation': 'European Union',
  'nato-founding': 'NATO',
  'bretton-woods': 'Bretton Woods system',
  'geneva-convention': 'Geneva Conventions',
  'peace-westphalia': 'Peace of Westphalia',
  'treaty-rome': 'Treaty of Rome'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate multiple search term variations from a friendly name
 * to increase chances of finding a Wikipedia article with an image
 */
function generateSearchVariations(friendlyName) {
  const variations = [friendlyName];

  // Remove common suffixes like "Begins", "Ends", "Discovered", "Invented", etc.
  const suffixPatterns = [
    / Begins$/i,
    / Ends$/i,
    / Starts$/i,
    / Started$/i,
    / Ended$/i,
    / Discovered$/i,
    / Invented$/i,
    / Founded$/i,
    / Established$/i,
    / Completed$/i,
    / Signed$/i,
    / Announced$/i,
    / Launched$/i,
    / Opens$/i,
    / Opened$/i,
    / Created$/i,
    / Built$/i,
    / Published$/i,
    / Released$/i,
    / Debuts$/i,
    / Premiered$/i,
    / Succeeds$/i,
    / Fails$/i,
    / Collapses$/i,
    / Dissolves$/i,
    / Assassinated$/i,
    / Executed$/i,
    / Killed$/i,
    / Dies$/i,
    / Born$/i,
    / Elected$/i,
    / Crowned$/i,
    / Takes Power$/i,
    / Becomes .+$/i,
  ];

  for (const pattern of suffixPatterns) {
    if (pattern.test(friendlyName)) {
      const simplified = friendlyName.replace(pattern, '').trim();
      if (simplified && !variations.includes(simplified)) {
        variations.push(simplified);
      }
    }
  }

  // Remove common prefixes
  const prefixPatterns = [
    /^First /i,
    /^The /i,
    /^Discovery of /i,
    /^Invention of /i,
    /^Construction of /i,
    /^Opening of /i,
    /^Launch of /i,
    /^Start of /i,
    /^End of /i,
    /^Fall of /i,
    /^Rise of /i,
    /^Battle of /i,
    /^Siege of /i,
    /^Treaty of /i,
    /^Attack on /i,
  ];

  for (const pattern of prefixPatterns) {
    if (pattern.test(friendlyName)) {
      const simplified = friendlyName.replace(pattern, '').trim();
      if (simplified && !variations.includes(simplified)) {
        variations.push(simplified);
      }
    }
  }

  // Try extracting key nouns (remove articles, prepositions, etc.)
  // e.g., "Higgs Boson Discovered" -> "Higgs Boson", "Higgs boson"
  const words = friendlyName.split(' ');
  if (words.length >= 2) {
    // Try first two words (often the main subject)
    const firstTwo = words.slice(0, 2).join(' ');
    if (!variations.includes(firstTwo)) {
      variations.push(firstTwo);
    }

    // Try with lowercase second word (Wikipedia article style)
    const firstTwoLower = words[0] + ' ' + words.slice(1, 2).join(' ').toLowerCase();
    if (!variations.includes(firstTwoLower) && firstTwoLower !== firstTwo) {
      variations.push(firstTwoLower);
    }
  }

  // Add lowercase version of main subject for scientific terms
  // e.g., "Higgs Boson" -> "Higgs boson"
  const lowercaseVariation = friendlyName.split(' ').map((word, i) =>
    i === 0 ? word : word.toLowerCase()
  ).join(' ');
  if (!variations.includes(lowercaseVariation)) {
    variations.push(lowercaseVariation);
  }

  return variations;
}

/**
 * Try to fetch a Wikipedia image using multiple search strategies
 */
async function tryFetchImage(searchTerm) {
  const encodedTitle = encodeURIComponent(searchTerm);

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch (error) {
    return null;
  }
}

async function fetchWikipediaImage(eventName, friendlyName) {
  // If there's a manual override, use it first
  if (SEARCH_OVERRIDES[eventName]) {
    const imageUrl = await tryFetchImage(SEARCH_OVERRIDES[eventName]);
    if (imageUrl) {
      console.log(`  [OK] Found image for "${friendlyName}" (via override: "${SEARCH_OVERRIDES[eventName]}")`);
      return imageUrl;
    }
    await sleep(RATE_LIMIT_MS);
  }

  // Generate and try multiple search variations
  const variations = generateSearchVariations(friendlyName);

  for (const searchTerm of variations) {
    const imageUrl = await tryFetchImage(searchTerm);

    if (imageUrl) {
      const note = searchTerm !== friendlyName ? ` (via: "${searchTerm}")` : '';
      console.log(`  [OK] Found image for "${friendlyName}"${note}`);
      return imageUrl;
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log(`  [SKIP] No image found for "${friendlyName}" after trying ${variations.length} variations`);
  return null;
}

async function processJsonFile(filePath) {
  console.log(`\nProcessing: ${path.basename(filePath)}`);

  const content = fs.readFileSync(filePath, 'utf8');
  const events = JSON.parse(content);

  let updated = false;

  for (const event of events) {
    // Skip if already has an image_url
    if (event.image_url) {
      console.log(`  [CACHED] "${event.friendly_name}" already has image`);
      continue;
    }

    const imageUrl = await fetchWikipediaImage(event.name, event.friendly_name);

    if (imageUrl) {
      event.image_url = imageUrl;
      updated = true;
    }

    // Rate limiting
    await sleep(RATE_LIMIT_MS);
  }

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2) + '\n');
    console.log(`  [SAVED] Updated ${path.basename(filePath)}`);
  }

  return events.length;
}

async function findJsonFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await findJsonFiles(fullPath));
    } else if (entry.name.endsWith('.json') && entry.name !== 'manifest.json') {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('='.repeat(60));
  console.log('Wikipedia Image Fetcher for Timeline Events');
  console.log('='.repeat(60));

  const jsonFiles = await findJsonFiles(EVENTS_DIR);
  console.log(`Found ${jsonFiles.length} event files to process`);

  let totalEvents = 0;

  for (const file of jsonFiles) {
    const count = await processJsonFile(file);
    totalEvents += count;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Done! Processed ${totalEvents} events across ${jsonFiles.length} files`);
  console.log('='.repeat(60));
}

main().catch(console.error);

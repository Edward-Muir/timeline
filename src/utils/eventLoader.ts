import { HistoricalEvent, EventManifest } from '../types';

/**
 * Loads all historical events from JSON files in the public/events directory.
 * Reads the manifest to find all category folders and JSON files,
 * then combines them into a single deduplicated array.
 */
export async function loadAllEvents(): Promise<HistoricalEvent[]> {
  try {
    // Load the manifest
    const manifestResponse = await fetch('/events/manifest.json');
    if (!manifestResponse.ok) {
      throw new Error('Failed to load events manifest');
    }
    const manifest: EventManifest = await manifestResponse.json();

    // Load all events from all files
    const allEvents: HistoricalEvent[] = [];

    for (const category of manifest.categories) {
      for (const file of category.files) {
        try {
          const response = await fetch(`/events/${file}`);
          if (response.ok) {
            const events: HistoricalEvent[] = await response.json();
            allEvents.push(...events);
          } else {
            console.warn(`Failed to load ${file}`);
          }
        } catch (error) {
          console.warn(`Error loading ${file}:`, error);
        }
      }
    }

    // Deduplicate by name (unique identifier)
    const deduplicatedEvents = deduplicateEvents(allEvents);

    console.log(`Loaded ${deduplicatedEvents.length} unique events from ${manifest.categories.length} categories`);

    return deduplicatedEvents;
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
}

/**
 * Removes duplicate events based on their name (unique identifier).
 * Keeps the first occurrence of each event.
 */
function deduplicateEvents(events: HistoricalEvent[]): HistoricalEvent[] {
  const seen = new Set<string>();
  const unique: HistoricalEvent[] = [];

  for (const event of events) {
    if (!seen.has(event.name)) {
      seen.add(event.name);
      unique.push(event);
    } else {
      console.warn(`Duplicate event found: ${event.name}`);
    }
  }

  return unique;
}

/**
 * Validates that an event has all required fields.
 */
export function isValidEvent(event: unknown): event is HistoricalEvent {
  if (typeof event !== 'object' || event === null) return false;

  const e = event as Record<string, unknown>;

  return (
    typeof e.name === 'string' &&
    typeof e.friendly_name === 'string' &&
    typeof e.year === 'number' &&
    typeof e.category === 'string' &&
    typeof e.description === 'string' &&
    typeof e.difficulty === 'string' &&
    ['easy', 'medium', 'hard'].includes(e.difficulty as string) &&
    [
      'conflict',
      'disasters',
      'exploration',
      'cultural',
      'infrastructure',
      'diplomatic',
    ].includes(e.category as string)
  );
}

/**
 * Filter events by difficulty
 */
export function filterByDifficulty(
  events: HistoricalEvent[],
  difficulties: ('easy' | 'medium' | 'hard')[]
): HistoricalEvent[] {
  return events.filter((e) => difficulties.includes(e.difficulty));
}

/**
 * Filter events by category
 */
export function filterByCategory(
  events: HistoricalEvent[],
  categories: string[]
): HistoricalEvent[] {
  return events.filter((e) => categories.includes(e.category));
}

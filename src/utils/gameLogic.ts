import { HistoricalEvent, Player, GameState, GameConfig, DropPosition, Category } from '../types';

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Sort events by year
export function sortByYear(events: HistoricalEvent[]): HistoricalEvent[] {
  return [...events].sort((a, b) => a.year - b.year);
}

// Initialize a new game with provided events
export function initializeGame(config: GameConfig, allEvents: HistoricalEvent[]): GameState {
  const shuffledEvents = shuffleArray(allEvents);

  // Take events for the starting timeline
  const timelineEvents = sortByYear(shuffledEvents.slice(0, config.startingTimelineEvents));

  // Remaining events go to the deck
  const remainingEvents = shuffledEvents.slice(config.startingTimelineEvents);

  // Deal cards to players
  const players: Player[] = [];
  let deckIndex = 0;

  for (let i = 0; i < config.playerCount; i++) {
    const hand: HistoricalEvent[] = [];
    for (let j = 0; j < config.cardsPerPlayer; j++) {
      if (deckIndex < remainingEvents.length) {
        hand.push(remainingEvents[deckIndex]);
        deckIndex++;
      }
    }
    players.push({
      id: i,
      name: config.playerNames[i] || `Player ${i + 1}`,
      hand,
      hasWon: false,
    });
  }

  // Remaining cards form the deck
  const deck = remainingEvents.slice(deckIndex);

  return {
    phase: 'playing',
    timeline: timelineEvents,
    deck,
    players,
    currentPlayerIndex: 0,
    turnNumber: 1,
    roundNumber: 1,
    winners: [],
    lastPlacementResult: null,
  };
}

// Check if placement is correct
export function isPlacementCorrect(
  timeline: HistoricalEvent[],
  event: HistoricalEvent,
  dropPosition: DropPosition
): boolean {
  const { leftEvent, rightEvent } = dropPosition;

  // Check left bound (event must be >= left event's year)
  if (leftEvent && event.year < leftEvent.year) {
    return false;
  }

  // Check right bound (event must be <= right event's year)
  if (rightEvent && event.year > rightEvent.year) {
    return false;
  }

  return true;
}

// Insert event into timeline at correct position
export function insertIntoTimeline(
  timeline: HistoricalEvent[],
  event: HistoricalEvent,
  dropIndex: number
): HistoricalEvent[] {
  const newTimeline = [...timeline];
  newTimeline.splice(dropIndex, 0, event);
  return newTimeline;
}

// Draw a card from the deck
export function drawCard(deck: HistoricalEvent[]): { card: HistoricalEvent | null; newDeck: HistoricalEvent[] } {
  if (deck.length === 0) {
    return { card: null, newDeck: [] };
  }
  const [card, ...newDeck] = deck;
  return { card, newDeck };
}

// Remove a card from player's hand
export function removeFromHand(hand: HistoricalEvent[], eventName: string): HistoricalEvent[] {
  return hand.filter((e) => e.name !== eventName);
}

// Add a card to player's hand
export function addToHand(hand: HistoricalEvent[], event: HistoricalEvent): HistoricalEvent[] {
  return [...hand, event];
}

// Get drop positions for the timeline
export function getDropPositions(timeline: HistoricalEvent[]): DropPosition[] {
  const positions: DropPosition[] = [];

  // Position before first card
  positions.push({
    index: 0,
    leftEvent: null,
    rightEvent: timeline[0] || null,
  });

  // Positions between cards
  for (let i = 0; i < timeline.length; i++) {
    positions.push({
      index: i + 1,
      leftEvent: timeline[i],
      rightEvent: timeline[i + 1] || null,
    });
  }

  return positions;
}

// Format year for display
export function formatYear(year: number): string {
  if (year < 0) {
    const absYear = Math.abs(year);
    if (absYear >= 1000000000) {
      return `${(absYear / 1000000000).toFixed(1)} billion BCE`;
    }
    if (absYear >= 1000000) {
      return `${(absYear / 1000000).toFixed(0)} million BCE`;
    }
    if (absYear >= 1000) {
      return `${absYear.toLocaleString()} BCE`;
    }
    return `${absYear} BCE`;
  }
  return `${year} CE`;
}

// Get next player index
export function getNextPlayerIndex(currentIndex: number, playerCount: number): number {
  return (currentIndex + 1) % playerCount;
}

// Check if the game should end
export function shouldGameEnd(state: GameState): boolean {
  // Game ends when we have at least one winner and all players have had equal turns
  if (state.winners.length === 0) {
    return false;
  }

  // Check if current player is the first player (completed a full round)
  // and we have at least one winner
  return state.currentPlayerIndex === 0 && state.winners.length > 0;
}

// Category color mapping
const categoryColors: Record<Category, { bg: string; border: string }> = {
  'conflict-politics': { bg: 'bg-red-600', border: 'border-red-700' },
  'disasters-crises': { bg: 'bg-gray-700', border: 'border-gray-800' },
  'exploration-discovery': { bg: 'bg-teal-600', border: 'border-teal-700' },
  'cultural-social': { bg: 'bg-purple-600', border: 'border-purple-700' },
  'infrastructure-construction': { bg: 'bg-amber-600', border: 'border-amber-700' },
  'diplomatic-institutional': { bg: 'bg-blue-600', border: 'border-blue-700' },
};

// Get category color class
export function getCategoryColorClass(category: Category): string {
  return categoryColors[category]?.bg || 'bg-gray-500';
}

// Get category border color class
export function getCategoryBorderColorClass(category: Category): string {
  return categoryColors[category]?.border || 'border-gray-600';
}

// Get category display name
export function getCategoryDisplayName(category: Category): string {
  const names: Record<Category, string> = {
    'conflict-politics': 'Conflict & Politics',
    'disasters-crises': 'Disasters & Crises',
    'exploration-discovery': 'Exploration & Discovery',
    'cultural-social': 'Cultural & Social',
    'infrastructure-construction': 'Infrastructure & Construction',
    'diplomatic-institutional': 'Diplomatic & Institutional',
  };
  return names[category] || category;
}

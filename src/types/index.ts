export type Category =
  | 'conflict-politics'
  | 'disasters-crises'
  | 'exploration-discovery'
  | 'cultural-social'
  | 'infrastructure-construction'
  | 'diplomatic-institutional';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface HistoricalEvent {
  name: string;           // Internal ID (e.g., "wwi-end")
  friendly_name: string;  // Display name (e.g., "World War I Ends")
  year: number;
  category: Category;
  description: string;
  difficulty: Difficulty;
}

export interface Player {
  id: number;
  name: string;
  hand: HistoricalEvent[];
  hasWon: boolean;
  winTurn?: number;
}

export type GamePhase = 'setup' | 'playing' | 'gameOver';

export interface GameState {
  phase: GamePhase;
  timeline: HistoricalEvent[];
  deck: HistoricalEvent[];
  players: Player[];
  currentPlayerIndex: number;
  turnNumber: number;
  roundNumber: number;
  winners: Player[];
  lastPlacementResult: PlacementResult | null;
}

export interface GameConfig {
  playerCount: number;
  cardsPerPlayer: number;
  startingTimelineEvents: number;
  playerNames: string[];
}

export interface PlacementResult {
  success: boolean;
  event: HistoricalEvent;
  correctPosition?: number;
}

export interface DropPosition {
  index: number;
  leftEvent: HistoricalEvent | null;
  rightEvent: HistoricalEvent | null;
}

export interface EventManifest {
  categories: {
    name: Category;
    files: string[];
  }[];
}

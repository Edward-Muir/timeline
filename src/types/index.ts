export type Category =
  | 'conflict'
  | 'disasters'
  | 'exploration'
  | 'cultural'
  | 'infrastructure'
  | 'diplomatic';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Era = 'prehistory' | 'ancient' | 'medieval' | 'earlyModern' | 'industrial' | 'worldWars' | 'coldWar' | 'modern';

export interface EraDefinition {
  id: Era;
  name: string;       // Display name with year range
  startYear: number;  // Inclusive (negative for BCE)
  endYear: number;    // Inclusive
}

export interface HistoricalEvent {
  name: string;           // Internal ID (e.g., "wwi-end")
  friendly_name: string;  // Display name (e.g., "World War I Ends")
  year: number;
  category: Category;
  description: string;
  difficulty: Difficulty;
  image_url?: string;     // Optional Wikipedia thumbnail URL
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
  selectedDifficulties: Difficulty[];
  selectedCategories: Category[];
  selectedEras: Era[];
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

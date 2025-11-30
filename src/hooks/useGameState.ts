import { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { GameState, GameConfig, HistoricalEvent, DropPosition, PlacementResult } from '../types';
import {
  initializeGame,
  isPlacementCorrect,
  insertIntoTimeline,
  drawCard,
  removeFromHand,
  addToHand,
  getNextPlayerIndex,
  shouldGameEnd,
} from '../utils/gameLogic';
import { loadAllEvents } from '../utils/eventLoader';

interface UseGameStateReturn {
  gameState: GameState | null;
  allEvents: HistoricalEvent[];
  isLoading: boolean;
  loadError: string | null;
  startGame: (config: GameConfig) => void;
  placeCard: (event: HistoricalEvent, position: DropPosition) => PlacementResult;
  reorderHand: (oldIndex: number, newIndex: number) => void;
  resetGame: () => void;
  restartGame: () => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedCard: HistoricalEvent | null;
  setDraggedCard: (card: HistoricalEvent | null) => void;
  revealingCard: HistoricalEvent | null;
  clearReveal: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [allEvents, setAllEvents] = useState<HistoricalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCard, setDraggedCard] = useState<HistoricalEvent | null>(null);
  const [revealingCard, setRevealingCard] = useState<HistoricalEvent | null>(null);
  const [lastConfig, setLastConfig] = useState<GameConfig | null>(null);

  // Load events on mount
  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const events = await loadAllEvents();
        if (events.length === 0) {
          setLoadError('No events loaded. Check the events folder.');
        } else {
          setAllEvents(events);
        }
      } catch (error) {
        setLoadError('Failed to load events. Please try again.');
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const startGame = useCallback((config: GameConfig) => {
    if (allEvents.length === 0) {
      console.error('Cannot start game: no events loaded');
      return;
    }
    setLastConfig(config);
    const newGameState = initializeGame(config, allEvents);
    setGameState(newGameState);
  }, [allEvents]);

  const restartGame = useCallback(() => {
    if (lastConfig && allEvents.length > 0) {
      setIsDragging(false);
      setDraggedCard(null);
      setRevealingCard(null);
      const newGameState = initializeGame(lastConfig, allEvents);
      setGameState(newGameState);
    }
  }, [lastConfig, allEvents]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setIsDragging(false);
    setDraggedCard(null);
    setRevealingCard(null);
  }, []);

  const clearReveal = useCallback(() => {
    setRevealingCard(null);
  }, []);

  const reorderHand = useCallback((oldIndex: number, newIndex: number) => {
    if (!gameState) return;

    setGameState(prev => {
      if (!prev) return prev;
      const newPlayers = [...prev.players];
      const currentPlayer = { ...newPlayers[prev.currentPlayerIndex] };
      currentPlayer.hand = arrayMove(currentPlayer.hand, oldIndex, newIndex);
      newPlayers[prev.currentPlayerIndex] = currentPlayer;
      return { ...prev, players: newPlayers };
    });
  }, [gameState]);

  const placeCard = useCallback((event: HistoricalEvent, position: DropPosition): PlacementResult => {
    if (!gameState) {
      return { success: false, event };
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const success = isPlacementCorrect(gameState.timeline, event, position);

    let newGameState = { ...gameState };
    let newPlayers = [...gameState.players];
    let newTimeline = gameState.timeline;
    let newDeck = gameState.deck;

    if (success) {
      // Correct placement: add to timeline, remove from hand
      newTimeline = insertIntoTimeline(gameState.timeline, event, position.index);

      const newHand = removeFromHand(currentPlayer.hand, event.name);
      newPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        hand: newHand,
      };

      // Check if player won
      if (newHand.length === 0) {
        newPlayers[gameState.currentPlayerIndex] = {
          ...newPlayers[gameState.currentPlayerIndex],
          hasWon: true,
          winTurn: gameState.turnNumber,
        };
        newGameState.winners = [...gameState.winners, newPlayers[gameState.currentPlayerIndex]];
      }
    } else {
      // Incorrect placement: discard card, draw new one
      setRevealingCard(event);

      // Remove the incorrect card from hand
      let newHand = removeFromHand(currentPlayer.hand, event.name);

      // Draw a replacement card
      const { card: newCard, newDeck: updatedDeck } = drawCard(gameState.deck);
      newDeck = updatedDeck;

      if (newCard) {
        newHand = addToHand(newHand, newCard);
      }

      newPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        hand: newHand,
      };
    }

    // Move to next player
    const nextPlayerIndex = getNextPlayerIndex(
      gameState.currentPlayerIndex,
      gameState.players.length
    );

    // Increment round if we've gone through all players
    const newRoundNumber =
      nextPlayerIndex === 0 ? gameState.roundNumber + 1 : gameState.roundNumber;

    newGameState = {
      ...newGameState,
      timeline: newTimeline,
      deck: newDeck,
      players: newPlayers,
      currentPlayerIndex: nextPlayerIndex,
      turnNumber: gameState.turnNumber + 1,
      roundNumber: newRoundNumber,
      lastPlacementResult: { success, event },
    };

    // Check if game should end
    if (shouldGameEnd(newGameState)) {
      newGameState.phase = 'gameOver';
    }

    setGameState(newGameState);

    return { success, event };
  }, [gameState]);

  return {
    gameState,
    allEvents,
    isLoading,
    loadError,
    startGame,
    placeCard,
    reorderHand,
    resetGame,
    restartGame,
    isDragging,
    setIsDragging,
    draggedCard,
    setDraggedCard,
    revealingCard,
    clearReveal,
  };
}

export default useGameState;

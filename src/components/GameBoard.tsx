import React, { useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { GameState, HistoricalEvent, DropPosition } from '../types';
import { getDropPositions } from '../utils/gameLogic';
import Timeline from './Timeline/Timeline';
import Hand from './Hand/Hand';
import PlayerInfo from './PlayerInfo';
import Card from './Card';

interface GameBoardProps {
  gameState: GameState;
  onPlaceCard: (event: HistoricalEvent, position: DropPosition) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  draggedCard: HistoricalEvent | null;
  setDraggedCard: (card: HistoricalEvent | null) => void;
  revealingCard: HistoricalEvent | null;
  clearReveal: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onPlaceCard,
  isDragging,
  setIsDragging,
  draggedCard,
  setDraggedCard,
  revealingCard,
  clearReveal,
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const dropPositions = getDropPositions(gameState.timeline);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Prevent accidental drags
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    // Find the card being dragged from hand
    const card = currentPlayer.hand.find(c => c.name === active.id);
    if (card) {
      setDraggedCard(card);
      setIsDragging(true);
    }
  }, [currentPlayer.hand, setDraggedCard, setIsDragging]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;

    if (over && draggedCard) {
      const overId = over.id.toString();
      // Check if dropped on a drop zone
      if (overId.startsWith('drop-')) {
        const positionIndex = parseInt(overId.split('-')[1], 10);
        const position = dropPositions[positionIndex];
        if (position) {
          onPlaceCard(draggedCard, position);
        }
      }
    }

    setDraggedCard(null);
    setIsDragging(false);
  }, [draggedCard, dropPositions, onPlaceCard, setDraggedCard, setIsDragging]);

  const handleDragCancel = useCallback(() => {
    setDraggedCard(null);
    setIsDragging(false);
  }, [setDraggedCard, setIsDragging]);

  // Clear reveal after delay
  useEffect(() => {
    if (revealingCard) {
      const timer = setTimeout(() => {
        clearReveal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [revealingCard, clearReveal]);

  // Show feedback message
  const lastResult = gameState.lastPlacementResult;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header with player info */}
        <PlayerInfo
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          turnNumber={gameState.turnNumber}
          roundNumber={gameState.roundNumber}
          winners={gameState.winners}
        />

        {/* Feedback message */}
        {lastResult && (
          <div className={`
            text-center py-2 font-hand text-xl
            transition-all duration-300
            ${lastResult.success ? 'text-green-600' : 'text-red-600'}
          `}>
            {lastResult.success ? (
              <span>✓ Correct! "{lastResult.event.friendly_name}" placed successfully!</span>
            ) : (
              <span>✗ Wrong! "{lastResult.event.friendly_name}" has been discarded.</span>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="flex-shrink-0">
          <Timeline
            events={gameState.timeline}
            isDragging={isDragging}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Current player's hand */}
        <div className="flex-shrink-0 bg-gradient-to-t from-amber-100/50 to-transparent pt-8">
          <Hand
            player={currentPlayer}
            revealingCard={revealingCard}
            isCurrentPlayer={true}
          />
        </div>

        {/* Deck info */}
        <div className="text-center pb-4 font-hand text-sketch/60">
          Cards remaining in deck: {gameState.deck.length}
        </div>
      </div>

      {/* Drag overlay - renders outside normal document flow */}
      <DragOverlay>
        {draggedCard ? (
          <Card event={draggedCard} showYear={false} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default GameBoard;

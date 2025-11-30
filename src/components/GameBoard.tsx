import React, { useEffect, useCallback, useState } from 'react';
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
  DragOverEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { GameState, HistoricalEvent, DropPosition } from '../types';
import Timeline from './Timeline/Timeline';
import Hand from './Hand/Hand';
import PlayerInfo from './PlayerInfo';
import Card from './Card';

interface GameBoardProps {
  gameState: GameState;
  onPlaceCard: (event: HistoricalEvent, position: DropPosition) => void;
  onReorderHand: (oldIndex: number, newIndex: number) => void;
  onRestart: () => void;
  onNewGame: () => void;
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
  onReorderHand,
  onRestart,
  onNewGame,
  isDragging,
  setIsDragging,
  draggedCard,
  setDraggedCard,
  revealingCard,
  clearReveal,
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isGameOver = gameState.phase === 'gameOver';
  const sortedWinners = [...gameState.winners].sort((a, b) => (a.winTurn || 0) - (b.winTurn || 0));

  // Track the insertion index during drag (using state for re-renders)
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

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
      setInsertionIndex(null);
    }
  }, [currentPlayer.hand, setDraggedCard, setIsDragging]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    if (!over || !draggedCard) {
      setInsertionIndex(null);
      return;
    }

    const overId = over.id.toString();

    // Check if hovering over edge zones
    if (overId === 'timeline-edge-start' || overId === 'empty-timeline') {
      setInsertionIndex(0);
      return;
    }

    if (overId === 'timeline-edge-end') {
      setInsertionIndex(gameState.timeline.length);
      return;
    }

    // Check if hovering over a timeline card
    const overIndex = gameState.timeline.findIndex(e => e.name === overId);

    if (overIndex !== -1) {
      // Determine if we're on the left or right side of the card
      // by comparing the drag position to the card center
      const overRect = over.rect;
      const activeRect = event.active.rect.current.translated;

      if (overRect && activeRect) {
        const overCenter = overRect.left + overRect.width / 2;
        const activeCenter = activeRect.left + activeRect.width / 2;

        // If dragging from the left, insert before; if from right, insert after
        if (activeCenter < overCenter) {
          setInsertionIndex(overIndex);
        } else {
          setInsertionIndex(overIndex + 1);
        }
      } else {
        setInsertionIndex(overIndex);
      }
    } else {
      setInsertionIndex(null);
    }
  }, [draggedCard, gameState.timeline]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = active.id.toString();

    // Reset drag state helper
    const resetDragState = () => {
      setDraggedCard(null);
      setIsDragging(false);
      setInsertionIndex(null);
    };

    if (!over) {
      // Dropped nowhere - cancel
      resetDragState();
      return;
    }

    const overId = over.id.toString();

    // Check where the card came from and where it's going
    const isFromHand = currentPlayer.hand.some(c => c.name === activeId);
    const isDropOnTimelineCard = gameState.timeline.some(e => e.name === overId);
    const isDropOnTimelineEdge = overId === 'empty-timeline' || overId === 'timeline-edge-start' || overId === 'timeline-edge-end';
    const isDropOnTimeline = isDropOnTimelineCard || isDropOnTimelineEdge;
    const isDropOnHand = currentPlayer.hand.some(e => e.name === overId);

    if (isFromHand && isDropOnTimeline && draggedCard) {
      // HAND → TIMELINE: Trigger placement (ends turn)
      let insertIdx: number;

      if (overId === 'empty-timeline' || overId === 'timeline-edge-start') {
        // Dropped on empty timeline or left edge - insert at position 0
        insertIdx = 0;
      } else if (overId === 'timeline-edge-end') {
        // Dropped on right edge - insert at end
        insertIdx = gameState.timeline.length;
      } else {
        // Dropped on a timeline card - use insertionIndex or card position
        const overIndex = gameState.timeline.findIndex(e => e.name === overId);
        insertIdx = insertionIndex ?? overIndex;
      }

      const leftEvent = insertIdx > 0 ? gameState.timeline[insertIdx - 1] : null;
      const rightEvent = insertIdx < gameState.timeline.length ? gameState.timeline[insertIdx] : null;

      const position: DropPosition = {
        index: insertIdx,
        leftEvent,
        rightEvent,
      };
      onPlaceCard(draggedCard, position);
    } else if (isFromHand && isDropOnHand) {
      // HAND → HAND: Reorder within hand (does NOT end turn)
      const oldIndex = currentPlayer.hand.findIndex(e => e.name === activeId);
      const newIndex = currentPlayer.hand.findIndex(e => e.name === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorderHand(oldIndex, newIndex);
      }
    }
    // Else: dropped somewhere invalid, card snaps back

    resetDragState();
  }, [draggedCard, currentPlayer.hand, gameState.timeline, insertionIndex, onPlaceCard, onReorderHand, setDraggedCard, setIsDragging]);

  const handleDragCancel = useCallback(() => {
    setDraggedCard(null);
    setIsDragging(false);
    setInsertionIndex(null);
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
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
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
            insertionIndex={insertionIndex}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Current player's hand OR Winner display */}
        {isGameOver ? (
          <div className="flex-shrink-0 bg-gradient-to-t from-amber-100/50 to-transparent pt-8 pb-8">
            <div className="text-center">
              {/* Winner display */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">🏆</span>
                <h2 className="font-hand text-3xl text-sketch">
                  {sortedWinners.length === 1 ? 'Winner!' : 'Winners!'}
                </h2>
                <span className="text-4xl">🏆</span>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                {sortedWinners.map((winner, index) => (
                  <div
                    key={winner.id}
                    className={`
                      py-2 px-6 rounded-xl font-hand text-xl
                      ${index === 0
                        ? 'bg-yellow-400 text-sketch'
                        : 'bg-gray-200 text-sketch/80'
                      }
                    `}
                  >
                    <span className="mr-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="font-bold">{winner.name}</span>
                  </div>
                ))}
              </div>

              {/* Restart and New Game buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={onRestart}
                  className="
                    px-8 py-3 rounded-xl
                    bg-gradient-to-r from-green-400 to-teal-400
                    font-hand text-2xl text-white
                    shadow-sketch hover:shadow-sketch-lg
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                  "
                >
                  Restart
                </button>
                <button
                  onClick={onNewGame}
                  className="
                    px-8 py-3 rounded-xl
                    bg-gray-300
                    font-hand text-2xl text-sketch
                    shadow-sketch hover:shadow-sketch-lg
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                  "
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
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

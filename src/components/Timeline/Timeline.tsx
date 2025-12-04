import React, { useRef, useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { HistoricalEvent } from '../../types';
import TimelineCard from './TimelineCard';
import InsertionPoint from './InsertionPoint';
import TimeStreamConnector from './TimeStreamConnector';
import Card from '../Card';

interface TimelineProps {
  events: HistoricalEvent[];
  isDragging: boolean;
  insertionIndex?: number | null;
  draggedCard?: HistoricalEvent | null;
  // Tap mode props
  useTapMode?: boolean;
  isCardSelected?: boolean;
  onPlacementTap?: (index: number) => void;
  onCardClick?: (event: HistoricalEvent) => void;
  // Mobile vertical layout
  isVertical?: boolean;
}

// Insertion indicator component - shows preview of card being placed
const InsertionIndicator: React.FC<{ card: HistoricalEvent }> = ({ card }) => (
  <div className="opacity-50 flex-shrink-0">
    <Card event={card} showYear={false} />
  </div>
);

// Empty timeline drop zone component
const EmptyTimelineDropZone: React.FC<{
  isActive: boolean;
  useTapMode?: boolean;
  isCardSelected?: boolean;
  onPlacementTap?: (index: number) => void;
  isVertical?: boolean;
}> = ({ isActive, useTapMode, isCardSelected, onPlacementTap, isVertical }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'empty-timeline',
  });

  // Tap mode: show tappable zone when card is selected
  if (useTapMode && isCardSelected && onPlacementTap) {
    return (
      <button
        onClick={() => onPlacementTap(0)}
        className={`
          flex items-center justify-center
          rounded-lg border-4 border-dashed
          border-blue-400 bg-blue-100/50
          hover:bg-blue-200/60 active:scale-95
          transition-all duration-200
          touch-manipulation
          ${isVertical
            ? 'w-full h-24 max-w-[200px]'
            : 'h-[167px] sm:h-[200px] md:h-[240px] min-w-[150px] sm:min-w-[200px]'
          }
        `}
      >
        <span className="text-lg sm:text-xl text-blue-500">
          Tap to place here
        </span>
      </button>
    );
  }

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-[167px] sm:h-[200px] md:h-[240px] text-sketch/40  text-base sm:text-xl">
        Timeline will appear here
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-center h-[133px] sm:h-[160px] md:h-48 min-w-[150px] sm:min-w-[200px]
        rounded-lg border-4 border-dashed
        transition-all duration-200
        ${isOver
          ? 'border-blue-500 bg-blue-100/50 scale-105'
          : 'border-gray-400/50 bg-gray-100/30'
        }
      `}
    >
      <span className={`
         text-base sm:text-xl
        ${isOver ? 'text-blue-500' : 'text-gray-400'}
      `}>
        Drop here to start the timeline
      </span>
    </div>
  );
};

// Edge drop zone for inserting at timeline ends (invisible but functional)
const EdgeDropZone: React.FC<{ id: string; isActive: boolean }> = ({ id, isActive }) => {
  const { setNodeRef } = useDroppable({ id });

  if (!isActive) return null;

  return (
    <div
      ref={setNodeRef}
      className="w-16 h-40 flex-shrink-0"
    />
  );
};

const Timeline: React.FC<TimelineProps> = ({
  events,
  isDragging,
  insertionIndex,
  draggedCard,
  useTapMode = false,
  isCardSelected = false,
  onPlacementTap,
  onCardClick,
  isVertical = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center when timeline changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      if (isVertical) {
        // Vertical: scroll to center vertically
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        scrollContainer.scrollTop = (scrollHeight - clientHeight) / 2;
      } else {
        // Horizontal: scroll to center horizontally
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        scrollContainer.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
    }
  }, [events.length, isVertical]);

  // In tap mode, show insertion points when a card is selected
  const showTapInsertionPoints = useTapMode && isCardSelected && onPlacementTap;

  // Select sorting strategy based on orientation
  const sortingStrategy = isVertical ? verticalListSortingStrategy : horizontalListSortingStrategy;

  // For vertical mode, reverse display order so recent events are at top
  // Original events array: [earliest, ..., most recent] (index 0 = earliest)
  // Reversed for display: [most recent, ..., earliest] (visual top = most recent)
  const displayEvents = isVertical ? [...events].reverse() : events;

  return (
    <div className={`w-full ${isVertical ? 'h-full' : 'py-2 sm:py-4'}`}>
      {/* Scrollable timeline container */}
      <div
        ref={scrollRef}
        className={`
          ${isVertical
            ? 'overflow-y-auto overflow-x-hidden timeline-scroll-vertical h-full px-2 py-4'
            : 'overflow-x-auto overflow-y-visible timeline-scroll px-4 sm:px-8 py-4 sm:py-6'
          }
        `}
      >
        {events.length === 0 ? (
          <EmptyTimelineDropZone
            isActive={isDragging}
            useTapMode={useTapMode}
            isCardSelected={isCardSelected}
            onPlacementTap={onPlacementTap}
            isVertical={isVertical}
          />
        ) : (
          <SortableContext
            items={events.map(e => e.name)}
            strategy={sortingStrategy}
          >
            <div
              ref={cardsContainerRef}
              className={`
                relative flex items-center justify-center gap-2 sm:gap-4
                ${isVertical
                  ? 'flex-col min-h-max py-4'
                  : 'flex-row min-w-max'
                }
              `}
            >
              {/* Timeline Connector - line with tick marks and dates */}
              <TimeStreamConnector
                cardCount={events.length}
                containerRef={cardsContainerRef}
                events={displayEvents}
                isVertical={isVertical}
              />

              {/* Top/Left edge: either drop zone (drag mode) or insertion point (tap mode) */}
              {showTapInsertionPoints ? (
                // In vertical mode (reversed), top insertion = after all events (logical index = events.length)
                // In horizontal mode, left insertion = before all events (logical index = 0)
                <InsertionPoint
                  index={isVertical ? events.length : 0}
                  onTap={onPlacementTap}
                  isVertical={isVertical}
                />
              ) : (
                <EdgeDropZone id="timeline-edge-start" isActive={isDragging} />
              )}

              {/* Render timeline cards with insertion indicators/points */}
              {displayEvents.map((event, visualIndex) => {
                // Convert visual index to logical index for insertion points
                // Vertical (reversed): visual 0 = logical (length-1), visual 1 = logical (length-2), etc.
                // Horizontal: visual index = logical index
                const logicalIndex = isVertical ? events.length - 1 - visualIndex : visualIndex;

                return (
                  <React.Fragment key={event.name}>
                    {/* Drag mode: Show indicator BEFORE this card if insertionIndex matches */}
                    {!useTapMode && isDragging && insertionIndex === logicalIndex && draggedCard && (
                      <InsertionIndicator card={draggedCard} />
                    )}
                    <TimelineCard
                      event={event}
                      index={visualIndex}
                      onCardClick={onCardClick}
                      useTapMode={useTapMode}
                    />
                    {/* Tap mode: Show insertion point AFTER each card */}
                    {showTapInsertionPoints && (
                      // In vertical mode: insertion after visual card N = logical index (length - 1 - N)
                      // In horizontal mode: insertion after card N = logical index N + 1
                      <InsertionPoint
                        index={isVertical ? events.length - 1 - visualIndex : visualIndex + 1}
                        onTap={onPlacementTap}
                        isVertical={isVertical}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Drag mode: Show indicator at END if inserting after last card */}
              {!useTapMode && isDragging && insertionIndex === events.length && draggedCard && (
                <InsertionIndicator card={draggedCard} />
              )}

              {/* Right edge drop zone (drag mode only, tap mode uses InsertionPoints) */}
              {!useTapMode && (
                <EdgeDropZone id="timeline-edge-end" isActive={isDragging} />
              )}
            </div>
          </SortableContext>
        )}
      </div>

      {/* Direction indicators */}
      {isVertical ? (
        <div className="flex justify-center px-4 py-2 text-sketch/60 text-sm">
          <span>↑ Recent &nbsp;&nbsp;|&nbsp;&nbsp; Earlier ↓</span>
        </div>
      ) : (
        <div className="flex justify-between px-6 sm:px-12 mt-1 sm:mt-2 text-sketch/60 text-sm sm:text-lg">
          <span>← Earlier</span>
          <span>Later →</span>
        </div>
      )}
    </div>
  );
};

export default Timeline;

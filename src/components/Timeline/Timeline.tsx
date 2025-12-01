import React, { useRef, useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { HistoricalEvent } from '../../types';
import TimelineCard from './TimelineCard';
import InsertionPoint from './InsertionPoint';
import TimeStreamConnector from './TimeStreamConnector';

interface TimelineProps {
  events: HistoricalEvent[];
  isDragging: boolean;
  insertionIndex?: number | null;
  // Tap mode props
  useTapMode?: boolean;
  isCardSelected?: boolean;
  onPlacementTap?: (index: number) => void;
}

// Insertion indicator component - glowing line showing where card will be placed
const InsertionIndicator: React.FC = () => (
  <div className="w-2 h-44 bg-blue-500 rounded-full animate-pulse mx-1 shadow-lg shadow-blue-500/50 flex-shrink-0" />
);

// Empty timeline drop zone component
const EmptyTimelineDropZone: React.FC<{
  isActive: boolean;
  useTapMode?: boolean;
  isCardSelected?: boolean;
  onPlacementTap?: (index: number) => void;
}> = ({ isActive, useTapMode, isCardSelected, onPlacementTap }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'empty-timeline',
  });

  // Tap mode: show tappable zone when card is selected
  if (useTapMode && isCardSelected && onPlacementTap) {
    return (
      <button
        onClick={() => onPlacementTap(0)}
        className="
          flex items-center justify-center
          h-[133px] sm:h-[160px] md:h-48 min-w-[150px] sm:min-w-[200px]
          rounded-lg border-4 border-dashed
          border-blue-400 bg-blue-100/50
          hover:bg-blue-200/60 active:scale-95
          transition-all duration-200
          touch-manipulation
        "
      >
        <span className="font-hand text-lg sm:text-xl text-blue-500">
          Tap to place here
        </span>
      </button>
    );
  }

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-[133px] sm:h-[160px] md:h-48 text-sketch/40 font-hand text-base sm:text-xl">
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
        font-hand text-base sm:text-xl
        ${isOver ? 'text-blue-500' : 'text-gray-400'}
      `}>
        Drop here to start the timeline
      </span>
    </div>
  );
};

// Edge drop zone for inserting at timeline ends
const EdgeDropZone: React.FC<{ id: string; isActive: boolean }> = ({ id, isActive }) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  if (!isActive) return null;

  return (
    <div
      ref={setNodeRef}
      className={`
        w-16 h-44 flex-shrink-0
        rounded-lg border-2 border-dashed
        transition-all duration-200
        ${isOver
          ? 'border-blue-500 bg-blue-100/50'
          : 'border-gray-300/50 bg-gray-100/20'
        }
      `}
    />
  );
};

const Timeline: React.FC<TimelineProps> = ({
  events,
  isDragging,
  insertionIndex,
  useTapMode = false,
  isCardSelected = false,
  onPlacementTap,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center when timeline changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      scrollContainer.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, [events.length]);

  // In tap mode, show insertion points when a card is selected
  const showTapInsertionPoints = useTapMode && isCardSelected && onPlacementTap;

  return (
    <div className="w-full py-4 sm:py-8">
      {/* Timeline title */}
      <div className="text-center mb-2 sm:mb-4">
        <h2 className="font-hand text-2xl sm:text-3xl text-sketch">
          The Timeline
        </h2>
        <div className="w-24 sm:w-32 h-1 bg-sketch mx-auto mt-2 rounded" />
      </div>

      {/* Scrollable timeline container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto timeline-scroll px-4 sm:px-8 py-4"
      >
        {events.length === 0 ? (
          <EmptyTimelineDropZone
            isActive={isDragging}
            useTapMode={useTapMode}
            isCardSelected={isCardSelected}
            onPlacementTap={onPlacementTap}
          />
        ) : (
          <SortableContext
            items={events.map(e => e.name)}
            strategy={horizontalListSortingStrategy}
          >
            <div ref={cardsContainerRef} className="relative flex items-center justify-center min-w-max gap-2 sm:gap-4">
              {/* Time Stream Connector - golden/amber flowing line */}
              <TimeStreamConnector cardCount={events.length} containerRef={cardsContainerRef} />

              {/* Left edge: either drop zone (drag mode) or insertion point (tap mode) */}
              {showTapInsertionPoints ? (
                <InsertionPoint index={0} onTap={onPlacementTap} />
              ) : (
                <EdgeDropZone id="timeline-edge-start" isActive={isDragging} />
              )}

              {/* Render timeline cards with insertion indicators/points */}
              {events.map((event, index) => (
                <React.Fragment key={event.name}>
                  {/* Drag mode: Show indicator BEFORE this card if insertionIndex matches */}
                  {!useTapMode && isDragging && insertionIndex === index && (
                    <InsertionIndicator />
                  )}
                  <TimelineCard
                    event={event}
                    index={index}
                  />
                  {/* Tap mode: Show insertion point AFTER each card */}
                  {showTapInsertionPoints && (
                    <InsertionPoint index={index + 1} onTap={onPlacementTap} />
                  )}
                </React.Fragment>
              ))}

              {/* Drag mode: Show indicator at END if inserting after last card */}
              {!useTapMode && isDragging && insertionIndex === events.length && (
                <InsertionIndicator />
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
      <div className="flex justify-between px-6 sm:px-12 mt-2 sm:mt-4 text-sketch/60 font-hand text-sm sm:text-lg">
        <span>← Earlier</span>
        <span>Later →</span>
      </div>
    </div>
  );
};

export default Timeline;

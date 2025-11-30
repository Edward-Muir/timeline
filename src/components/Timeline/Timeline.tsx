import React, { useRef, useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { HistoricalEvent } from '../../types';
import TimelineCard from './TimelineCard';

interface TimelineProps {
  events: HistoricalEvent[];
  isDragging: boolean;
  insertionIndex?: number | null;
}

// Insertion indicator component - glowing line showing where card will be placed
const InsertionIndicator: React.FC = () => (
  <div className="w-2 h-44 bg-blue-500 rounded-full animate-pulse mx-1 shadow-lg shadow-blue-500/50 flex-shrink-0" />
);

// Empty timeline drop zone component
const EmptyTimelineDropZone: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'empty-timeline',
  });

  if (!isActive) {
    return (
      <div className="flex items-center justify-center h-48 text-sketch/40 font-hand text-xl">
        Timeline will appear here
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-center h-48 min-w-[200px]
        rounded-lg border-4 border-dashed
        transition-all duration-200
        ${isOver
          ? 'border-blue-500 bg-blue-100/50 scale-105'
          : 'border-gray-400/50 bg-gray-100/30'
        }
      `}
    >
      <span className={`
        font-hand text-xl
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

const Timeline: React.FC<TimelineProps> = ({ events, isDragging, insertionIndex }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center when timeline changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      scrollContainer.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, [events.length]);

  return (
    <div className="w-full py-8">
      {/* Timeline title */}
      <div className="text-center mb-4">
        <h2 className="font-hand text-3xl text-sketch">
          The Timeline
        </h2>
        <div className="w-32 h-1 bg-sketch mx-auto mt-2 rounded" />
      </div>

      {/* Scrollable timeline container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto timeline-scroll px-8 py-4"
      >
        {events.length === 0 ? (
          <EmptyTimelineDropZone isActive={isDragging} />
        ) : (
          <SortableContext
            items={events.map(e => e.name)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center justify-center min-w-max gap-4">
              {/* Timeline line */}
              <div className="absolute left-0 right-0 h-1 bg-sketch/20 -z-10" />

              {/* Left edge drop zone for inserting before first card */}
              <EdgeDropZone id="timeline-edge-start" isActive={isDragging} />

              {/* Render timeline cards with insertion indicators */}
              {events.map((event, index) => (
                <React.Fragment key={event.name}>
                  {/* Show indicator BEFORE this card if insertionIndex matches */}
                  {isDragging && insertionIndex === index && (
                    <InsertionIndicator />
                  )}
                  <TimelineCard
                    event={event}
                    index={index}
                  />
                </React.Fragment>
              ))}
              {/* Show indicator at END if inserting after last card */}
              {isDragging && insertionIndex === events.length && (
                <InsertionIndicator />
              )}

              {/* Right edge drop zone for inserting after last card */}
              <EdgeDropZone id="timeline-edge-end" isActive={isDragging} />
            </div>
          </SortableContext>
        )}
      </div>

      {/* Direction indicators */}
      <div className="flex justify-between px-12 mt-4 text-sketch/60 font-hand text-lg">
        <span>← Earlier</span>
        <span>Later →</span>
      </div>
    </div>
  );
};

export default Timeline;

import React, { useRef, useEffect } from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { HistoricalEvent } from '../../types';
import { getDropPositions } from '../../utils/gameLogic';
import TimelineCard from './TimelineCard';
import DropZone from './DropZone';

interface TimelineProps {
  events: HistoricalEvent[];
  isDragging: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ events, isDragging }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropPositions = getDropPositions(events);

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
        <SortableContext
          items={events.map(e => e.name)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-center justify-start min-w-max gap-2">
            {/* Timeline line */}
            <div className="absolute left-0 right-0 h-1 bg-sketch/20 -z-10" />

            {/* Render cards and drop zones interleaved */}
            {dropPositions.map((position, index) => (
              <React.Fragment key={`drop-${index}`}>
                {/* Drop zone before this position */}
                <DropZone
                  position={position}
                  isActive={isDragging}
                />

                {/* Card at this position (if exists) */}
                {index < events.length && (
                  <TimelineCard
                    event={events[index]}
                    index={index}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </SortableContext>
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

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HistoricalEvent } from '../../types';
import Card from '../Card';

interface TimelineCardProps {
  event: HistoricalEvent;
  index: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, index }) => {
  // Create slight random rotation for sketchbook feel
  const rotation = ((index % 5) - 2) * 1.5;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event.name,
    // Not disabled - allows visual transforms when other items drag over
  });

  // Combine sortable transform with base styles
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-shrink-0 transition-all duration-200 hover:scale-110 hover:z-10"
    >
      <Card
        event={event}
        showYear={true}
        rotation={rotation}
        className="cursor-default"
      />
    </div>
  );
};

export default TimelineCard;

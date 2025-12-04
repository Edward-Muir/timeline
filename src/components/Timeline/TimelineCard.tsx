import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HistoricalEvent } from '../../types';
import Card from '../Card';
import { useLongPress } from '../../hooks/useLongPress';

interface TimelineCardProps {
  event: HistoricalEvent;
  index: number;
  onCardClick?: (event: HistoricalEvent) => void;
  useTapMode?: boolean;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ event, index, onCardClick, useTapMode = false }) => {
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

  // Long press for mobile - opens description modal
  const { handlers: longPressHandlers, isLongPressing } = useLongPress({
    onLongPress: () => onCardClick?.(event),
    onShortPress: () => {
      // Timeline cards: no action on short tap (they're already placed)
    },
    threshold: 500,
  });

  // Combine sortable transform with base styles
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  // On desktop, use click handler; on mobile, use long-press handlers
  const interactionProps = useTapMode
    ? longPressHandlers
    : { onClick: onCardClick ? () => onCardClick(event) : undefined };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-timeline-card
      {...attributes}
      {...(!useTapMode ? listeners : {})}
      {...interactionProps}
      className={`
        flex-shrink-0 transition-all duration-fast hover:scale-105 hover:z-10 hover:-translate-y-1
        ${isLongPressing ? 'scale-95 opacity-80 animate-pulse' : ''}
      `}
    >
      <Card
        event={event}
        showYear={true}
        rotation={rotation}
        className={`
          shadow-card-placed
          hover:shadow-card-hover
          ${isDragging ? 'shadow-card-dragging' : ''}
        `}
      />
    </div>
  );
};

export default TimelineCard;

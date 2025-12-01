import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HistoricalEvent } from '../../types';
import Card from '../Card';

interface HandCardProps {
  event: HistoricalEvent;
  index: number;
  isRevealing?: boolean;
  showYear?: boolean;
  onCardClick?: (event: HistoricalEvent) => void;
}

const HandCard: React.FC<HandCardProps> = ({
  event,
  index,
  isRevealing = false,
  showYear = false,
  onCardClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: event.name,
    data: { event, source: 'hand' },
    disabled: isRevealing,
  });

  // Fan out cards with slight rotation
  const rotation = (index - 2) * 5;
  const translateY = Math.abs(index - 2) * 5;

  // Combine sortable transform with base fan-out styling
  const style: React.CSSProperties = {
    transform: isDragging
      ? CSS.Transform.toString(transform)
      : `rotate(${rotation}deg) translateY(${translateY}px)`,
    transition: 'transform 75ms',
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab hover:-translate-y-4 hover:scale-105 hover:z-20
        ${isDragging ? 'scale-95 cursor-grabbing' : ''}
        ${isRevealing ? 'cursor-default' : ''}
      `}
    >
      <Card
        event={event}
        showYear={showYear || isRevealing}
        isRevealing={isRevealing}
        className={isRevealing ? 'ring-4 ring-red-500 animate-shake' : ''}
        onClick={onCardClick ? () => onCardClick(event) : undefined}
      />
    </div>
  );
};

export default HandCard;

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { HistoricalEvent } from '../../types';
import Card from '../Card';

interface HandCardProps {
  event: HistoricalEvent;
  index: number;
  isRevealing?: boolean;
  showYear?: boolean;
}

const HandCard: React.FC<HandCardProps> = ({
  event,
  index,
  isRevealing = false,
  showYear = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: event.name,
    data: { event },
    disabled: isRevealing,
  });

  // Fan out cards with slight rotation
  const rotation = (index - 2) * 5;
  const translateY = Math.abs(index - 2) * 5;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        transition-all duration-200 cursor-grab
        hover:-translate-y-4 hover:scale-105 hover:z-20
        ${isDragging ? 'opacity-50 scale-95 cursor-grabbing' : ''}
        ${isRevealing ? 'cursor-default' : ''}
      `}
      style={{
        transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
      }}
    >
      <Card
        event={event}
        showYear={showYear || isRevealing}
        isRevealing={isRevealing}
        className={isRevealing ? 'ring-4 ring-red-500 animate-shake' : ''}
      />
    </div>
  );
};

export default HandCard;

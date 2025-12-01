import React from 'react';
import { HistoricalEvent } from '../../types';
import Card from '../Card';

interface SelectableHandCardProps {
  event: HistoricalEvent;
  index: number;
  isSelected: boolean;
  isRevealing?: boolean;
  showYear?: boolean;
  onSelect: (event: HistoricalEvent | null) => void;
}

const SelectableHandCard: React.FC<SelectableHandCardProps> = ({
  event,
  index,
  isSelected,
  isRevealing = false,
  showYear = false,
  onSelect,
}) => {
  // Fan out cards with slight rotation (same as HandCard)
  const rotation = (index - 2) * 5;
  const translateY = Math.abs(index - 2) * 5;

  const handleClick = () => {
    if (isRevealing) return;
    // Toggle selection: if already selected, deselect
    onSelect(isSelected ? null : event);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRevealing}
      className={`
        transition-all duration-200 touch-manipulation
        ${isSelected
          ? 'ring-4 ring-blue-500 -translate-y-6 scale-105 z-30'
          : 'hover:-translate-y-2'}
        ${isRevealing ? 'cursor-default' : 'cursor-pointer'}
      `}
      style={{
        transform: isSelected
          ? `rotate(0deg) translateY(-24px) scale(1.05)`
          : `rotate(${rotation}deg) translateY(${translateY}px)`,
      }}
    >
      <Card
        event={event}
        showYear={showYear || isRevealing}
        isRevealing={isRevealing}
        className={isRevealing ? 'ring-4 ring-red-500 animate-shake' : ''}
      />
    </button>
  );
};

export default SelectableHandCard;

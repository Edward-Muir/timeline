import React from 'react';
import { HistoricalEvent } from '../../types';
import Card from '../Card';
import { useLongPress } from '../../hooks/useLongPress';

interface SelectableHandCardProps {
  event: HistoricalEvent;
  index: number;
  isSelected: boolean;
  isRevealing?: boolean;
  showYear?: boolean;
  onSelect: (event: HistoricalEvent | null) => void;
  onLongPress?: (event: HistoricalEvent) => void;
}

const SelectableHandCard: React.FC<SelectableHandCardProps> = ({
  event,
  index,
  isSelected,
  isRevealing = false,
  showYear = false,
  onSelect,
  onLongPress,
}) => {
  // Fan out cards with slight rotation (same as HandCard)
  const rotation = (index - 2) * 5;
  const translateY = Math.abs(index - 2) * 5;

  // Long press for viewing description, short press for selection
  const { handlers: longPressHandlers, isLongPressing } = useLongPress({
    onLongPress: () => {
      console.log('[SelectableHandCard] onLongPress', { event: event.name, isRevealing });
      if (!isRevealing && onLongPress) {
        onLongPress(event);
      }
    },
    onShortPress: () => {
      console.log('[SelectableHandCard] onShortPress', { event: event.name, isRevealing, isSelected });
      if (isRevealing) return;
      // Toggle selection: if already selected, deselect
      onSelect(isSelected ? null : event);
    },
    threshold: 500,
  });

  return (
    <button
      {...longPressHandlers}
      disabled={isRevealing}
      className={`
        transition-all duration-200 touch-manipulation
        ${isSelected
          ? 'ring-4 ring-blue-500 scale-105 z-30 shadow-2xl'
          : 'hover:-translate-y-2'}
        ${isRevealing ? 'cursor-default' : 'cursor-pointer'}
        ${isLongPressing ? 'scale-95 opacity-80 animate-pulse' : ''}
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

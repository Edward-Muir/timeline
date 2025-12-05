import React from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { HistoricalEvent, Player } from '../../types';
import HandCard from './HandCard';
import SelectableHandCard from './SelectableHandCard';

interface HandProps {
  player: Player;
  revealingCard: HistoricalEvent | null;
  isCurrentPlayer: boolean;
  // Tap mode props
  useTapMode?: boolean;
  selectedCard?: HistoricalEvent | null;
  onSelectCard?: (card: HistoricalEvent | null) => void;
  onCardClick?: (event: HistoricalEvent) => void;
  // Long press callback for viewing card description on mobile
  onCardLongPress?: (event: HistoricalEvent) => void;
}

const Hand: React.FC<HandProps> = ({
  player,
  revealingCard,
  isCurrentPlayer,
  useTapMode = false,
  selectedCard = null,
  onSelectCard,
  onCardClick,
  onCardLongPress,
}) => {
  if (player.hand.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 px-4 sm:px-8">
        <div className="text-center">
          <span className=" text-2xl sm:text-4xl text-green-600">
            {player.name} wins!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      py-1 sm:py-2 px-4 sm:px-8
      transition-all duration-300
      ${isCurrentPlayer ? '' : 'opacity-50 pointer-events-none'}
    `}>
      {/* Cards in hand - tap mode uses SelectableHandCard with horizontal scroll, drag mode uses HandCard */}
      {useTapMode && onSelectCard ? (
        <div className="overflow-x-auto overflow-y-clip timeline-scroll py-4">
          <div className="flex items-end gap-[-20px] min-w-max px-4">
            {player.hand.map((event, index) => (
              <div
                key={event.name}
                className="flex-shrink-0"
                style={{
                  zIndex: selectedCard?.name === event.name ? 50 : index,
                }}
              >
                <SelectableHandCard
                  event={event}
                  index={index}
                  isSelected={selectedCard?.name === event.name}
                  isRevealing={revealingCard?.name === event.name}
                  showYear={revealingCard?.name === event.name}
                  onSelect={onSelectCard}
                  onLongPress={onCardLongPress}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <SortableContext
          items={player.hand.map(e => e.name)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-end justify-center gap-[-10px] sm:gap-[-20px]">
            {player.hand.map((event, index) => (
              <HandCard
                key={event.name}
                event={event}
                index={index}
                isRevealing={revealingCard?.name === event.name}
                showYear={revealingCard?.name === event.name}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {/* Instructions */}
      {isCurrentPlayer && (
        <p className="text-center mt-1 sm:mt-2 text-base sm:text-lg text-sketch/70">
          {useTapMode
            ? 'Tap to select • Long-press for details'
            : 'Drag a card to place it on the timeline'}
        </p>
      )}
    </div>
  );
};

export default Hand;

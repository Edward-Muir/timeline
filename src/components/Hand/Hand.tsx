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
}

const Hand: React.FC<HandProps> = ({
  player,
  revealingCard,
  isCurrentPlayer,
  useTapMode = false,
  selectedCard = null,
  onSelectCard,
}) => {
  if (player.hand.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 px-4 sm:px-8">
        <div className="text-center">
          <span className="font-hand text-2xl sm:text-4xl text-green-600">
            {player.name} wins!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      py-2 sm:py-4 px-4 sm:px-8
      transition-all duration-300
      ${isCurrentPlayer ? '' : 'opacity-50 pointer-events-none'}
    `}>
      {/* Player name indicator */}
      <div className="text-center mb-2 sm:mb-4">
        <span className={`
          font-hand text-lg sm:text-2xl px-3 sm:px-4 py-1 rounded-full
          ${isCurrentPlayer ? 'bg-yellow-400 text-sketch' : 'bg-gray-300 text-gray-600'}
        `}>
          {player.name}'s Hand
          {isCurrentPlayer && <span className="ml-2 hidden sm:inline">Your turn!</span>}
        </span>
      </div>

      {/* Cards in hand - tap mode uses SelectableHandCard, drag mode uses HandCard */}
      {useTapMode && onSelectCard ? (
        <div className="flex items-end justify-center gap-[-10px] sm:gap-[-20px] min-h-[140px] sm:min-h-[200px]">
          {player.hand.map((event, index) => (
            <SelectableHandCard
              key={event.name}
              event={event}
              index={index}
              isSelected={selectedCard?.name === event.name}
              isRevealing={revealingCard?.name === event.name}
              showYear={revealingCard?.name === event.name}
              onSelect={onSelectCard}
            />
          ))}
        </div>
      ) : (
        <SortableContext
          items={player.hand.map(e => e.name)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-end justify-center gap-[-10px] sm:gap-[-20px] min-h-[140px] sm:min-h-[200px]">
            {player.hand.map((event, index) => (
              <HandCard
                key={event.name}
                event={event}
                index={index}
                isRevealing={revealingCard?.name === event.name}
                showYear={revealingCard?.name === event.name}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {/* Instructions */}
      {isCurrentPlayer && (
        <p className="text-center mt-2 sm:mt-4 font-hand text-base sm:text-lg text-sketch/70">
          {useTapMode
            ? 'Tap a card to select, then tap where to place it'
            : 'Drag a card to place it on the timeline'}
        </p>
      )}
    </div>
  );
};

export default Hand;

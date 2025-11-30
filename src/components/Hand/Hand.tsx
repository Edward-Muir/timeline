import React from 'react';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { HistoricalEvent, Player } from '../../types';
import HandCard from './HandCard';

interface HandProps {
  player: Player;
  revealingCard: HistoricalEvent | null;
  isCurrentPlayer: boolean;
}

const Hand: React.FC<HandProps> = ({
  player,
  revealingCard,
  isCurrentPlayer,
}) => {
  if (player.hand.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 px-8">
        <div className="text-center">
          <span className="font-hand text-4xl text-green-600">
            🎉 {player.name} wins! 🎉
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      py-4 px-8
      transition-all duration-300
      ${isCurrentPlayer ? '' : 'opacity-50 pointer-events-none'}
    `}>
      {/* Player name indicator */}
      <div className="text-center mb-4">
        <span className={`
          font-hand text-2xl px-4 py-1 rounded-full
          ${isCurrentPlayer ? 'bg-yellow-400 text-sketch' : 'bg-gray-300 text-gray-600'}
        `}>
          {player.name}'s Hand
          {isCurrentPlayer && <span className="ml-2">👈 Your turn!</span>}
        </span>
      </div>

      {/* Cards in hand */}
      <SortableContext
        items={player.hand.map(e => e.name)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex items-end justify-center gap-[-20px] min-h-[200px]">
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

      {/* Instructions */}
      {isCurrentPlayer && (
        <p className="text-center mt-4 font-hand text-lg text-sketch/70">
          Drag a card to place it on the timeline
        </p>
      )}
    </div>
  );
};

export default Hand;

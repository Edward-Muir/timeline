import React from 'react';
import { Player } from '../types';

interface PlayerInfoProps {
  players: Player[];
  currentPlayerIndex: number;
  turnNumber: number;
  roundNumber: number;
  winners: Player[];
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  players,
  currentPlayerIndex,
  turnNumber,
  roundNumber,
  winners,
}) => {
  return (
    <div className="bg-white/80 rounded-lg shadow-sketch p-2 sm:p-4 mx-2 sm:mx-4 mb-2 sm:mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Turn info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="font-hand text-base sm:text-xl">
            <span className="text-sketch/60">Round:</span>{' '}
            <span className="font-bold text-sketch">{roundNumber}</span>
          </div>
          <div className="font-hand text-base sm:text-xl">
            <span className="text-sketch/60">Turn:</span>{' '}
            <span className="font-bold text-sketch">{turnNumber}</span>
          </div>
        </div>

        {/* Player stats */}
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`
                px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-hand text-sm sm:text-lg
                transition-all duration-200
                ${index === currentPlayerIndex
                  ? 'bg-yellow-400 text-sketch scale-105 shadow-md'
                  : player.hasWon
                    ? 'bg-green-400 text-white'
                    : 'bg-gray-200 text-sketch/70'
                }
              `}
            >
              <span className="font-bold">{player.name}</span>
              <span className="ml-1 sm:ml-2">
                {player.hasWon ? (
                  <span>🏆</span>
                ) : (
                  <span className="bg-white/50 px-1 sm:px-2 py-0.5 rounded-full text-xs sm:text-sm">
                    {player.hand.length}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Winners list - hidden on mobile to save space */}
        {winners.length > 0 && (
          <div className="hidden sm:block font-hand text-lg text-green-700">
            <span className="font-bold">Winners:</span>{' '}
            {winners.map((w, i) => (
              <span key={w.id}>
                {i > 0 && ', '}
                {w.name} (Turn {w.winTurn})
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerInfo;

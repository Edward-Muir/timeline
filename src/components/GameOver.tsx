import React from 'react';
import { Player } from '../types';

interface GameOverProps {
  winners: Player[];
  turnNumber: number;
  onPlayAgain: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ winners, turnNumber, onPlayAgain }) => {
  // Sort winners by win turn
  const sortedWinners = [...winners].sort((a, b) => (a.winTurn || 0) - (b.winTurn || 0));

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-2xl shadow-sketch-lg p-8 max-w-md w-full text-center">
        {/* Celebration header */}
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="font-hand text-5xl text-sketch mb-2">
          Game Over!
        </h1>

        <p className="font-hand text-xl text-sketch/60 mb-8">
          Completed in {turnNumber - 1} turns
        </p>

        {/* Decorative line */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-0.5 bg-sketch/20" />
          <span className="font-hand text-sketch/40">🏆</span>
          <div className="flex-1 h-0.5 bg-sketch/20" />
        </div>

        {/* Winners list */}
        <div className="mb-8">
          <h2 className="font-hand text-2xl text-sketch mb-4">
            {sortedWinners.length === 1 ? 'Winner' : 'Winners'}
          </h2>

          <div className="space-y-3">
            {sortedWinners.map((winner, index) => (
              <div
                key={winner.id}
                className={`
                  py-3 px-6 rounded-xl font-hand text-xl
                  ${index === 0
                    ? 'bg-yellow-400 text-sketch'
                    : 'bg-gray-200 text-sketch/80'
                  }
                `}
              >
                <span className="mr-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <span className="font-bold">{winner.name}</span>
                <span className="text-sm ml-2 opacity-70">
                  (Turn {winner.winTurn})
                </span>
              </div>
            ))}
          </div>

          {sortedWinners.length > 1 && (
            <p className="font-hand text-sketch/60 mt-4">
              Multiple winners finished on the same turn!
            </p>
          )}
        </div>

        {/* Play again button */}
        <button
          onClick={onPlayAgain}
          className="
            w-full py-4 rounded-xl
            bg-gradient-to-r from-green-400 to-teal-400
            font-hand text-2xl text-white
            shadow-sketch hover:shadow-sketch-lg
            transition-all duration-200
            hover:scale-105 active:scale-95
          "
        >
          Play Again!
        </button>

        {/* Fun fact */}
        <p className="mt-6 font-hand text-sm text-sketch/40">
          Thanks for playing Timeline! 🕰️
        </p>
      </div>
    </div>
  );
};

export default GameOver;

import React, { useState } from 'react';
import { GameConfig } from '../types';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
  eventCount?: number;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, eventCount }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [startingEvents, setStartingEvents] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '', '', '']);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const names = playerNames.slice(0, playerCount).map((name, i) =>
      name.trim() || `Player ${i + 1}`
    );

    onStartGame({
      playerCount,
      cardsPerPlayer: 5,
      startingTimelineEvents: startingEvents,
      playerNames: names,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/90 rounded-2xl shadow-sketch-lg p-8 max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-hand text-5xl text-sketch mb-2">
            Timeline
          </h1>
          <p className="font-hand text-xl text-sketch/60">
            Place events in chronological order!
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-0.5 bg-sketch/20" />
          <span className="font-hand text-sketch/40">⏳</span>
          <div className="flex-1 h-0.5 bg-sketch/20" />
        </div>

        {/* Player count */}
        <div className="mb-6">
          <label className="block font-hand text-xl text-sketch mb-2">
            Number of Players
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setPlayerCount(num)}
                className={`
                  w-12 h-12 rounded-lg font-hand text-2xl
                  transition-all duration-200
                  ${playerCount === num
                    ? 'bg-yellow-400 text-sketch shadow-md scale-105'
                    : 'bg-gray-200 text-sketch/60 hover:bg-gray-300'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Player names */}
        <div className="mb-6">
          <label className="block font-hand text-xl text-sketch mb-2">
            Player Names
          </label>
          <div className="space-y-2">
            {Array.from({ length: playerCount }).map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Player ${index + 1}`}
                value={playerNames[index]}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="
                  w-full px-4 py-2 rounded-lg
                  border-2 border-sketch/20
                  font-hand text-lg text-sketch
                  placeholder:text-sketch/40
                  focus:outline-none focus:border-yellow-400
                  transition-colors duration-200
                "
              />
            ))}
          </div>
        </div>

        {/* Starting events */}
        <div className="mb-8">
          <label className="block font-hand text-xl text-sketch mb-2">
            Starting Timeline Events: {startingEvents}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={startingEvents}
            onChange={(e) => setStartingEvents(Number(e.target.value))}
            className="w-full accent-yellow-400"
          />
          <div className="flex justify-between text-sketch/40 font-hand text-sm">
            <span>Easier</span>
            <span>Harder</span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartGame}
          className="
            w-full py-4 rounded-xl
            bg-gradient-to-r from-yellow-400 to-orange-400
            font-hand text-2xl text-white
            shadow-sketch hover:shadow-sketch-lg
            transition-all duration-200
            hover:scale-105 active:scale-95
          "
        >
          Start Game!
        </button>

        {/* Rules hint */}
        <p className="text-center mt-4 font-hand text-sm text-sketch/50">
          Each player gets 5 cards. Place them correctly to win!
        </p>
        {eventCount && (
          <p className="text-center mt-2 font-hand text-xs text-sketch/40">
            {eventCount} historical events loaded
          </p>
        )}
      </div>
    </div>
  );
};

export default GameSetup;

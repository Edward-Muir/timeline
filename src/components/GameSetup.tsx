import React, { useState } from 'react';
import { GameConfig } from '../types';

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
  eventCount?: number;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, eventCount }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
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
      cardsPerPlayer,
      startingTimelineEvents: startingEvents,
      playerNames: names,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/90 rounded-2xl shadow-sketch-lg p-4 sm:p-8 max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className=" text-4xl sm:text-5xl text-sketch mb-2">
            Timeline
          </h1>
          <p className=" text-lg sm:text-xl text-sketch/60">
            Place events in chronological order!
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-4 mb-4 sm:mb-8">
          <div className="flex-1 h-0.5 bg-sketch/20" />
          <span className=" text-sketch/40">⏳</span>
          <div className="flex-1 h-0.5 bg-sketch/20" />
        </div>

        {/* Player count */}
        <div className="mb-4 sm:mb-6">
          <label className="block  text-lg sm:text-xl text-sketch mb-2">
            Number of Players
          </label>
          <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setPlayerCount(num)}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-lg  text-xl sm:text-2xl
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
        <div className="mb-4 sm:mb-6">
          <label className="block  text-lg sm:text-xl text-sketch mb-2">
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
                  w-full px-3 sm:px-4 py-2 rounded-lg
                  border-2 border-sketch/20
                   text-base sm:text-lg text-sketch
                  placeholder:text-sketch/40
                  focus:outline-none focus:border-yellow-400
                  transition-colors duration-200
                "
              />
            ))}
          </div>
        </div>

        {/* Cards per player */}
        <div className="mb-4 sm:mb-6">
          <label className="block  text-lg sm:text-xl text-sketch mb-2">
            Cards Per Player: {cardsPerPlayer}
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={cardsPerPlayer}
            onChange={(e) => setCardsPerPlayer(Number(e.target.value))}
            className="w-full accent-yellow-400"
          />
          <div className="flex justify-between text-sketch/40  text-sm">
            <span>Fewer</span>
            <span>More</span>
          </div>
        </div>

        {/* Starting events */}
        <div className="mb-6 sm:mb-8">
          <label className="block  text-lg sm:text-xl text-sketch mb-2">
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
          <div className="flex justify-between text-sketch/40  text-sm">
            <span>Easier</span>
            <span>Harder</span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartGame}
          className="
            w-full py-3 sm:py-4 rounded-xl
            bg-gradient-to-r from-yellow-400 to-orange-400
             text-xl sm:text-2xl text-white
            shadow-sketch hover:shadow-sketch-lg
            transition-all duration-200
            hover:scale-105 active:scale-95
          "
        >
          Start Game!
        </button>

        {/* Rules hint */}
        <p className="text-center mt-3 sm:mt-4  text-sm text-sketch/50">
          Each player gets {cardsPerPlayer} cards. Place them correctly to win!
        </p>
        {eventCount && (
          <p className="text-center mt-2  text-xs text-sketch/40">
            {eventCount} historical events loaded
          </p>
        )}
      </div>
    </div>
  );
};

export default GameSetup;

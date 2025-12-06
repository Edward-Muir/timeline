import React, { useState } from 'react';
import { GameConfig, Difficulty, Category, Era } from '../types';
import { ALL_ERAS, ERA_DEFINITIONS } from '../utils/eras';

const ALL_CATEGORIES: Category[] = ['conflict', 'disasters', 'exploration', 'cultural', 'infrastructure', 'diplomatic'];

interface GameSetupProps {
  onStartGame: (config: GameConfig) => void;
  eventCount?: number;
}

// Decorative corner flourish SVG component
const CornerFlourish: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 38C2 38 8 32 14 28C20 24 26 22 32 18C38 14 38 8 38 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.3"
    />
    <path
      d="M2 30C2 30 6 26 10 23C14 20 18 18 22 15C26 12 28 8 28 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.2"
    />
    <circle cx="2" cy="38" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame, eventCount }) => {
  const [playerCount, setPlayerCount] = useState(1);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(5);
  const [startingEvents, setStartingEvents] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '', '', '']);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>(['easy', 'medium', 'hard']);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([...ALL_CATEGORIES]);
  const [selectedEras, setSelectedEras] = useState<Era[]>([...ALL_ERAS]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleEra = (era: Era) => {
    setSelectedEras(prev =>
      prev.includes(era)
        ? prev.filter(e => e !== era)
        : [...prev, era]
    );
  };

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
      selectedDifficulties,
      selectedCategories,
      selectedEras,
    });
  };

  const isValid = selectedDifficulties.length > 0 && selectedCategories.length > 0 && selectedEras.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white/90 rounded-2xl shadow-sketch-lg p-4 sm:p-8 max-w-md w-full animate-entrance">
        {/* Decorative corner flourishes */}
        <CornerFlourish className="absolute top-3 left-3 text-amber-700" />
        <CornerFlourish className="absolute top-3 right-3 text-amber-700 -scale-x-100" />
        <CornerFlourish className="absolute bottom-3 left-3 text-amber-700 -scale-y-100" />
        <CornerFlourish className="absolute bottom-3 right-3 text-amber-700 -scale-x-100 -scale-y-100" />

        {/* Title */}
        <div className="text-center mb-4 sm:mb-8">
          <h1
            className="text-4xl sm:text-5xl text-sketch mb-2"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
          >
            Timeline
          </h1>
          <p className="text-lg sm:text-xl text-sketch/60">
            Place events in chronological order!
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-4 sm:mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-amber-700/50">
            <path
              fill="currentColor"
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
            />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
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
                  transition-all duration-fast
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
                  transition-colors duration-fast
                "
              />
            ))}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2 text-lg sm:text-xl text-sketch hover:text-sketch/80 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Options
          </button>
        </div>

        {/* Advanced Options Content */}
        {showAdvancedOptions && (
          <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6 pl-2 border-l-2 border-amber-200">
            {/* Difficulty selection */}
            <div>
              <label className="block text-base sm:text-lg text-sketch mb-2">
                Card Difficulty
              </label>
              <div className="flex gap-2 sm:gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg text-sm sm:text-base
                      transition-all duration-fast capitalize
                      ${selectedDifficulties.includes(difficulty)
                        ? 'bg-yellow-400 text-sketch shadow-md'
                        : 'bg-gray-200 text-sketch/60 hover:bg-gray-300'
                      }
                    `}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
              {selectedDifficulties.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Select at least one difficulty</p>
              )}
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-base sm:text-lg text-sketch mb-2">
                Categories
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ALL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`
                      py-2 px-2 rounded-lg text-sm sm:text-base
                      transition-all duration-fast capitalize
                      ${selectedCategories.includes(category)
                        ? 'bg-yellow-400 text-sketch shadow-md'
                        : 'bg-gray-200 text-sketch/60 hover:bg-gray-300'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Select at least one category</p>
              )}
            </div>

            {/* Era selection */}
            <div>
              <label className="block text-base sm:text-lg text-sketch mb-2">
                Eras
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ERA_DEFINITIONS.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => toggleEra(era.id)}
                    className={`
                      py-2 px-2 rounded-lg text-xs sm:text-sm
                      transition-all duration-fast
                      ${selectedEras.includes(era.id)
                        ? 'bg-yellow-400 text-sketch shadow-md'
                        : 'bg-gray-200 text-sketch/60 hover:bg-gray-300'
                      }
                    `}
                  >
                    {era.name}
                  </button>
                ))}
              </div>
              {selectedEras.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Select at least one era</p>
              )}
            </div>

            {/* Cards per player */}
            <div>
              <label className="block text-base sm:text-lg text-sketch mb-2">
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
              <div className="flex justify-between text-sketch/40 text-sm">
                <span>Fewer</span>
                <span>More</span>
              </div>
            </div>

            {/* Starting events */}
            <div>
              <label className="block text-base sm:text-lg text-sketch mb-2">
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
              <div className="flex justify-between text-sketch/40 text-sm">
                <span>Easier</span>
                <span>Harder</span>
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStartGame}
          disabled={!isValid}
          className={`
            w-full py-3 sm:py-4 rounded-xl
            text-xl sm:text-2xl text-white
            shadow-sketch
            transition-all duration-fast
            ${!isValid
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] active:scale-95'
            }
          `}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
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

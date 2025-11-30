import React from 'react';
import { GameConfig } from '../types';
import { useGameState } from '../hooks/useGameState';
import GameSetup from './GameSetup';
import GameBoard from './GameBoard';

const App: React.FC = () => {
  const {
    gameState,
    allEvents,
    isLoading,
    loadError,
    startGame,
    placeCard,
    reorderHand,
    resetGame,
    restartGame,
    isDragging,
    setIsDragging,
    draggedCard,
    setDraggedCard,
    revealingCard,
    clearReveal,
  } = useGameState();

  const handleStartGame = (config: GameConfig) => {
    startGame(config);
  };

  const handleRestart = () => {
    restartGame();
  };

  const handleNewGame = () => {
    resetGame();
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-hand text-4xl text-sketch mb-4">Loading events...</div>
          <div className="animate-pulse font-hand text-xl text-sketch/60">
            Gathering history from across time
          </div>
        </div>
      </div>
    );
  }

  // Show error screen
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/90 p-8 rounded-xl shadow-sketch">
          <div className="font-hand text-3xl text-red-600 mb-4">Error Loading Events</div>
          <div className="font-hand text-lg text-sketch/70 mb-6">{loadError}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-yellow-400 rounded-lg font-hand text-xl text-sketch hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show setup screen
  if (!gameState || gameState.phase === 'setup') {
    return <GameSetup onStartGame={handleStartGame} eventCount={allEvents.length} />;
  }

  // Show game board (handles both playing and game over states)
  return (
    <GameBoard
      gameState={gameState}
      onPlaceCard={placeCard}
      onReorderHand={reorderHand}
      onRestart={handleRestart}
      onNewGame={handleNewGame}
      isDragging={isDragging}
      setIsDragging={setIsDragging}
      draggedCard={draggedCard}
      setDraggedCard={setDraggedCard}
      revealingCard={revealingCard}
      clearReveal={clearReveal}
    />
  );
};

export default App;

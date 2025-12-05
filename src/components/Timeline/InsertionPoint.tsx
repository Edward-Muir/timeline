import React from 'react';

interface InsertionPointProps {
  index: number;
  onTap: (index: number) => void;
  isVertical?: boolean;
}

const InsertionPoint: React.FC<InsertionPointProps> = ({ index, onTap, isVertical = false }) => {
  return (
    <button
      onClick={() => onTap(index)}
      className={`
        flex-shrink-0 rounded-lg
        bg-sketch/10 border-2 border-dashed border-sketch/30
        flex items-center justify-center
        active:bg-sketch/20 active:scale-95
        hover:bg-sketch/15 hover:border-sketch/50
        transition-all duration-150
        touch-manipulation
        ${isVertical
          ? 'h-10 w-full max-w-[200px]'
          : 'w-10 h-[100px] sm:w-12 sm:h-[120px] md:w-14 md:h-[160px]'
        }
      `}
      aria-label={`Place card at position ${index + 1}`}
    >
      <span className="text-sketch/50 text-2xl sm:text-3xl font-bold">+</span>
    </button>
  );
};

export default InsertionPoint;

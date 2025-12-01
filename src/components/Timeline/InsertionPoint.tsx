import React from 'react';

interface InsertionPointProps {
  index: number;
  onTap: (index: number) => void;
}

const InsertionPoint: React.FC<InsertionPointProps> = ({ index, onTap }) => {
  return (
    <button
      onClick={() => onTap(index)}
      className="
        w-10 h-[100px] sm:w-12 sm:h-[120px] md:w-14 md:h-[160px]
        flex-shrink-0 rounded-lg
        bg-blue-200/50 border-2 border-dashed border-blue-400
        flex items-center justify-center
        active:bg-blue-300/70 active:scale-95
        hover:bg-blue-300/60 hover:border-blue-500
        transition-all duration-150
        touch-manipulation
      "
      aria-label={`Place card at position ${index + 1}`}
    >
      <span className="text-blue-500 text-2xl sm:text-3xl font-bold">+</span>
    </button>
  );
};

export default InsertionPoint;

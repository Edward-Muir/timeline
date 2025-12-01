import React, { useState } from 'react';
import { HistoricalEvent } from '../types';
import { formatYear, getCategoryColorClass, getCategoryBorderColorClass } from '../utils/gameLogic';
import CategoryIcon from './CategoryIcon';

interface CardProps {
  event: HistoricalEvent;
  showYear: boolean;
  isRevealing?: boolean;
  className?: string;
  rotation?: number;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  event,
  showYear,
  isRevealing = false,
  className = '',
  rotation = 0,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const bgColor = getCategoryColorClass(event.category);
  const borderColor = getCategoryBorderColorClass(event.category);

  const rotationStyle = {
    transform: `rotate(${rotation}deg)`,
  };

  const hasImage = event.image_url && !imageError;

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden
        w-[125px] h-[167px] sm:w-[150px] sm:h-[200px] md:w-[180px] md:h-[240px]
        ${bgColor} ${borderColor}
        border-2 sm:border-4 shadow-sketch
        flex flex-col justify-between
        transition-all duration-200
        ${isRevealing ? 'reveal-year' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={rotationStyle}
      onClick={onClick}
    >
      {/* Background image or category icon */}
      {hasImage ? (
        <>
          <img
            src={event.image_url}
            alt=""
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </>
      ) : (
        /* Category icon fallback */
        <div className="absolute inset-0 flex items-center justify-center">
          <CategoryIcon category={event.category} className="text-white" />
        </div>
      )}

      {/* Paper texture overlay */}
      <div className="absolute inset-0 paper-texture pointer-events-none" />

      {/* Decorative corner flourishes */}
      <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-white/40 rounded-tl z-10" />
      <div className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-white/40 rounded-tr z-10" />
      <div className="absolute bottom-1 left-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-white/40 rounded-bl z-10" />
      <div className="absolute bottom-1 right-1 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-white/40 rounded-br z-10" />

      {/* Card content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-2 sm:p-3">
        <h3
          className="text-white text-center font-hand text-base sm:text-lg md:text-xl leading-tight"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)' }}
        >
          {event.friendly_name}
        </h3>
      </div>

      {/* Year section - revealed or hidden */}
      <div className={`
        relative z-10 mx-2 mb-2 sm:mx-3 sm:mb-3
        h-10 sm:h-12 md:h-14 rounded-md flex items-center justify-center
        ${showYear ? 'bg-white/90' : 'bg-white/20 border-2 border-dashed border-white/40'}
        transition-all duration-300
      `}>
        {showYear ? (
          <span className="font-hand text-lg sm:text-xl md:text-2xl text-sketch font-bold">
            {formatYear(event.year)}
          </span>
        ) : (
          <span className="font-hand text-white/60 text-xs sm:text-sm">
            ?
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;

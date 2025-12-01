import React, { useState } from 'react';
import { HistoricalEvent } from '../types';
import { formatYear, getCategoryColorClass } from '../utils/gameLogic';

interface EventDescriptionModalProps {
  event: HistoricalEvent;
  onClose: () => void;
  showYear?: boolean;
}

const EventDescriptionModal: React.FC<EventDescriptionModalProps> = ({ event, onClose, showYear = true }) => {
  const bgColor = getCategoryColorClass(event.category);
  const [imageError, setImageError] = useState(false);
  const hasImage = event.image_url && !imageError;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative max-w-lg w-full rounded-lg overflow-hidden
          ${bgColor} border-4 border-white/30 shadow-sketch-lg
          transform transition-all duration-200
        `}
      >
        {/* Wiki image */}
        {hasImage && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={event.image_url}
              alt={event.friendly_name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          </div>
        )}


        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 z-20
            w-10 h-10 rounded-full bg-white/80 hover:bg-white
            flex items-center justify-center
             text-2xl text-sketch
            transition-colors duration-200
          "
        >
          ×
        </button>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Title */}
          <h2
            className=" font-semibold text-3xl text-white text-center mb-3"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            {event.friendly_name}
          </h2>

          {/* Year badge */}
          {showYear && (
            <div className="flex justify-center mb-5">
              <span className="bg-white/90 px-5 py-2 rounded-full  text-xl text-sketch font-semibold">
                {formatYear(event.year)}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="bg-white/90 rounded-lg p-5 shadow-inner">
            <p className=" text-lg text-sketch leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Category badge */}
          <div className="flex justify-center mt-5">
            <span className="text-white/80  text-base capitalize tracking-wide">
              {event.category.replace(/-/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDescriptionModal;

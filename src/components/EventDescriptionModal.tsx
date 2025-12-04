import React, { useState } from 'react';
import { HistoricalEvent } from '../types';
import { formatYear } from '../utils/gameLogic';

interface EventDescriptionModalProps {
  event: HistoricalEvent;
  onClose: () => void;
  showYear?: boolean;
}

// Get category border color for the inner border
const getCategoryBorderColor = (category: string): string => {
  const colors: Record<string, string> = {
    'conflict-politics': 'bg-red-700',
    'disasters-crises': 'bg-gray-700',
    'exploration-discovery': 'bg-teal-700',
    'cultural-social': 'bg-purple-700',
    'infrastructure-construction': 'bg-amber-700',
    'diplomatic-institutional': 'bg-blue-700',
  };
  return colors[category] || 'bg-gray-700';
};

const EventDescriptionModal: React.FC<EventDescriptionModalProps> = ({ event, onClose, showYear = true }) => {
  const categoryBorderColor = getCategoryBorderColor(event.category);
  const [imageError, setImageError] = useState(false);
  const hasImage = event.image_url && !imageError;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
    >
      {/* Outer gold foil wrapper (like cards) */}
      <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-2xl max-w-lg w-full animate-entrance">
        {/* Category-colored inner border */}
        <div className={`p-1 rounded-lg ${categoryBorderColor}`}>
          {/* Cream/parchment content area */}
          <div className="bg-cream rounded-md overflow-hidden">
            {/* Close button - gold X in corner */}
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4 z-30
                w-8 h-8 flex items-center justify-center
                text-2xl font-bold text-amber-700 hover:text-amber-900
                transition-colors duration-fast
              "
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
            >
              ×
            </button>

            {/* Wiki image with overlay */}
            {hasImage && (
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.friendly_name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream" />
              </div>
            )}

            {/* Content */}
            <div className={`relative z-10 px-6 pb-6 ${hasImage ? 'pt-2' : 'pt-6'}`}>
              {/* Title */}
              <h2
                className="font-semibold text-2xl sm:text-3xl text-amber-900 text-center mb-3"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              >
                {event.friendly_name}
              </h2>

              {/* Year banner/plaque */}
              {showYear && (
                <div className="flex justify-center mb-4">
                  <div className="relative px-6 py-2 bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-600 rounded shadow-inner">
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-700 -translate-x-0.5 -translate-y-0.5" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-700 translate-x-0.5 -translate-y-0.5" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-700 -translate-x-0.5 translate-y-0.5" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-700 translate-x-0.5 translate-y-0.5" />
                    <span className="text-xl font-bold text-amber-900">
                      {formatYear(event.year)}
                    </span>
                  </div>
                </div>
              )}

              {/* Description box - warm cream with subtle border */}
              <div className="bg-[#F5F0E1] rounded-lg p-4 border border-amber-300 shadow-inner">
                <p className="text-base sm:text-lg text-amber-950 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Category badge */}
              <div className="flex justify-center mt-4">
                <span className="text-amber-700 text-sm capitalize tracking-wide">
                  {event.category.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDescriptionModal;

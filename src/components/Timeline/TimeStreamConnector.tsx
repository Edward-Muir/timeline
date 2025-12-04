import React, { useEffect, useState } from 'react';
import { HistoricalEvent } from '../../types';
import { formatYear } from '../../utils/gameLogic';

interface TimeStreamConnectorProps {
  cardCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  events?: HistoricalEvent[];
  isVertical?: boolean;
}

interface CardPosition {
  x: number;
  y: number;
  year?: number;
}

const TimeStreamConnector: React.FC<TimeStreamConnectorProps> = ({
  cardCount,
  containerRef,
  events = [],
  isVertical = false
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([]);

  useEffect(() => {
    // Don't set up observers if less than 1 card
    if (cardCount < 1) return;

    const updatePositions = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Find all timeline cards
      const cards = container.querySelectorAll('[data-timeline-card]');

      if (cards.length < 1) return;

      const positions: CardPosition[] = [];

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // Calculate center of each card relative to container
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        positions.push({
          x,
          y,
          year: events[index]?.year
        });
      });

      setCardPositions(positions);
      setDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });
    };

    // Initial calculation
    updatePositions();

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also update on scroll (for horizontal scrolling)
    const handleScroll = () => updatePositions();
    const currentRef = containerRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    // Update on window resize
    window.addEventListener('resize', updatePositions);

    return () => {
      resizeObserver.disconnect();
      currentRef?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePositions);
    };
  }, [containerRef, cardCount, events]);

  // Don't render if no cards
  if (cardCount < 1 || dimensions.width === 0) return null;

  // Calculate line positions
  const firstCard = cardPositions[0];
  const lastCard = cardPositions[cardPositions.length - 1];

  if (!firstCard || !lastCard) return null;

  // Vertical mode rendering
  if (isVertical) {
    const lineX = 24; // Fixed X position on the left side
    const lineStart = Math.max(0, firstCard.y - 40);
    const lineEnd = Math.min(dimensions.height, lastCard.y + 40);

    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {/* Main vertical timeline line */}
        <div
          className="absolute w-1 rounded-full"
          style={{
            left: lineX - 2,
            top: lineStart,
            height: lineEnd - lineStart,
            background: 'linear-gradient(180deg, rgba(120, 53, 15, 0.2) 0%, rgba(120, 53, 15, 0.7) 5%, rgba(120, 53, 15, 0.7) 95%, rgba(120, 53, 15, 0.2) 100%)',
          }}
        />

        {/* Top endcap */}
        <div
          className="absolute w-3 h-3 rounded-full border-[3px] border-amber-800 bg-cream"
          style={{
            left: lineX - 6,
            top: lineStart - 6,
          }}
        />

        {/* Bottom endcap */}
        <div
          className="absolute w-3 h-3 rounded-full border-[3px] border-amber-800 bg-cream"
          style={{
            left: lineX - 6,
            top: lineEnd - 6,
          }}
        />

        {/* Tick marks at each card position */}
        {cardPositions.map((pos, index) => (
          <div key={index} className="absolute" style={{ left: lineX, top: pos.y }}>
            {/* Tick mark - horizontal */}
            <div
              className="absolute h-[3px] w-4 bg-amber-800 rounded-sm"
              style={{
                left: -8,
                top: -1.5,
              }}
            />
            {/* Year label - to the left of the line */}
            {pos.year !== undefined && (
              <div
                className="absolute whitespace-nowrap text-[10px] font-semibold text-amber-800"
                style={{
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {formatYear(pos.year)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal mode rendering (original)
  const lineY = firstCard.y;
  const lineStart = Math.max(0, firstCard.x - 60);
  const lineEnd = Math.min(dimensions.width, lastCard.x + 60);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      {/* Main horizontal timeline line */}
      <div
        className="absolute h-1 rounded-full"
        style={{
          top: lineY - 2,
          left: lineStart,
          width: lineEnd - lineStart,
          background: 'linear-gradient(90deg, rgba(120, 53, 15, 0.2) 0%, rgba(120, 53, 15, 0.7) 5%, rgba(120, 53, 15, 0.7) 95%, rgba(120, 53, 15, 0.2) 100%)',
        }}
      />

      {/* Left endcap */}
      <div
        className="absolute w-3 h-3 rounded-full border-[3px] border-amber-800 bg-cream"
        style={{
          top: lineY - 6,
          left: lineStart - 6,
        }}
      />

      {/* Right endcap */}
      <div
        className="absolute w-3 h-3 rounded-full border-[3px] border-amber-800 bg-cream"
        style={{
          top: lineY - 6,
          left: lineEnd - 6,
        }}
      />

      {/* Tick marks at each card position */}
      {cardPositions.map((pos, index) => (
        <div key={index} className="absolute" style={{ left: pos.x, top: lineY }}>
          {/* Tick mark */}
          <div
            className="absolute w-[3px] h-4 bg-amber-800 rounded-sm"
            style={{
              left: -1.5,
              top: -8,
            }}
          />
          {/* Year label */}
          {pos.year !== undefined && (
            <div
              className="absolute whitespace-nowrap text-[10px] sm:text-xs font-semibold text-amber-800"
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                top: 12,
              }}
            >
              {formatYear(pos.year)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TimeStreamConnector;

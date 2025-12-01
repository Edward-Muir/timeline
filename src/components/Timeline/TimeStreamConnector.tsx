import React, { useRef, useEffect, useState } from 'react';

interface TimeStreamConnectorProps {
  cardCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TimeStreamConnector: React.FC<TimeStreamConnectorProps> = ({ cardCount, containerRef }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Don't set up observers if less than 2 cards
    if (cardCount < 2) return;

    const updatePositions = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Find all timeline cards
      const cards = container.querySelectorAll('[data-timeline-card]');

      if (cards.length < 2) return;

      const positions: { x: number; y: number }[] = [];

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Calculate center of each card relative to container
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        positions.push({ x, y });
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
  }, [containerRef, cardCount]);

  // Generate smooth path through card centers with slight sag
  const generatePath = () => {
    if (cardPositions.length < 2) return '';

    const points = cardPositions;
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Calculate control points for smooth curve with slight sag
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2 + 15; // Slight sag downward

      // Quadratic bezier curve through midpoint
      path += ` Q ${midX} ${midY}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Don't render if less than 2 cards
  if (cardCount < 2) return null;

  const pathD = generatePath();

  if (!pathD || dimensions.width === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none -z-10"
      width={dimensions.width}
      height={dimensions.height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Golden/amber gradient for the time stream */}
        <linearGradient id="timeStreamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="50%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#D4A574" />
        </linearGradient>

        {/* Glow filter for ethereal effect */}
        <filter id="timeStreamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0.8 0.6 0 0 0
                    0 0 0.2 0 0
                    0 0 0 0.6 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated gradient for flowing effect */}
        <linearGradient id="timeStreamAnimated" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4A574">
            <animate
              attributeName="stop-color"
              values="#D4A574;#F4D03F;#D4A574"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#F4D03F">
            <animate
              attributeName="stop-color"
              values="#F4D03F;#D4A574;#F4D03F"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#D4A574">
            <animate
              attributeName="stop-color"
              values="#D4A574;#F4D03F;#D4A574"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* Outer glow layer */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#timeStreamGradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        filter="url(#timeStreamGlow)"
      />

      {/* Main time stream path */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#timeStreamAnimated)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Inner highlight */}
      <path
        d={pathD}
        fill="none"
        stroke="#FFF8E7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  );
};

export default TimeStreamConnector;

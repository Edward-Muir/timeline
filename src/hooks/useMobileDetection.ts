import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isTouch: boolean;
  isTablet: boolean;
  useTapMode: boolean;
}

export function useMobileDetection(): MobileDetectionResult {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    const checkPointer = () => {
      // pointer: coarse indicates touch is the primary input (tablets, phones)
      // pointer: fine indicates mouse/trackpad is primary (desktops, touch laptops)
      setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    };

    checkMobile();
    checkTouch();
    checkPointer();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tablet: touch-primary device with larger screen (>= 768px)
  // Must have touch AND coarse pointer (rules out desktops with no touch)
  const isTablet = isTouch && isCoarsePointer && !isMobile;

  return {
    isMobile,
    isTouch,
    isTablet,
    // Enable tap mode for phones (small + touch) and tablets (large + touch-primary)
    // Touch laptops have fine pointers (not coarse), so they get drag mode
    useTapMode: (isMobile && isTouch) || isTablet,
  };
}

export default useMobileDetection;

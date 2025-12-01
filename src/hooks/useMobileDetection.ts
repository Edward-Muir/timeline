import { useState, useEffect } from 'react';

interface MobileDetectionResult {
  isMobile: boolean;
  isTouch: boolean;
  useTapMode: boolean;
}

export function useMobileDetection(): MobileDetectionResult {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    checkTouch();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile,
    isTouch,
    useTapMode: isMobile && isTouch,
  };
}

export default useMobileDetection;

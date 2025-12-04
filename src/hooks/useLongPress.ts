import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onShortPress?: () => void;
  threshold?: number; // Default 500ms
  moveThreshold?: number; // Default 10px - cancel if finger moves more than this
}

interface UseLongPressReturn {
  handlers: {
    onTouchStart: React.TouchEventHandler;
    onTouchEnd: React.TouchEventHandler;
    onTouchMove: React.TouchEventHandler;
    onMouseDown: React.MouseEventHandler;
    onMouseUp: React.MouseEventHandler;
    onMouseLeave: React.MouseEventHandler;
    onContextMenu: React.MouseEventHandler; // Prevent context menu on long press
  };
  isLongPressing: boolean;
}

export function useLongPress({
  onLongPress,
  onShortPress,
  threshold = 500,
  moveThreshold = 10,
}: UseLongPressOptions): UseLongPressReturn {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef(false);
  const isTouchRef = useRef(false); // Track if interaction started with touch

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const start = useCallback(
    (x: number, y: number) => {
      console.log('[useLongPress] start', { x, y });
      startPosRef.current = { x, y };
      longPressTriggeredRef.current = false;
      setIsLongPressing(true);

      timeoutRef.current = setTimeout(() => {
        console.log('[useLongPress] long press triggered');
        longPressTriggeredRef.current = true;
        setIsLongPressing(false);
        onLongPress();
      }, threshold);
    },
    [onLongPress, threshold]
  );

  const end = useCallback(() => {
    const wasCancelled = startPosRef.current === null;
    console.log('[useLongPress] end', {
      wasCancelled,
      longPressTriggered: longPressTriggeredRef.current,
    });
    clear();

    // Only trigger short press if not cancelled and long press wasn't triggered
    if (!wasCancelled && !longPressTriggeredRef.current && onShortPress) {
      console.log('[useLongPress] calling onShortPress');
      onShortPress();
    }

    startPosRef.current = null;
  }, [clear, onShortPress]);

  const move = useCallback(
    (x: number, y: number) => {
      if (!startPosRef.current) return;

      const deltaX = Math.abs(x - startPosRef.current.x);
      const deltaY = Math.abs(y - startPosRef.current.y);

      // Cancel long press if finger moved too much (allows scrolling)
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        console.log('[useLongPress] cancelled due to movement', { deltaX, deltaY, moveThreshold });
        clear();
        startPosRef.current = null;
      }
    },
    [clear, moveThreshold]
  );

  const onTouchStart: React.TouchEventHandler = useCallback(
    (e) => {
      isTouchRef.current = true; // Mark as touch interaction
      const touch = e.touches[0];
      start(touch.clientX, touch.clientY);
    },
    [start]
  );

  const onTouchEnd: React.TouchEventHandler = useCallback(() => {
    end();
    // Reset touch flag after a short delay to allow mouse events to be ignored
    setTimeout(() => {
      isTouchRef.current = false;
    }, 100);
  }, [end]);

  const onTouchMove: React.TouchEventHandler = useCallback(
    (e) => {
      const touch = e.touches[0];
      move(touch.clientX, touch.clientY);
    },
    [move]
  );

  const onMouseDown: React.MouseEventHandler = useCallback(
    (e) => {
      // Skip if this is a synthesized mouse event after touch
      if (isTouchRef.current) return;
      start(e.clientX, e.clientY);
    },
    [start]
  );

  const onMouseUp: React.MouseEventHandler = useCallback(() => {
    // Skip if this is a synthesized mouse event after touch
    if (isTouchRef.current) return;
    end();
  }, [end]);

  const onMouseLeave: React.MouseEventHandler = useCallback(() => {
    clear();
    startPosRef.current = null;
  }, [clear]);

  const onContextMenu: React.MouseEventHandler = useCallback((e) => {
    // Prevent context menu on long press (especially on iOS Safari)
    e.preventDefault();
  }, []);

  return {
    handlers: {
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onContextMenu,
    },
    isLongPressing,
  };
}

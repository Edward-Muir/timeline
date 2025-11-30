import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DropPosition } from '../../types';

interface DropZoneProps {
  position: DropPosition;
  isActive: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ position, isActive }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${position.index}`,
  });

  if (!isActive) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-shrink-0 w-20 h-48 mx-1
        flex items-center justify-center
        rounded-lg border-4 border-dashed
        transition-all duration-200
        ${isOver
          ? 'border-blue-500 bg-blue-100/50 scale-105'
          : 'border-gray-400/50 bg-gray-100/30'
        }
      `}
    >
      <div className={`
        text-4xl font-hand
        transition-all duration-200
        ${isOver ? 'text-blue-500 scale-125' : 'text-gray-400'}
      `}>
        +
      </div>
    </div>
  );
};

export default DropZone;

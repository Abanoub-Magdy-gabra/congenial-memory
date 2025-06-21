import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit, Eye, MoreHorizontal } from 'lucide-react';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
  onClick: () => void;
}

interface MobileSwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right', distance: number) => void;
  swipeThreshold?: number;
  className?: string;
  disabled?: boolean;
}

const MobileSwipeableCard: React.FC<MobileSwipeableCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
  swipeThreshold = 80,
  className = '',
  disabled = false
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showActions, setShowActions] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const maxSwipe = 120;

  const getActionColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'gray':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    
    // Limit swipe distance
    const limitedDeltaX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setTranslateX(limitedDeltaX);

    // Show actions when swiping
    if (Math.abs(limitedDeltaX) > 20) {
      if (limitedDeltaX > 0 && leftActions.length > 0) {
        setShowActions('left');
      } else if (limitedDeltaX < 0 && rightActions.length > 0) {
        setShowActions('right');
      }
    } else {
      setShowActions(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    
    // Trigger action if swipe threshold is met
    if (Math.abs(translateX) > swipeThreshold) {
      if (onSwipe) {
        onSwipe(translateX > 0 ? 'left' : 'right', Math.abs(translateX));
      }
    }
    
    // Reset position
    setTranslateX(0);
    setShowActions(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || disabled) return;
    
    const deltaX = e.clientX - startX;
    const limitedDeltaX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    setTranslateX(limitedDeltaX);

    if (Math.abs(limitedDeltaX) > 20) {
      if (limitedDeltaX > 0 && leftActions.length > 0) {
        setShowActions('left');
      } else if (limitedDeltaX < 0 && rightActions.length > 0) {
        setShowActions('right');
      }
    } else {
      setShowActions(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    
    if (Math.abs(translateX) > swipeThreshold) {
      if (onSwipe) {
        onSwipe(translateX > 0 ? 'left' : 'right', Math.abs(translateX));
      }
    }
    
    setTranslateX(0);
    setShowActions(null);
  };

  // Reset on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setTranslateX(0);
        setShowActions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          {leftActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                h-full px-4 flex flex-col items-center justify-center min-w-[60px]
                ${getActionColor(action.color)}
                transition-all duration-200
                ${showActions === 'left' ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transform: `translateX(${showActions === 'left' ? 0 : -100}%)`,
                transitionDelay: `${index * 50}ms`
              }}
            >
              <action.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          {rightActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                h-full px-4 flex flex-col items-center justify-center min-w-[60px]
                ${getActionColor(action.color)}
                transition-all duration-200
                ${showActions === 'right' ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transform: `translateX(${showActions === 'right' ? 0 : 100}%)`,
                transitionDelay: `${index * 50}ms`
              }}
            >
              <action.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className={`
          relative z-10 bg-white transition-transform duration-200
          ${isDragging ? 'transition-none' : ''}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab'}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{
          transform: `translateX(${translateX}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>

      {/* Swipe Indicator */}
      {isDragging && Math.abs(translateX) > 20 && (
        <div className="absolute top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
          {translateX > 0 && leftActions.length > 0 && (
            <div className="right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              اسحب للمزيد ←
            </div>
          )}
          {translateX < 0 && rightActions.length > 0 && (
            <div className="left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              → اسحب للمزيد
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileSwipeableCard;
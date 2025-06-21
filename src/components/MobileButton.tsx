import React, { useState, useRef, useEffect } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  hapticFeedback?: boolean;
  ripple?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  hapticFeedback = true,
  ripple = true,
  type = 'button',
  ariaLabel
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  // Haptic feedback
  const triggerHaptic = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }
  };

  // Ripple effect
  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (!ripple || disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newRipple = {
      id: rippleId.current++,
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const handlePress = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled || loading) return;

    setIsPressed(true);
    createRipple(event);
    triggerHaptic();

    if (onClick) {
      onClick();
    }
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  // Clean up ripples on unmount
  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);

  // Variant styles
  const getVariantStyles = () => {
    const baseStyles = 'font-medium transition-all duration-200 touch-manipulation relative overflow-hidden';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl active:shadow-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'
        }`;
      case 'secondary':
        return `${baseStyles} bg-white text-gray-700 border border-gray-300 shadow-sm hover:shadow-md active:shadow-sm ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'
        }`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl active:shadow-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'
        }`;
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg hover:shadow-xl active:shadow-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-700 hover:to-yellow-800'
        }`;
      case 'danger':
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl active:shadow-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800'
        }`;
      case 'ghost':
        return `${baseStyles} bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`;
      default:
        return baseStyles;
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm rounded-lg min-h-[36px]';
      case 'md':
        return 'px-4 py-3 text-base rounded-xl min-h-[44px]';
      case 'lg':
        return 'px-6 py-4 text-lg rounded-xl min-h-[52px]';
      case 'xl':
        return 'px-8 py-5 text-xl rounded-2xl min-h-[60px]';
      default:
        return 'px-4 py-3 text-base rounded-xl min-h-[44px]';
    }
  };

  const buttonClasses = `
    ${getVariantStyles()}
    ${getSizeStyles()}
    ${fullWidth ? 'w-full' : ''}
    ${isPressed ? 'scale-95' : 'scale-100'}
    ${className}
    flex items-center justify-center
  `;

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '0.6s'
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center justify-center space-x-2 space-x-reverse ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && iconPosition === 'left' && (
          <Icon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`} />
        )}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && (
          <Icon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}`} />
        )}
      </div>
    </button>
  );
};

export default MobileButton;
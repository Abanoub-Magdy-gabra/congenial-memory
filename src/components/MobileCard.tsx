import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  loading?: boolean;
  disabled?: boolean;
  badge?: string | number;
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray';
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  onClick,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false,
  disabled = false,
  badge,
  badgeColor = 'red'
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled || loading || !onClick) return;
    setIsPressed(true);
    onClick();
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-lg border border-gray-100';
      case 'outlined':
        return 'bg-white border-2 border-gray-200 shadow-sm';
      case 'filled':
        return 'bg-gray-50 border border-gray-200';
      default:
        return 'bg-white shadow-sm border border-gray-200';
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-3 rounded-lg';
      case 'md':
        return 'p-4 rounded-xl';
      case 'lg':
        return 'p-6 rounded-2xl';
      default:
        return 'p-4 rounded-xl';
    }
  };

  // Get badge color styles
  const getBadgeStyles = () => {
    switch (badgeColor) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'gray':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-red-500 text-white';
    }
  };

  const cardClasses = `
    ${getVariantStyles()}
    ${getSizeStyles()}
    ${interactive || onClick ? 'cursor-pointer touch-manipulation' : ''}
    ${interactive || onClick ? 'hover:shadow-md active:shadow-sm' : ''}
    ${isPressed ? 'scale-98' : 'scale-100'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    transition-all duration-200
    relative
    ${className}
  `;

  const CardContent = () => (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      {(title || subtitle || Icon || badge) && (
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 space-x-reverse flex-1">
            {Icon && (
              <div className={`flex-shrink-0 ${
                size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
              } bg-blue-100 rounded-lg flex items-center justify-center`}>
                <Icon className={`${
                  size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
                } text-blue-600`} />
              </div>
            )}
            
            {(title || subtitle) && (
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className={`font-semibold text-gray-900 truncate ${
                    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                  }`}>
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className={`text-gray-600 truncate ${
                    size === 'sm' ? 'text-xs' : 'text-sm'
                  }`}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Badge */}
          {badge && (
            <div className={`
              flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
              ${getBadgeStyles()}
              ${size === 'sm' ? 'text-xs' : 'text-sm'}
            `}>
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={loading ? 'opacity-50' : ''}>
        {children}
      </div>
    </>
  );

  if (interactive || onClick) {
    return (
      <div
        className={cardClasses}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <CardContent />
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <CardContent />
    </div>
  );
};

export default MobileCard;
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import MobileButton from './MobileButton';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm mx-4';
      case 'md':
        return 'max-w-md mx-4';
      case 'lg':
        return 'max-w-lg mx-4';
      case 'xl':
        return 'max-w-2xl mx-4';
      case 'full':
        return 'w-full h-full m-0 rounded-none';
      default:
        return 'max-w-md mx-4';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white shadow-2xl transform transition-all duration-300
            ${getSizeStyles()}
            ${size === 'full' ? 'rounded-none' : 'rounded-2xl'}
            ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
            ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              )}
              {showCloseButton && (
                <MobileButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2 -mr-2"
                  ariaLabel="إغلاق"
                >
                  <X className="h-5 w-5" />
                </MobileButton>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`${size === 'full' ? 'flex-1 overflow-y-auto' : ''} p-6`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end space-x-3 space-x-reverse p-6 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileModal;
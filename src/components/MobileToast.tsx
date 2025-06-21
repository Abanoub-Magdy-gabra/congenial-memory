import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  position?: 'top' | 'bottom';
}

const MobileToast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show toast
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide toast
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'border-l-4';
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-500`;
    }
  };

  return (
    <div
      className={`
        fixed left-4 right-4 z-50 transform transition-all duration-300 ease-in-out
        ${position === 'top' ? 'top-20' : 'bottom-20'}
        ${isVisible && !isExiting ? 'translate-y-0 opacity-100' : 
          position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'}
      `}
    >
      <div className={`
        ${getStyles()}
        rounded-lg shadow-lg p-4 mx-auto max-w-sm
        backdrop-blur-sm bg-opacity-95
      `}>
        <div className="flex items-start space-x-3 space-x-reverse">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-600">
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 touch-manipulation"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileToast;
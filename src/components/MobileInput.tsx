import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface MobileInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  validation?: (value: string) => string | null;
  showCharCount?: boolean;
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MobileInput: React.FC<MobileInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  type = 'text',
  disabled = false,
  required = false,
  error,
  success = false,
  icon: Icon,
  iconPosition = 'left',
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
  className = '',
  inputMode,
  validation,
  showCharCount = false,
  clearable = false,
  size = 'md'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate input
  useEffect(() => {
    if (validation && value) {
      const errorMessage = validation(value);
      setValidationError(errorMessage);
    } else {
      setValidationError(null);
    }
  }, [value, validation]);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Apply maxLength constraint
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine input type
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm min-h-[36px]';
      case 'md':
        return 'px-4 py-3 text-base min-h-[44px]';
      case 'lg':
        return 'px-5 py-4 text-lg min-h-[52px]';
      default:
        return 'px-4 py-3 text-base min-h-[44px]';
    }
  };

  // Get border styles
  const getBorderStyles = () => {
    if (error || validationError) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    if (success && value && !validationError) {
      return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    }
    if (isFocused) {
      return 'border-blue-500 focus:border-blue-500 focus:ring-blue-500';
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const displayError = error || validationError;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} text-gray-400`} />
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          inputMode={inputMode}
          className={`
            w-full rounded-xl border-2 transition-all duration-200 
            ${getSizeStyles()}
            ${getBorderStyles()}
            ${Icon && iconPosition === 'left' ? 'pr-10' : ''}
            ${(Icon && iconPosition === 'right') || type === 'password' || clearable ? 'pl-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder-gray-400
            touch-manipulation
          `}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${label}-error` : undefined}
        />

        {/* Right Icons */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 space-x-reverse">
          {/* Success Icon */}
          {success && value && !displayError && (
            <Check className="h-5 w-5 text-green-500" />
          )}

          {/* Error Icon */}
          {displayError && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}

          {/* Clear Button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
              aria-label="مسح النص"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          )}

          {/* Right Icon */}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} text-gray-400`} />
          )}
        </div>
      </div>

      {/* Character Count */}
      {showCharCount && maxLength && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{value.length}/{maxLength}</span>
          {value.length > maxLength * 0.8 && (
            <span className={value.length >= maxLength ? 'text-red-500' : 'text-yellow-500'}>
              {maxLength - value.length} متبقي
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <p id={`${label}-error`} className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 ml-1 flex-shrink-0" />
          {displayError}
        </p>
      )}

      {/* Success Message */}
      {success && value && !displayError && (
        <p className="text-sm text-green-600 flex items-center">
          <Check className="h-4 w-4 ml-1 flex-shrink-0" />
          تم التحقق بنجاح
        </p>
      )}
    </div>
  );
};

export default MobileInput;
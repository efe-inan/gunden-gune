import React from 'react';
import { Input } from './Input';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { Dropdown } from './Dropdown';

interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-400">
          {label}
          {required && <span className="text-error-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <p
          className={`text-xs ${error ? 'text-error-400' : 'text-text-100'
            }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-4 ${className}`}>
      {children}
    </form>
  );
};

interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-text-400 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-text-100">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'space-between';
  className?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className = '',
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  return (
    <div className={`flex items-center gap-2 ${alignments[align]} ${className}`}>
      {children}
    </div>
  );
};

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: { width: 'w-8', height: 'h-4', circle: 'w-3 h-3' },
    md: { width: 'w-11', height: 'h-6', circle: 'w-5 h-5' },
    lg: { width: 'w-14', height: 'h-7', circle: 'w-6 h-6' },
  };

  return (
    <label className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative
          ${sizes[size].width}
          ${sizes[size].height}
          rounded-full
          transition-colors
          duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${checked ? 'bg-primary-500' : 'bg-background-400'}
        `}
      >
        <span
          className={`
            absolute
            top-0.5
            ${sizes[size].circle}
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            duration-200
            ${checked ? 'translate-x-full' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className={`text-sm ${disabled ? 'text-text-100' : 'text-text-400'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
  className = '',
}) => {
  // Using inline style for the gradient background since it depends on the value
  const percentage = ((value - min) / (max - min)) * 100;
  // We can't really use Tailwind for the dynamic gradient percentage easily without style tag or CSS variable
  // but we can use Tailwind colors for the parts.
  // We'll stick to style for the gradient stops but use Tailwind color variables if possible or just hex if we must.
  // Actually, since we replaced colors with Tailwind classes, we might need to map them back to hex for the gradient
  // OR just use a simple background and a progress bar overlay which is cleaner.
  // But let's keep the style approach but try to access CSS variables if they existed. 
  // Since we don't have CSS variables for colors readily available in JS without `colors.ts`, 
  // we might need to keep using `colors.ts` just for this inline style or import it.
  // Wait, I removed `colors` import. I should re-add it ONLY for this specific inline style use case, 
  // OR better: rewrite the slider to use a div overlay like ProgressBar so we can use Tailwind classes.
  // Rewrite to use div overlay is better for consistency.

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-400">
            {label}
          </label>
          {showValue && (
            <span className="text-sm text-text-300">
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative h-2 bg-background-400 rounded-lg">
        <div
          className="absolute top-0 left-0 h-full bg-primary-500 rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {/* Custom thumb could be added here if needed, but opacity-0 input covers interaction */}
      </div>
    </div>
  );
};

interface FileUploadProps {
  files?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files = [],
  onChange,
  accept,
  multiple = false,
  maxSize,
  error,
  disabled = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (maxSize) {
      const validFiles = droppedFiles.filter(file => file.size <= maxSize);
      onChange?.(validFiles);
    } else {
      onChange?.(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (maxSize) {
      const validFiles = selectedFiles.filter(file => file.size <= maxSize);
      onChange?.(validFiles);
    } else {
      onChange?.(selectedFiles);
    }
  };

  const borderColor = error
    ? 'border-error-400'
    : isDragging
      ? 'border-primary-500 bg-primary-50'
      : 'border-background-400';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative
          border-2
          border-dashed
          rounded-lg
          p-6
          text-center
          transition-colors
          duration-200
          ${borderColor}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <svg
          className="w-12 h-12 mx-auto mb-3 text-text-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm font-medium text-text-400">
          Drop files here or click to upload
        </p>
        {maxSize && (
          <p className="text-xs text-text-100 mt-1">
            Max file size: {(maxSize / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-error-400">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-background-200 rounded-md"
            >
              <span className="text-sm text-text-400 truncate">
                {file.name}
              </span>
              <span className="text-xs text-text-100">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
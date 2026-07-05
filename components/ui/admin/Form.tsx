import { InputHTMLAttributes, SelectHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = props.id || generatedId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-soft-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
          error ? 'border-error' : 'border-border'
        } ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = '', ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = props.id || generatedId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-soft-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
          error ? 'border-error' : 'border-border'
        } ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

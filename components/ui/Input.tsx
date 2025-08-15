import * as React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

const baseFieldStyles =
  'block w-full rounded-md border border-blue-200 bg-white/70 focus:bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition disabled:opacity-60 disabled:cursor-not-allowed dark:border-blue-700/40 dark:bg-blue-900/40 dark:focus:bg-blue-900';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, required, wrapperClassName, ...rest }, ref) => {
    const inputId = id || rest.name || React.useId();
    return (
      <div className={clsx('space-y-1', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300"
          >
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={clsx(baseFieldStyles, error && 'border-red-400 focus:border-red-400 focus:ring-red-400', className)}
          required={required}
          {...rest}
        />
        {(hint || error) && (
          <p
            id={hint ? `${inputId}-hint` : undefined}
            className={clsx('text-[11px] leading-tight', error ? 'text-red-600 dark:text-red-400' : 'text-blue-500/80 dark:text-blue-300/70')}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;

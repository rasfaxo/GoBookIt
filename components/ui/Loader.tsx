import React from 'react';

interface LoaderProps {
  size?: number; // px
  stroke?: number; // border width
  className?: string;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 32, stroke = 3, className = '', label }) => {
  const dim = size + 'px';
  const style: React.CSSProperties = {
    width: dim,
    height: dim,
    borderWidth: stroke,
  };
  return (
    <div className={`flex flex-col items-center justify-center ${className}`.trim()} role="status" aria-live="polite">
      <span
        className="animate-spin rounded-full border-blue-600 border-t-transparent border-solid"
        style={style}
      />
      {label && <span className="mt-2 text-xs font-medium text-blue-600">{label}</span>}
    </div>
  );
};

export default Loader;

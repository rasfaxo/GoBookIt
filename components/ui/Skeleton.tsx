import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', rounded = 'rounded-md' }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-blue-900/40',
        rounded,
        className
      )}
      aria-hidden
    />
  );
};
export default Skeleton;

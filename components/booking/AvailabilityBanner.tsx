"use client";
import React from 'react';
import { STRINGS } from '@/constants/strings';
import clsx from 'clsx';

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

interface AvailabilityBannerProps {
  status: AvailabilityStatus;
  isRangeValid: boolean;
  className?: string;
}

const textFor = (status: AvailabilityStatus, isRangeValid: boolean) => {
  if (!isRangeValid) return STRINGS.bookings.dateRangeInvalid;
  switch (status) {
    case 'checking':
      return STRINGS.bookings.availabilityChecking;
    case 'available':
      return STRINGS.bookings.availabilityAvailable;
    case 'unavailable':
      return STRINGS.bookings.availabilityUnavailable;
    case 'error':
      return STRINGS.bookings.availabilityError;
    case 'idle':
    default:
      return '—';
  }
};

export const AvailabilityBanner: React.FC<AvailabilityBannerProps> = ({ status, isRangeValid, className }) => {
  const baseColor = !isRangeValid
    ? 'text-red-600 dark:text-red-400'
    : status === 'available'
      ? 'text-green-600 dark:text-green-400'
      : status === 'unavailable'
        ? 'text-red-600 dark:text-red-400'
        : status === 'error'
          ? 'text-amber-600 dark:text-amber-400'
          : status === 'checking'
            ? 'text-blue-600 animate-pulse'
            : 'text-blue-600/70';
  return (
    <div
      className={clsx('rounded-md border border-blue-100 bg-white/60 dark:bg-blue-900/30 dark:border-blue-800 px-3 py-2 text-[12px] font-medium flex items-center gap-2', className)}
      aria-live="polite"
    >
      <span className={baseColor}>{textFor(status, isRangeValid)}</span>
    </div>
  );
};

export default AvailabilityBanner;

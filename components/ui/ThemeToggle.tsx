"use client";
import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="text-xs font-semibold px-3 py-2 rounded-md border border-blue-200 bg-white/70 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 transition"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
};
export default ThemeToggle;

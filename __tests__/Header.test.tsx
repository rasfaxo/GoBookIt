import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dependencies BEFORE importing the component
jest.mock('@/services/auth/destroySession', () => ({
  __esModule: true,
  default: jest.fn(async () => ({ success: true })),
}));
// Mock auth hook from context directly
jest.mock('@/lib/context/authContext', () => ({
  __esModule: true,
  useAuth: () => ({ isAuthenticated: false, setIsAuthenticated: jest.fn() }),
}));
// Mock BookingForm (re-exported in components index) to avoid server-only imports during Header test
// Mock components barrel to avoid pulling server actions; only provide ThemeToggle used by Header
jest.mock('@/components', () => ({
  __esModule: true,
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('renders brand name', () => {
    render(<Header />);
  expect(screen.getByAltText(/GoBookIt/i)).toBeInTheDocument();
  });
});

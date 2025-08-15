import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dependencies BEFORE importing the component
jest.mock('@/services/auth/destroySession', () => ({
  __esModule: true,
  default: jest.fn(async () => ({ success: true })),
}));
jest.mock('@/hooks', () => ({
  useAuth: () => ({ isAuthenticated: false, setIsAuthenticated: jest.fn() }),
}));
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('renders brand name', () => {
    render(<Header />);
    expect(screen.getByText(/GoBookIt/i)).toBeInTheDocument();
  });
});

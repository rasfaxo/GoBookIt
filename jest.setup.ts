import '@testing-library/jest-dom';

// Mock next/navigation for components using useRouter in tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

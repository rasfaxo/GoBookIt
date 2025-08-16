import '@testing-library/jest-dom';

// Mock next/navigation for components using useRouter in tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// Polyfill TextEncoder/TextDecoder for libraries (Next.js / whatwg)
import { TextEncoder, TextDecoder } from 'util';
// @ts-expect-error assigning polyfill if missing
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

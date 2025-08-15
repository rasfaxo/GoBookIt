import '@testing-library/jest-dom';

// Mock next/navigation for components using useRouter in tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// Polyfill TextEncoder/TextDecoder for libraries (Next.js / whatwg)
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as any;

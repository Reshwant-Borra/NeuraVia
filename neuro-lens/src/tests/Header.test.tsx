import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { vi, describe, it, expect } from 'vitest';

// Mock the store
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn((selector: (state: { isOnline: boolean }) => boolean) => {
    const state = {
      isOnline: true,
    };
    return selector(state);
  }),
}));

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText('Neuro Lens')).toBeInTheDocument();
  });

  it('renders the assessments link', () => {
    render(<Header />);
    expect(screen.getByText('Assessments')).toBeInTheDocument();
  });

  it('shows online status when connected', () => {
    render(<Header />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });
});

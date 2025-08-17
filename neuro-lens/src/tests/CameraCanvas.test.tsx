import { render, screen } from '@testing-library/react';
import { CameraCanvas } from '@/components/CameraCanvas';
import { vi, describe, it, expect } from 'vitest';

// Mock MediaPipe
vi.mock('@mediapipe/tasks-vision', () => ({
  PoseLandmarker: {
    createFromOptions: vi.fn().mockResolvedValue({
      detectForVideo: vi.fn().mockResolvedValue({
        landmarks: [[
          { x: 0.5, y: 0.5, z: 0, visibility: 0.9 },
          { x: 0.6, y: 0.6, z: 0, visibility: 0.8 },
        ]]
      })
    })
  },
  FilesetResolver: {
    forVisionTasks: vi.fn().mockResolvedValue({})
  }
}));

// Mock getUserMedia
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }]
    })
  },
  writable: true
});

describe('CameraCanvas', () => {
  it('renders camera interface', () => {
    render(<CameraCanvas />);
    expect(screen.getByText('Live Pose Detection')).toBeInTheDocument();
  });

  it('shows initial quality status', () => {
    render(<CameraCanvas />);
    expect(screen.getByText(/Initializing/)).toBeInTheDocument();
  });

  it('renders control buttons', () => {
    render(<CameraCanvas />);
    expect(screen.getByText('Hide Overlay')).toBeInTheDocument();
    expect(screen.getByText('Reset Smoothing')).toBeInTheDocument();
  });
});

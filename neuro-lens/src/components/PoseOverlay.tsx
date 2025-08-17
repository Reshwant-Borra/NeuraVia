'use client';

import { useEffect, useRef } from 'react';
import { PoseLandmark } from '@/lib/utils/math';

interface PoseOverlayProps {
  landmarks: PoseLandmark[];
  width: number;
  height: number;
  showConnections?: boolean;
  showLandmarks?: boolean;
  landmarkColor?: string;
  connectionColor?: string;
  landmarkSize?: number;
  connectionWidth?: number;
}

// Pose landmark connections (MediaPipe pose model)
const POSE_CONNECTIONS = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10], [11, 12],
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Left arm
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [19, 21],
  // Right arm
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [20, 22],
  // Left leg
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  // Right leg
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
];

export function PoseOverlay({
  landmarks,
  width,
  height,
  showConnections = true,
  showLandmarks = true,
  landmarkColor = '#00ff00',
  connectionColor = '#ffffff',
  landmarkSize = 4,
  connectionWidth = 2,
}: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks || landmarks.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    if (showConnections) {
      ctx.strokeStyle = connectionColor;
      ctx.lineWidth = connectionWidth;
      ctx.lineCap = 'round';

      for (const [start, end] of POSE_CONNECTIONS) {
        const startLandmark = landmarks[start];
        const endLandmark = landmarks[end];

        if (startLandmark && endLandmark && 
            startLandmark.visibility && endLandmark.visibility &&
            startLandmark.visibility > 0.3 && endLandmark.visibility > 0.3) {
          
          ctx.beginPath();
          ctx.moveTo(startLandmark.x * width, startLandmark.y * height);
          ctx.lineTo(endLandmark.x * width, endLandmark.y * height);
          ctx.stroke();
        }
      }
    }

    // Draw landmarks
    if (showLandmarks) {
      ctx.fillStyle = landmarkColor;
      
      for (const landmark of landmarks) {
        if (landmark.visibility && landmark.visibility > 0.3) {
          const x = landmark.x * width;
          const y = landmark.y * height;
          
          ctx.beginPath();
          ctx.arc(x, y, landmarkSize, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }, [
    landmarks,
    width,
    height,
    showConnections,
    showLandmarks,
    landmarkColor,
    connectionColor,
    landmarkSize,
    connectionWidth,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

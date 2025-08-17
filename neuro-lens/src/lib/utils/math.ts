export interface Point {
  x: number;
  y: number;
  z?: number;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

// Exponential Moving Average (EMA) smoothing
export class EMASmoother {
  private alpha: number;
  private lastValue: Point | null = null;

  constructor(alpha: number = 0.3) {
    this.alpha = Math.max(0, Math.min(1, alpha)); // Clamp between 0 and 1
  }

  smooth(point: Point): Point {
    if (!this.lastValue) {
      this.lastValue = { ...point };
      return point;
    }

    const smoothed: Point = {
      x: this.alpha * point.x + (1 - this.alpha) * this.lastValue.x,
      y: this.alpha * point.y + (1 - this.alpha) * this.lastValue.y,
    };

    if (point.z !== undefined && this.lastValue.z !== undefined) {
      smoothed.z = this.alpha * point.z + (1 - this.alpha) * this.lastValue.z;
    }

    this.lastValue = smoothed;
    return smoothed;
  }

  reset(): void {
    this.lastValue = null;
  }
}

// One-Euro Filter for pose smoothing
export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xFilter: LowPassFilter;
  private dxFilter: LowPassFilter;
  private lastTime: number | null = null;

  constructor(minCutoff: number = 1.0, beta: number = 0.0, dCutoff: number = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xFilter = new LowPassFilter();
    this.dxFilter = new LowPassFilter();
  }

  filter(value: Point, timestamp: number): Point {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
      return value;
    }

    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (dt <= 0) {
      return value;
    }

    // Estimate velocity
    const dx = {
      x: (value.x - this.xFilter.lastValue.x) / dt,
      y: (value.y - this.xFilter.lastValue.y) / dt,
      z: value.z !== undefined && this.xFilter.lastValue.z !== undefined 
        ? (value.z - this.xFilter.lastValue.z) / dt 
        : 0,
    };

    // Smooth velocity
    const smoothedDx = {
      x: this.dxFilter.filter(dx.x, this.getAlpha(this.dCutoff, dt)),
      y: this.dxFilter.filter(dx.y, this.getAlpha(this.dCutoff, dt)),
      z: this.dxFilter.filter(dx.z, this.getAlpha(this.dCutoff, dt)),
    };

    // Calculate adaptive cutoff
    const cutoff = this.minCutoff + this.beta * Math.sqrt(
      smoothedDx.x * smoothedDx.x + smoothedDx.y * smoothedDx.y + smoothedDx.z * smoothedDx.z
    );

    // Smooth position
    const smoothed: Point = {
      x: this.xFilter.filter(value.x, this.getAlpha(cutoff, dt)),
      y: this.xFilter.filter(value.y, this.getAlpha(cutoff, dt)),
    };

    if (value.z !== undefined) {
      smoothed.z = this.xFilter.filter(value.z, this.getAlpha(cutoff, dt));
    }

    return smoothed;
  }

  private getAlpha(cutoff: number, dt: number): number {
    const tau = 1.0 / (2.0 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / dt);
  }

  reset(): void {
    this.xFilter.reset();
    this.dxFilter.reset();
    this.lastTime = null;
  }
}

// Low-pass filter for One-Euro Filter
class LowPassFilter {
  public lastValue: Point = { x: 0, y: 0, z: 0 };
  private initialized: boolean = false;

  filter(value: number, alpha: number): number {
    if (!this.initialized) {
      this.lastValue = { x: value, y: value, z: value };
      this.initialized = true;
      return value;
    }

    return alpha * value + (1 - alpha) * this.lastValue.x;
  }

  reset(): void {
    this.initialized = false;
    this.lastValue = { x: 0, y: 0, z: 0 };
  }
}

// Pose quality assessment
export function assessPoseQuality(landmarks: PoseLandmark[]): {
  quality: 'red' | 'amber' | 'green';
  score: number;
  reason: string;
} {
  if (!landmarks || landmarks.length === 0) {
    return {
      quality: 'red',
      score: 0,
      reason: 'No landmarks detected'
    };
  }

  // Check if we have the expected 33 landmarks
  if (landmarks.length < 33) {
    return {
      quality: 'red',
      score: 0.1,
      reason: `Incomplete pose: ${landmarks.length}/33 landmarks`
    };
  }

  // Check visibility of key landmarks (nose, shoulders, hips)
  const keyLandmarks = [0, 11, 12, 23, 24];
  const visibleLandmarks = keyLandmarks.filter(i => 
    landmarks[i] && landmarks[i].visibility && landmarks[i].visibility > 0.3
  );

  if (visibleLandmarks.length < 3) {
    return {
      quality: 'red',
      score: 0.2,
      reason: `Insufficient key landmarks visible: ${visibleLandmarks.length}/5`
    };
  }

  // Calculate overall visibility score
  const totalVisibility = landmarks.reduce((sum, landmark) => 
    sum + (landmark.visibility || 0), 0
  );
  const avgVisibility = totalVisibility / landmarks.length;

  // Calculate pose confidence based on visibility
  let confidenceScore = avgVisibility;

  // Bonus for having all key landmarks visible
  if (visibleLandmarks.length === 5) {
    confidenceScore += 0.2;
  }

  // Determine quality based on confidence
  if (confidenceScore > 0.7) {
    return {
      quality: 'green',
      score: Math.min(1, confidenceScore),
      reason: 'High confidence pose detected'
    };
  } else if (confidenceScore > 0.4) {
    return {
      quality: 'amber',
      score: confidenceScore,
      reason: 'Moderate confidence pose'
    };
  } else {
    return {
      quality: 'red',
      score: confidenceScore,
      reason: 'Low confidence pose'
    };
  }
}

// Utility function to calculate distance between two points
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Utility function to calculate angle between three points
export function calculateAngle(p1: Point, p2: Point, p3: Point): number {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  const dot = v1.x * v2.x + v1.y * v2.y;
  const det = v1.x * v2.y - v1.y * v2.x;
  
  return Math.atan2(det, dot) * (180 / Math.PI);
}

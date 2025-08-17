export interface TremorResult {
  frequency: number;
  amplitude: number;
  confidence: number;
}

export interface WristDataPoint {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Analyze tremor data to detect frequency and amplitude
 * @param wristData Array of wrist position data points
 * @returns TremorResult with frequency, amplitude, and confidence
 */
export async function analyzeTremor(wristData: WristDataPoint[]): Promise<TremorResult> {
  if (wristData.length < 100) {
    throw new Error('Insufficient data points for analysis (minimum 100 required)');
  }

  // Extract dominant axis motion (x or y with higher variance)
  const xVariance = calculateVariance(wristData.map(d => d.x));
  const yVariance = calculateVariance(wristData.map(d => d.y));
  
  const dominantAxis = xVariance > yVariance ? 'x' : 'y';
  const motionData = wristData.map(d => d[dominantAxis as keyof WristDataPoint] as number);
  
  // Calculate sampling rate
  const timeSpan = wristData[wristData.length - 1].timestamp - wristData[0].timestamp;
  const samplingRate = (wristData.length - 1) / (timeSpan / 1000); // Hz
  
  // Detrend the data (remove linear trend)
  const detrendedData = detrend(motionData);
  
  // Apply Hamming window
  const windowedData = applyHammingWindow(detrendedData);
  
  // Simple frequency analysis using autocorrelation
  const frequency = estimateFrequencyFromAutocorrelation(windowedData, samplingRate);
  
  // Calculate amplitude from signal variance
  const amplitude = Math.sqrt(calculateVariance(windowedData));
  
  // Calculate confidence based on signal quality
  const confidence = calculateSimpleConfidence(windowedData, frequency);
  
  return {
    frequency: frequency,
    amplitude: amplitude,
    confidence: confidence
  };
}

/**
 * Calculate variance of an array of numbers
 */
function calculateVariance(data: number[]): number {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
}

/**
 * Remove linear trend from data
 */
function detrend(data: number[]): number[] {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Calculate linear regression coefficients
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * data[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Remove trend
  return data.map((val, i) => val - (slope * i + intercept));
}

/**
 * Apply Hamming window to data
 */
function applyHammingWindow(data: number[]): number[] {
  const n = data.length;
  return data.map((val, i) => {
    const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1));
    return val * window;
  });
}

/**
 * Calculate confidence score based on signal quality
 */
function calculateConfidence(
  powerSpectrum: number[], 
  peakBin: number, 
  minBin: number, 
  maxBin: number
): number {
  const peakPower = powerSpectrum[peakBin];
  
  // Calculate average power in the 3-8 Hz range
  let totalPower = 0;
  let count = 0;
  
  for (let i = minBin; i <= maxBin && i < powerSpectrum.length; i++) {
    totalPower += powerSpectrum[i];
    count++;
  }
  
  const averagePower = totalPower / count;
  
  // Calculate signal-to-noise ratio
  const snr = peakPower / averagePower;
  
  // Calculate peak prominence (how much the peak stands out)
  let leftMin = Math.min(...powerSpectrum.slice(Math.max(0, peakBin - 5), peakBin));
  let rightMin = Math.min(...powerSpectrum.slice(peakBin + 1, Math.min(powerSpectrum.length, peakBin + 6)));
  const prominence = peakPower - Math.max(leftMin, rightMin);
  
  // Normalize confidence to 0-1 range
  const confidence = Math.min(1.0, (snr * prominence) / (peakPower * 10));
  
  return Math.max(0.1, confidence); // Minimum 10% confidence
}

/**
 * Estimate frequency using autocorrelation method
 */
function estimateFrequencyFromAutocorrelation(data: number[], samplingRate: number): number {
  const maxLag = Math.floor(data.length / 2);
  const autocorr = new Array(maxLag).fill(0);
  
  // Calculate autocorrelation
  for (let lag = 0; lag < maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < data.length - lag; i++) {
      sum += data[i] * data[i + lag];
    }
    autocorr[lag] = sum;
  }
  
  // Find the first peak after lag 0
  let firstPeak = 1;
  for (let i = 1; i < autocorr.length - 1; i++) {
    if (autocorr[i] > autocorr[i-1] && autocorr[i] > autocorr[i+1] && autocorr[i] > autocorr[0] * 0.1) {
      firstPeak = i;
      break;
    }
  }
  
  // Convert lag to frequency
  const frequency = samplingRate / firstPeak;
  
  // Clamp to 3-8 Hz range
  if (frequency < 3) return 3;
  if (frequency > 8) return 8;
  
  return frequency;
}

/**
 * Calculate simple confidence based on signal quality
 */
function calculateSimpleConfidence(data: number[], frequency: number): number {
  // Higher confidence for signals in the target range
  let confidence = 0.5;
  
  if (frequency >= 3 && frequency <= 8) {
    confidence += 0.3;
  }
  
  // Higher confidence for signals with good variance
  const variance = calculateVariance(data);
  if (variance > 0.001) {
    confidence += 0.2;
  }
  
  return Math.min(1.0, confidence);
}

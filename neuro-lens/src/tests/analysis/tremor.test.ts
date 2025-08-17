import { describe, it, expect } from 'vitest';
import { analyzeTremor, WristDataPoint } from '@/lib/utils/tremor';

describe('Tremor Analysis', () => {
  it('should detect 5 Hz frequency from synthetic sine wave data', async () => {
    // Generate synthetic 5 Hz sine wave data
    const sampleRate = 30; // 30 Hz sampling rate
    const duration = 20; // 20 seconds
    const frequency = 5; // 5 Hz target frequency
    const amplitude = 0.1; // Amplitude of motion
    
    const wristData: WristDataPoint[] = [];
    const startTime = Date.now();
    
    for (let i = 0; i < sampleRate * duration; i++) {
      const time = i / sampleRate;
      const x = amplitude * Math.sin(2 * Math.PI * frequency * time);
      const y = 0.5 + 0.01 * Math.random(); // Small random variation
      
      wristData.push({
        x: x,
        y: y,
        timestamp: startTime + (i * 1000) / sampleRate
      });
    }
    
    // Analyze the synthetic data
    const result = await analyzeTremor(wristData);
    
    // Verify frequency detection (4.8-5.2 Hz range)
    expect(result.frequency).toBeGreaterThanOrEqual(4.8);
    expect(result.frequency).toBeLessThanOrEqual(5.2);
    
    // Verify other properties
    expect(result.amplitude).toBeGreaterThan(0);
    expect(result.amplitude).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThan(0.1);
    expect(result.confidence).toBeLessThanOrEqual(1);
    
    console.log('Synthetic 5 Hz test results:', {
      targetFrequency: frequency,
      detectedFrequency: result.frequency,
      amplitude: result.amplitude,
      confidence: result.confidence
    });
  });
  
  it('should handle insufficient data gracefully', async () => {
    const insufficientData: WristDataPoint[] = [];
    const startTime = Date.now();
    
    // Only 50 data points (less than required 100)
    for (let i = 0; i < 50; i++) {
      insufficientData.push({
        x: Math.random(),
        y: Math.random(),
        timestamp: startTime + i * 100
      });
    }
    
    await expect(analyzeTremor(insufficientData)).rejects.toThrow(
      'Insufficient data points for analysis (minimum 100 required)'
    );
  });
  
  it('should detect dominant axis motion correctly', async () => {
    const sampleRate = 30;
    const duration = 20;
    const frequency = 6; // 6 Hz target frequency
    const amplitude = 0.15;
    
    const wristData: WristDataPoint[] = [];
    const startTime = Date.now();
    
    // Generate data with motion primarily in Y-axis
    for (let i = 0; i < sampleRate * duration; i++) {
      const time = i / sampleRate;
      const x = 0.5 + 0.01 * Math.random(); // Small random variation
      const y = 0.5 + amplitude * Math.sin(2 * Math.PI * frequency * time);
      
      wristData.push({
        x: x,
        y: y,
        timestamp: startTime + (i * 1000) / sampleRate
      });
    }
    
    const result = await analyzeTremor(wristData);
    
    // Should detect frequency close to 6 Hz
    expect(result.frequency).toBeGreaterThanOrEqual(5.8);
    expect(result.frequency).toBeLessThanOrEqual(6.2);
    
    console.log('Y-axis dominant motion test results:', {
      targetFrequency: frequency,
      detectedFrequency: result.frequency,
      amplitude: result.amplitude,
      confidence: result.confidence
    });
  });
  
  it('should handle noisy data with trend', async () => {
    const sampleRate = 30;
    const duration = 20;
    const frequency = 4; // 4 Hz target frequency
    const amplitude = 0.12;
    
    const wristData: WristDataPoint[] = [];
    const startTime = Date.now();
    
    // Generate data with trend and noise
    for (let i = 0; i < sampleRate * duration; i++) {
      const time = i / sampleRate;
      const trend = 0.001 * i; // Linear trend
      const noise = 0.02 * (Math.random() - 0.5); // Random noise
      const signal = amplitude * Math.sin(2 * Math.PI * frequency * time);
      
      const x = 0.5 + trend + signal + noise;
      const y = 0.5 + 0.01 * Math.random();
      
      wristData.push({
        x: x,
        y: y,
        timestamp: startTime + (i * 1000) / sampleRate
      });
    }
    
    const result = await analyzeTremor(wristData);
    
    // Should still detect frequency close to 4 Hz despite noise and trend
    expect(result.frequency).toBeGreaterThanOrEqual(3.8);
    expect(result.frequency).toBeLessThanOrEqual(4.4);
    
    console.log('Noisy data with trend test results:', {
      targetFrequency: frequency,
      detectedFrequency: result.frequency,
      amplitude: result.amplitude,
      confidence: result.confidence
    });
  });
});

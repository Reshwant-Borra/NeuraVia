'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CameraCanvas } from '@/components/CameraCanvas';
import { PoseLandmark } from '@/lib/utils/math';
import { analyzeTremor } from '@/lib/utils/tremor';
import { Timer, Play, RotateCcw, Home } from 'lucide-react';

interface TremorResult {
  frequency: number;
  amplitude: number;
  confidence: number;
}

export default function TremorTestPage() {
  const router = useRouter();
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [wristData, setWristData] = useState<{ x: number; y: number; timestamp: number }[]>([]);
  const [result, setResult] = useState<TremorResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const dataCollectionRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setIsTestRunning(true);
    setCountdown(20);
    setWristData([]);
    setResult(null);
    
    // Start countdown
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTest = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (dataCollectionRef.current) {
      clearInterval(dataCollectionRef.current);
      dataCollectionRef.current = null;
    }
    setIsTestRunning(false);
    
    // Analyze collected data
    if (wristData.length > 0) {
      analyzeCollectedData();
    }
  };

  const resetTest = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (dataCollectionRef.current) {
      clearInterval(dataCollectionRef.current);
    }
    setIsTestRunning(false);
    setCountdown(20);
    setWristData([]);
    setResult(null);
  };

  const analyzeCollectedData = async () => {
    setIsAnalyzing(true);
    try {
      const tremorResult = await analyzeTremor(wristData);
      setResult(tremorResult);
    } catch (error) {
      console.error('Error analyzing tremor data:', error);
      setResult({
        frequency: 0,
        amplitude: 0,
        confidence: 0
      });
    }
    setIsAnalyzing(false);
  };

  const handlePoseDetected = (landmarks: PoseLandmark[], quality: string) => {
    if (!isTestRunning || countdown === 0) return;

    // Find wrist landmarks (15 = left wrist, 16 = right wrist)
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    
    // Use whichever wrist is more visible
    const wrist = leftWrist?.visibility > rightWrist?.visibility ? leftWrist : rightWrist;
    
    if (wrist && wrist.visibility > 0.5) {
      const timestamp = Date.now();
      setWristData(prev => [...prev, { x: wrist.x, y: wrist.y, timestamp }]);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (dataCollectionRef.current) clearInterval(dataCollectionRef.current);
    };
  }, []);

  if (result) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Timer className="h-6 w-6" />
                Tremor Test Results
              </span>
              <Button variant="outline" onClick={goHome}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                    {result.frequency.toFixed(1)} Hz
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                    Peak Frequency
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {result.amplitude.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Amplitude
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {(result.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                    Confidence
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {result.frequency >= 3 && result.frequency <= 8 
                  ? 'Tremor detected in the typical range (3-8 Hz)'
                  : 'Frequency outside typical tremor range'
                }
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={resetTest} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Test Again
                </Button>
                <Button onClick={goHome}>
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Timer className="h-6 w-6" />
              Tremor Assessment
            </span>
            <Button variant="outline" onClick={goHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isTestRunning ? (
            <div className="text-center space-y-4">
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-semibold">Instructions</h3>
                <div className="text-left space-y-2 text-sm text-muted-foreground">
                  <p>• Position your hand in front of the camera</p>
                  <p>• Keep your wrist visible and relatively still</p>
                  <p>• The test will record 20 seconds of wrist movement</p>
                  <p>• Try to maintain a natural hand position</p>
                  <p>• Avoid sudden movements during the test</p>
                </div>
              </div>
              
              <Button onClick={startTest} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Tremor Test
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {countdown}s
                </div>
                <p className="text-muted-foreground">
                  {countdown > 0 ? 'Keep your wrist visible and still' : 'Analyzing data...'}
                </p>
              </div>
              
              <div className="flex justify-center">
                <CameraCanvas
                  width={640}
                  height={480}
                  showOverlay={true}
                  onPoseDetected={handlePoseDetected}
                />
              </div>
              
              <div className="text-center space-y-2">
                <Badge variant="outline">
                  Data Points: {wristData.length}
                </Badge>
                {countdown > 0 && (
                  <Button onClick={stopTest} variant="outline">
                    Stop Test Early
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing tremor data...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { PoseOverlay } from './PoseOverlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assessPoseQuality, OneEuroFilter, EMASmoother, PoseLandmark } from '@/lib/utils/math';
import { Camera, CameraOff, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface CameraCanvasProps {
  width?: number;
  height?: number;
  showOverlay?: boolean;
  onPoseDetected?: (landmarks: PoseLandmark[], quality: string) => void;
}

export function CameraCanvas({
  width = 640,
  height = 480,
  showOverlay = true,
  onPoseDetected,
}: CameraCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [landmarks, setLandmarks] = useState<PoseLandmark[]>([]);
  const [poseQuality, setPoseQuality] = useState<'red' | 'amber' | 'green'>('red');
  const [qualityScore, setQualityScore] = useState(0);
  const [qualityReason, setQualityReason] = useState('Initializing...');
  const [showPoseOverlay, setShowPoseOverlay] = useState(showOverlay);
  const [fps, setFps] = useState(0);

  // Smoothing filters
  const smoothingFiltersRef = useRef<Map<number, OneEuroFilter>>(new Map());
  const emaSmootherRef = useRef<EMASmoother>(new EMASmoother(0.3));

  // Initialize MediaPipe pose landmarker
  const initializePoseLandmarker = useCallback(async () => {
    try {
      console.log('🔍 Initializing MediaPipe pose landmarker...');
      
      // Try local path first
      try {
        console.log('📁 Attempting local path: /mediapipe');
        const vision = await FilesetResolver.forVisionTasks('/mediapipe');
        console.log('✅ FilesetResolver result:', vision);
        
        if (!vision || Object.keys(vision).length === 0) {
          throw new Error('FilesetResolver returned empty object - WASM files may not be accessible');
        }

        console.log('🎯 Creating PoseLandmarker with local files...');
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/mediapipe/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });

        setIsModelLoaded(true);
        console.log('✅ Pose landmarker loaded successfully with local files');
        return;
      } catch (localError) {
        console.warn('⚠️ Local path failed, trying CDN fallback:', localError.message);
        
        // Fallback to CDN
        console.log('🌐 Attempting CDN fallback...');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        
        console.log('✅ CDN FilesetResolver result:', vision);
        
        if (!vision || Object.keys(vision).length === 0) {
          throw new Error('Both local and CDN paths failed');
        }

        console.log('🎯 Creating PoseLandmarker with CDN files...');
        poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/mediapipe/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });

        setIsModelLoaded(true);
        console.log('✅ Pose landmarker loaded successfully with CDN fallback');
        return;
      }
    } catch (error) {
      console.error('❌ Error loading pose landmarker:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setQualityReason(`Failed to load pose model: ${error.message}`);
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsStreaming(true);
            console.log('✅ Camera started successfully');
          }
        };
      }
    } catch (error) {
      console.error('❌ Error starting camera:', error);
      setQualityReason('Camera access denied');
    }
  }, [width, height]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      console.log('🛑 Camera stopped');
    }
  }, []);

  // Process video frame for pose detection
  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    const poseLandmarker = poseLandmarkerRef.current;
    const canvas = canvasRef.current;

    if (!video || !poseLandmarker || !canvas || !isStreaming || !isModelLoaded) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const startTime = performance.now();
    
    try {
      // Detect pose landmarks
      const results: PoseLandmarkerResult = await poseLandmarker.detectForVideo(video, startTime);
      
      if (results.landmarks && results.landmarks.length > 0) {
        const poseLandmarks = results.landmarks[0];
        
        // Apply smoothing to landmarks
        const smoothedLandmarks: PoseLandmark[] = poseLandmarks.map((landmark, index) => {
          const point = { x: landmark.x, y: landmark.y, z: landmark.z };
          
          // Use One-Euro filter for each landmark
          if (!smoothingFiltersRef.current.has(index)) {
            smoothingFiltersRef.current.set(index, new OneEuroFilter(1.0, 0.0, 1.0));
          }
          
          const filter = smoothingFiltersRef.current.get(index)!;
          const smoothed = filter.filter(point, startTime);
          
          return {
            x: smoothed.x,
            y: smoothed.y,
            z: smoothed.z || 0,
            visibility: landmark.visibility,
          };
        });

        setLandmarks(smoothedLandmarks);

        // Assess pose quality
        const quality = assessPoseQuality(smoothedLandmarks);
        setPoseQuality(quality.quality);
        setQualityScore(quality.score);
        setQualityReason(quality.reason);

        // Call callback if provided
        if (onPoseDetected) {
          onPoseDetected(smoothedLandmarks, quality.quality);
        }
      } else {
        setLandmarks([]);
        setPoseQuality('red');
        setQualityScore(0);
        setQualityReason('No pose detected');
      }
    } catch (error) {
      console.error('Error processing frame:', error);
      setQualityReason('Processing error');
    }

    // Calculate FPS
    const frameTime = performance.now() - startTime;
    const currentFps = 1000 / frameTime;
    setFps(Math.round(currentFps));

    // Continue processing
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [isStreaming, isModelLoaded, onPoseDetected]);

  // Initialize on mount
  useEffect(() => {
    initializePoseLandmarker();
    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializePoseLandmarker, stopCamera]);

  // Start processing when ready
  useEffect(() => {
    if (isStreaming && isModelLoaded) {
      processFrame();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, isModelLoaded, processFrame]);

  // Start camera when model is loaded
  useEffect(() => {
    if (isModelLoaded && !isStreaming) {
      startCamera();
    }
  }, [isModelLoaded, isStreaming, startCamera]);

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'amber': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const resetSmoothing = () => {
    smoothingFiltersRef.current.clear();
    emaSmootherRef.current.reset();
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Live Pose Detection
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {fps} FPS
            </Badge>
            <Badge className={`text-xs ${getQualityColor(poseQuality)}`}>
              {qualityScore.toFixed(1)} - {qualityReason}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            width={width}
            height={height}
            className="rounded-lg bg-black"
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
            muted
            playsInline
          />
          
          {showPoseOverlay && landmarks.length > 0 && (
            <PoseOverlay
              landmarks={landmarks}
              width={width}
              height={height}
              showConnections={true}
              showLandmarks={true}
              landmarkColor={poseQuality === 'green' ? '#00ff00' : poseQuality === 'amber' ? '#ffaa00' : '#ff0000'}
              connectionColor="#ffffff"
            />
          )}
          
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPoseOverlay(!showPoseOverlay)}
            >
              {showPoseOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPoseOverlay ? 'Hide' : 'Show'} Overlay
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetSmoothing}
            >
              <RotateCcw className="h-4 w-4" />
              Reset Smoothing
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming ? (
              <Button variant="outline" size="sm" onClick={stopCamera}>
                <CameraOff className="h-4 w-4" />
                Stop Camera
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={startCamera}>
                <Camera className="h-4 w-4" />
                Start Camera
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Green: Stable pose detected</p>
          <p>• Amber: Moderate stability</p>
          <p>• Red: No pose or unstable</p>
        </div>
      </CardContent>
    </Card>
  );
}

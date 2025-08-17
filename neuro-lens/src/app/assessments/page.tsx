'use client';

import { useAppStore } from '@/store/useAppStore';
import { AssessmentCard } from '@/components/AssessmentCard';
import { CameraCanvas } from '@/components/CameraCanvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Search, Camera } from 'lucide-react';
import { useState } from 'react';

export default function AssessmentsPage() {
  const assessments = useAppStore((state) => state.assessments);
  const [showLivePreview, setShowLivePreview] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Neurological Assessments
        </h1>
        <p className="text-muted-foreground">
          Select and configure your assessment protocols
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Assessment Management
          </CardTitle>
          <CardDescription>
            Enable or disable assessments and view their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assessments..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <div className="mb-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Test your camera setup and verify pose detection quality before starting assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Ensure you have good lighting and are positioned clearly in the camera view.
              </p>
              <button
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="text-sm text-primary hover:underline"
              >
                {showLivePreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            
            {showLivePreview && (
              <div className="flex justify-center">
                <CameraCanvas
                  width={480}
                  height={360}
                  showOverlay={true}
                  onPoseDetected={(landmarks, quality) => {
                    console.log('Pose detected:', quality, landmarks.length);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access to Tremor Test */}
      <div className="mb-8">
        <Card className="shadow-soft bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              Quick Tremor Assessment
            </CardTitle>
            <CardDescription>
              Ready to test? Start a tremor assessment right now
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • 20-second wrist motion analysis
                </p>
                <p className="text-sm text-muted-foreground">
                  • Detects frequencies in 3-8 Hz range
                </p>
                <p className="text-sm text-muted-foreground">
                  • Real-time pose tracking with MediaPipe
                </p>
              </div>
              <a
                href="/assessments/tremor"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Tremor Test
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            id={assessment.id}
            name={assessment.name}
            description={assessment.description}
            enabled={assessment.enabled}
            lastCompleted={assessment.lastCompleted}
          />
        ))}
      </div>

      {/* Assessment Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Assessment Types</CardTitle>
            <CardDescription>
              Understanding the different neurological assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tremor Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Measures involuntary rhythmic movements of the hands and fingers to assess motor control and stability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Finger Tap Test</h4>
              <p className="text-sm text-muted-foreground">
                Evaluates fine motor coordination and speed by measuring rapid finger tapping patterns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hand Open/Close</h4>
              <p className="text-sm text-muted-foreground">
                Assesses hand coordination and motor planning through repetitive opening and closing movements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sway Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Measures postural stability and balance through body sway detection and analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>
              Guidelines for accurate assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Perform assessments in a quiet, distraction-free environment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Ensure your device is placed on a stable surface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Follow the instructions carefully for each assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Complete assessments at consistent times for better tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Consult with healthcare professionals for medical interpretation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

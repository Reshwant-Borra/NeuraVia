'use client';

import { useAppStore } from '@/store/useAppStore';
import { AssessmentCard } from '@/components/AssessmentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

export default function Home() {
  const assessments = useAppStore((state) => state.assessments);
  const enabledCount = assessments.filter(a => a.enabled).length;
  const completedCount = assessments.filter(a => a.lastCompleted).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Neuro Lens
        </h1>
        <p className="text-muted-foreground">
          Professional neurological assessment and monitoring platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">
              Available neurological tests
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledCount}</div>
            <p className="text-xs text-muted-foreground">
              Active assessments
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Recent assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Available Assessments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Quick Start Guide */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to begin your neurological assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enable the assessments you want to perform</li>
            <li>Ensure your device is in a stable position</li>
            <li>Follow the on-screen instructions for each test</li>
            <li>Review your results and track progress over time</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

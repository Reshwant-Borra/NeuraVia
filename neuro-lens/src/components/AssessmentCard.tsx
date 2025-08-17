'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { Clock, Play } from 'lucide-react';

interface AssessmentCardProps {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastCompleted?: Date;
}

export function AssessmentCard({ id, name, description, enabled, lastCompleted }: AssessmentCardProps) {
  const toggleAssessment = useAppStore((state) => state.toggleAssessment);

  const formatLastCompleted = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-soft-lg ${
      enabled ? 'ring-2 ring-primary/20' : 'opacity-75'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant={enabled ? 'default' : 'secondary'}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {lastCompleted && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last completed: {formatLastCompleted(lastCompleted)}</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant={enabled ? 'outline' : 'default'}
              size="sm"
              onClick={() => toggleAssessment(id)}
              className="flex-1"
            >
              {enabled ? 'Disable' : 'Enable'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={!enabled}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

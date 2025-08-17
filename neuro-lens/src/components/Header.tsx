'use client';

import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export function Header() {
  const isOnline = useAppStore((state) => state.isOnline);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NL</span>
            </div>
            <span className="font-bold text-xl">Neuro Lens</span>
          </Link>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link 
            href="/assessments" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Assessments
          </Link>
          
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

'use client';

import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus';

interface NetworkStatusProviderProps {
  children: React.ReactNode;
}

export function NetworkStatusProvider({ children }: NetworkStatusProviderProps) {
  useNetworkStatus();
  
  return <>{children}</>;
}

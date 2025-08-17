declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      method?: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        rangeRequests?: boolean;
        networkTimeoutSeconds?: number;
        cacheKeyWillBeUsed?: (params: { request: Request }) => Promise<string>;
      };
    }>;
  }
  
  function withPWA(config: NextConfig & { pwa?: PWAConfig }): NextConfig;
  export default withPWA;
}

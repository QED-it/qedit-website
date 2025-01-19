interface Window {
  gtag: (
    command: 'consent' | 'config' | 'event',
    action: string,
    params?: {
      [key: string]: any;
    }
  ) => void;
} 
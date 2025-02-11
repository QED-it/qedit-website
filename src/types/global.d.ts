interface Window {
  gtag: (
    command: 'consent' | 'config' | 'event',
    action: string,
    params?: Record<string, string | number | boolean | null>
  ) => void;
} 
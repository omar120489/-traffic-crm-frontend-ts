import { useState, useCallback } from 'react';

export interface Toast {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export function useToast() {
  const [toast, setToast] = useState<Toast>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = useCallback(
    (message: string, severity: Toast['severity'] = 'success') => {
      setToast({ open: true, message, severity });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return { toast, showToast, hideToast };
}


import { useEffect, useMemo, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

export function useChatSocket(enabled = true) {
  const token = localStorage.getItem('serviceToken') || sessionStorage.getItem('serviceToken');
  const socketRef = useRef<Socket | null>(null);

  const socket = useMemo(() => {
    if (!enabled) return null;
    const s = io((import.meta as any).env.VITE_APP_API_URL ?? '/', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });
    socketRef.current = s;
    return s;
  }, [enabled, token]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  return socket;
}

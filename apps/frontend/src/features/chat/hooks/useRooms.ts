import { useCallback, useEffect, useState } from 'react';
import { listRooms } from '../api';
import type { Room } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useChatSocket } from './useChatSocket';

export function useRooms() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  const search = params.get('search') || '';
  const type = (params.get('type') as 'dm' | 'group' | null) || null;
  const onlyUnread = params.get('onlyUnread') === 'true';

  const socket = useChatSocket(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listRooms({ search, type: type ?? undefined, onlyUnread });
      setRooms(data.items);
      setError(null);
    } catch (e: unknown) {
      const msg =
        typeof e === 'string' ? e : e instanceof Error ? e.message : 'Failed to load rooms';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, type, onlyUnread]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = () => {
      refresh();
    };
    socket.on('chat.message', onMessage);
    return () => {
      socket.off('chat.message', onMessage);
    };
  }, [socket, refresh]);

  const setFilter = (key: 'search' | 'type' | 'onlyUnread', value: string | boolean) => {
    const p = new URLSearchParams(params);
    if (key === 'onlyUnread') p.set(key, String(value));
    else if (value) p.set(key, String(value));
    else p.delete(key);
    setParams(p, { replace: true });
  };

  return {
    rooms,
    loading,
    error,
    refresh,
    filters: { search, type, onlyUnread },
    setFilter
  };
}

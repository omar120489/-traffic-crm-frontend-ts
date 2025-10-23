import { useCallback, useEffect, useRef, useState } from 'react';
import type { ID, Message } from '../types';
import { listMessages, sendMessage } from '../api';
import { useChatSocket } from './useChatSocket';

export function useRoomMessages(roomId: ID | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cursorRef = useRef<string | null>(null);
  const socket = useChatSocket(!!roomId);

  const merge = useCallback((incoming: Message[], toTop = false) => {
    setMessages((prev) => {
      const map = new Map<string, Message>();
      for (const m of toTop ? incoming : prev) map.set(m.id, m);
      for (const m of toTop ? prev : incoming) map.set(m.id, m);
      return Array.from(map.values()).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });
  }, []);

  const loadInitial = useCallback(async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const res = await listMessages(roomId, { pageSize: 50 });
      cursorRef.current = res.items.length ? res.items[0].id : null;
      setHasMore(!!res.hasMore);
      setMessages(res.items.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const loadMore = useCallback(async () => {
    if (!roomId || !cursorRef.current || loading) return;
    try {
      setLoading(true);
      const res = await listMessages(roomId, { before: cursorRef.current, pageSize: 50 });
      if (res.items.length) cursorRef.current = res.items[0].id;
      setHasMore(!!res.hasMore);
      merge(res.items, true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load more messages');
    } finally {
      setLoading(false);
    }
  }, [roomId, merge, loading]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    if (!socket || !roomId) return;
    const handler = (payload: any) => {
      if (payload?.roomId !== roomId) return;
      merge([payload as Message]);
    };
    socket.on('chat.message', handler);
    return () => {
      socket.off('chat.message', handler);
    };
  }, [socket, roomId, merge]);

  const send = useCallback(
    async (draft: { text?: string; attachmentIds?: ID[] }) => {
      if (!roomId) return;
      const temp: Message = {
        id: 'temp_' + Math.random().toString(36).slice(2),
        roomId,
        sender: { id: 'me', name: 'Me' },
        text: draft.text,
        attachments: [],
        createdAt: new Date().toISOString(),
        status: 'sending'
      };
      merge([temp]);
      try {
        const real = await sendMessage(roomId, draft);
        merge([real]);
      } catch (e) {
        // TODO: show toast
      }
    },
    [roomId, merge]
  );

  return { messages, hasMore, loading, error, loadMore, send, reload: loadInitial };
}

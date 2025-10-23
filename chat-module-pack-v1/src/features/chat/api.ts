import axios from "axios";
import type { Room, Message, ID } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL ?? "/",
  withCredentials: true
});

export interface ListResult<T> { items: T[]; total?: number; hasMore?: boolean; }

export async function listRooms(params: { search?: string; type?: "dm"|"group"; onlyUnread?: boolean }) {
  const { data } = await api.get<ListResult<Room>>("/chat/rooms", { params });
  return data;
}

export async function getRoom(roomId: ID) {
  const { data } = await api.get<Room>(`/chat/rooms/${roomId}`);
  return data;
}

export async function listMessages(roomId: ID, params: { before?: string; pageSize?: number } = {}) {
  const { data } = await api.get<ListResult<Message>>(`/chat/rooms/${roomId}/messages`, { params });
  return data;
}

export async function sendMessage(roomId: ID, payload: { text?: string; attachmentIds?: ID[] }) {
  const { data } = await api.post<Message>(`/chat/rooms/${roomId}/messages`, payload);
  return data;
}

export async function markRead(roomId: ID, lastReadMessageId: ID) {
  await api.post(`/chat/rooms/${roomId}/read`, { lastReadMessageId });
}

export async function presignAttachment(input: { name: string; size: number; mime: string }) {
  const { data } = await api.post<{ uploadUrl: string; fileUrl: string }>(`/chat/attachments/presign`, input);
  return data;
}

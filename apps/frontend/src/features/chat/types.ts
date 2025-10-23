export type ID = string;
export type ISO = string;

export type RoomKind = 'dm' | 'group';

export interface UserRef {
  id: ID;
  name: string;
  avatarUrl?: string;
}

export interface Attachment {
  id: ID;
  kind: 'image' | 'file';
  name: string;
  size: number;
  url: string;
  mime: string;
}

export interface Message {
  id: ID;
  roomId: ID;
  sender: UserRef;
  text?: string;
  attachments?: Attachment[];
  createdAt: ISO;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Room {
  id: ID;
  kind: RoomKind;
  name?: string;
  participants: UserRef[];
  lastMessageAt?: ISO;
  unreadCount?: number;
  entityRef?: { type: 'deal' | 'lead' | 'contact'; id: ID };
  createdAt: ISO;
  updatedAt: ISO;
}

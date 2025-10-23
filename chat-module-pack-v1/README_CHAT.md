# Chat Module Pack (MVP)

## Install
npm i socket.io-client

## Add route
// in src/routes/MainRoutes.tsx
// import ChatPage from 'views/apps/chat/ChatPage';
// { path: '/chat', element: <ChatPage /> }

## API required
GET  /chat/rooms
POST /chat/rooms
GET  /chat/rooms/:id/messages
POST /chat/rooms/:id/messages
POST /chat/rooms/:id/read
POST /chat/attachments/presign

## WS events
chat.message, chat.typing, chat.presence, chat.read

## Notes
- URL is source of truth (?room=...&search=...)
- Optimistic send; reconciled on server ack
- Infinite scroll with cursor "before"

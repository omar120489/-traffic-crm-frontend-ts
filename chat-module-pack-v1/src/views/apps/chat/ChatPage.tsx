import * as React from "react";
import { Box, Button, Stack, TextField, InputAdornment } from "@mui/material";
import AppPage from "../../../layouts/AppPage";
import RoomsList from "../../../features/chat/components/RoomsList";
import RoomView from "../../../features/chat/components/RoomView";
import { useSearchParams } from "react-router-dom";

export default function ChatPage() {
  const [params, setParams] = useSearchParams();
  const actions = (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small">New DM</Button>
      <Button variant="contained" size="small">New Group</Button>
    </Stack>
  );

  const toolbar = (
    <Stack direction="row" spacing={1}>
      <TextField
        size="small"
        placeholder="Search…"
        value={params.get("search") || ""}
        onChange={(e)=> {
          const p = new URLSearchParams(params);
          const v = e.target.value;
          if (v) p.set("search", v); else p.delete("search");
          setParams(p, { replace: true });
        }}
        InputProps={{ startAdornment: <InputAdornment position="start">🔎</InputAdornment> }}
      />
    </Stack>
  );

  return (
    <AppPage
      title="Chat"
      subtitle="Direct & group messaging"
      actions={actions}
      toolbar={toolbar}
    >
      <Box sx={{ display: 'flex', minHeight: 560, overflow: 'hidden' }}>
        <RoomsList />
        <RoomView />
      </Box>
    </AppPage>
  );
}

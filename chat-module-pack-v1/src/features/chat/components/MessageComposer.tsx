import * as React from "react";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";

export default function MessageComposer({ onSend }: { onSend: (draft: { text?: string }) => void }) {
  const [value, setValue] = React.useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend({ text });
    setValue("");
  };

  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        fullWidth
        placeholder="Type a message…"
        value={value}
        onChange={(e)=> setValue(e.target.value)}
        onKeyDown={(e)=> { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}
      />
      <Tooltip title="Send (Ctrl/⌘+Enter)">
        <IconButton color="primary" onClick={submit}>➡️</IconButton>
      </Tooltip>
    </Box>
  );
}

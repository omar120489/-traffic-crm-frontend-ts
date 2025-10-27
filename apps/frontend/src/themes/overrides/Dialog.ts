import type { Components } from '@mui/material/styles';

export default function Dialog(): NonNullable<Components['MuiDialog']> {
  return {
    styleOverrides: {
      paper: {
        overflowY: 'visible'
      }
    }
  };
}

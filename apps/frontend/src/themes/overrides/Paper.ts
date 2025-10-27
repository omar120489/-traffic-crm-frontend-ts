import type { Components } from '@mui/material/styles';

export default function Paper(borderRadius: number): NonNullable<Components['MuiPaper']> {
  return {
    styleOverrides: {
      rounded: {
        borderRadius
      }
    }
  };
}

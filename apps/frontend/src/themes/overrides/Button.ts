import type { Components, Theme } from '@mui/material/styles';

export default function Button(theme: Theme): NonNullable<Components['MuiButton']> {
  return {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none'
      }
    }
  };
}

import type { Components } from '@mui/material/styles';

// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select(): NonNullable<Components['MuiSelect']> {
  return {
    styleOverrides: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent'
        }
      }
    }
  };
}

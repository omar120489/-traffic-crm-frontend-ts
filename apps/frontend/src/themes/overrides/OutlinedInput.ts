import { alpha, type Components, type Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(
  theme: Theme,
  borderRadius: number,
  outlinedFilled: boolean
): NonNullable<Components['MuiOutlinedInput']> {
  const isDark = theme.palette.mode === 'dark';
  const filledBackground = outlinedFilled
    ? isDark
      ? theme.palette.grey[800]
      : theme.palette.grey[50]
    : 'transparent';
  const defaultOutline = isDark ? alpha(theme.palette.text.primary, 0.28) : theme.palette.grey[300];
  const hoverOutline = isDark ? alpha(theme.palette.text.primary, 0.4) : theme.palette.grey[400];

  return {
    styleOverrides: {
      root: {
        background: filledBackground,
        borderRadius: `${borderRadius}px`,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: defaultOutline,
          borderRadius: `${borderRadius}px`
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: hoverOutline
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.light
        },
        '&.MuiInputBase-multiline': {
          padding: 1
        },
        '&.MuiOutlinedInput-adornedStart': {
          paddingLeft: 4
        }
      },
      input: {
        fontWeight: 500,
        background: filledBackground,
        padding: '15.5px 14px',
        borderRadius: `${borderRadius}px`,
        '&.MuiInputBase-inputSizeSmall': {
          padding: '10px 14px',
          '&.MuiInputBase-inputAdornedStart': {
            paddingLeft: 0
          }
        }
      }
    }
  };
}

import type { Theme } from '@mui/material/styles';

type DataGridOverrides = {
  MuiDataGrid: {
    slotProps: {
      root: {
        sx: {
          '& .MuiDataGrid-columnSeparator': {
            color: string;
          };
        };
      };
    };
  };
};

export default function DataGrid(theme: Theme): DataGridOverrides {
  return {
    MuiDataGrid: {
      slotProps: {
        root: {
          sx: {
            '& .MuiDataGrid-columnSeparator': { color: theme.palette.grey[300] }
          }
        }
      }
    }
  };
}

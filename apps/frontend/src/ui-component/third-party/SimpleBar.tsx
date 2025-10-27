
import type { ReactNode } from 'react';

import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { MUIStyledCommonProps } from '@mui/system';
import Box from '@mui/material/Box';

import { BrowserView, MobileView } from 'react-device-detect';
import SimpleBar, { type Props as SimpleBarProps } from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { ThemeDirection } from 'config';
import { withAlpha } from 'utils/colorUtils';

const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
});

const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': { backgroundColor: withAlpha(theme.vars.palette.grey[500], 0.48) },
    '&.simplebar-visible:before': { opacity: 1 },
  },
  '& .simplebar-track.simplebar-vertical': { width: 10 },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 6 },
  '& .simplebar-mask': { zIndex: 'inherit' },
}));

type SimpleBarScrollProps = MUIStyledCommonProps<Theme> & SimpleBarProps & {
  children?: ReactNode;
};

export default function SimpleBarScroll({ children, sx, ...other }: SimpleBarScrollProps) {
  const theme = useTheme();

  return (
    <>
      <RootStyle>
        <SimpleBarStyle
          clickOnTrack={false}
          sx={sx}
          data-simplebar-direction={
            theme.direction === ThemeDirection.RTL ? 'rtl' : 'ltr'
          }
          {...other}
        >
          {children as ReactNode}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
          {children as ReactNode}
        </Box>
      </MobileView>
    </>
  );
}

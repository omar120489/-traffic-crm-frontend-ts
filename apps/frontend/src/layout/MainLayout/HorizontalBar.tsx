import { cloneElement, ReactElement } from 'react';

// material-ui
// import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// project imports
import MenuList from './MenuList';
import useConfig from 'hooks/useConfig';

// TypeScript interfaces
interface ElevationScrollProps {
  readonly children: ReactElement<{ elevation?: number }>;
  readonly window?: Window | undefined;
}

function ElevationScroll({ children, window }: ElevationScrollProps): ReactElement {
  /**
   * Note that you normally won't need to set the window ref as useScrollTrigger will default to window.
   * This is only being set here because the demo is in an iframe.
   */
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window
  });

  // Note: customShadows may not be present on ThemeVars in type definitions
  // theme.shadows[4] = (theme.vars as any)?.customShadows?.z1 ?? theme.shadows[4];

  return cloneElement(children, { elevation: trigger ? 4 : 0 });
}

// ==============================|| HORIZONTAL MENU LIST ||============================== //

export default function HorizontalBar(): React.JSX.Element {
  const {
    state: { container }
  } = useConfig();

  return (
    <ElevationScroll>
      <AppBar
        sx={(theme) => ({
          top: 71,
          bgcolor: 'background.paper',
          width: '100%',
          height: 62,
          justifyContent: 'center',
          borderTop: '1px solid',
          borderColor: 'grey.300',
          zIndex: 1098,
          ...theme.applyStyles('dark', {
            bgcolor: 'background.default',
            borderColor: 'background.paper'
          })
        })}
      >
        <Container maxWidth={container ? 'lg' : false}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuList />
          </Box>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}

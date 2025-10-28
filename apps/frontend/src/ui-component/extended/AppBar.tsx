import React, { cloneElement, useState, ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useColorScheme, useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiAppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import ThemeMode from 'config';
import Logo from 'ui-component/Logo';

// assets
import BookIcon from '@mui/icons-material/Book';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | undefined;
}

function ElevationScroll({ children, window }: ElevationScrollProps): ReactElement {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window : undefined
  });

  const clonedProps: Record<string, unknown> = {
    ...(trigger && { elevation: 1 }),
    style: {
      backgroundColor:
        colorScheme === ThemeMode.DARK && trigger
          ? theme.vars?.palette.dark[800]
          : theme.vars?.palette.background.default,
      color: theme.vars?.palette.text.primary
    }
  };

  return cloneElement(children, clonedProps);
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

interface AppBarProps {
  readonly window?: Window;
  readonly children?: React.ReactNode;
}

export default function AppBar({ ...others }: AppBarProps): React.ReactElement {
  const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

  const drawerToggler = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      'key' in event &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <ElevationScroll {...others}>
      <MuiAppBar>
        <Container>
          <Toolbar sx={{ py: 2.5, px: `0 !important` }}>
            <Typography component={RouterLink} to="/" sx={{ flexGrow: 1, textAlign: 'left' }}>
              <Logo />
            </Typography>
            <Stack
              direction="row"
              sx={{ gap: { xs: 1.5, md: 2.5 }, display: { xs: 'none', sm: 'flex' } }}
            >
              <Button color="inherit" component={Link} href="#">
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/login" target="_blank">
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                href="https://codedthemes.gitbook.io/berry"
                target="_blank"
              >
                Documentation
              </Button>
              <Button
                component={Link}
                href="https://material-ui.com/store/items/berry-react-material-admin-dashboard/"
                disableElevation
                variant="contained"
                color="secondary"
              >
                Purchase Now
              </Button>
            </Stack>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                {drawerToggle && (
                  <Box
                    sx={{ width: 'auto' }}
                    role="presentation"
                    onClick={drawerToggler(false)}
                    onKeyDown={drawerToggler(false)}
                  >
                    <List>
                      <Link sx={{ textDecoration: 'none' }} href="#" target="_blank">
                        <ListItemButton component="a">
                          <ListItemIcon>
                            <HomeIcon />
                          </ListItemIcon>
                          <ListItemText primary="Home" />
                        </ListItemButton>
                      </Link>
                      <ListItemButton component={RouterLink} to="/login" target="_blank">
                        <ListItemIcon>
                          <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                      </ListItemButton>
                      <ListItemButton
                        component={Link}
                        href="https://codedthemes.gitbook.io/berry"
                        target="_blank"
                      >
                        <ListItemIcon>
                          <BookIcon />
                        </ListItemIcon>
                        <ListItemText primary="Documentation" />
                      </ListItemButton>
                      <ListItemButton
                        component={Link}
                        href="https://material-ui.com/store/items/berry-react-material-admin-dashboard/"
                        target="_blank"
                      >
                        <ListItemIcon>
                          <CreditCardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Purchase Now" />
                      </ListItemButton>
                    </List>
                  </Box>
                )}
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </ElevationScroll>
  );
}

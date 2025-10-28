import { useRef, useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import type { AvatarProps } from '@mui/material/Avatar';

// project imports
import { ThemeDirection } from 'config';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { drawerWidth, gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';

// assets
import Banner from './Banner';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import WifiIcon from '@mui/icons-material/Wifi';

// TypeScript interfaces
interface HeaderAvatarProps extends Omit<AvatarProps, 'children' | 'sx'> {
  readonly children?: React.ReactNode;
  readonly sx?: SxProps<Theme>;
}

interface LinkItem {
  readonly link: string;
  readonly label: string;
  readonly target?: string;
}

interface LinkGroup {
  readonly id: string;
  readonly label: string;
  readonly children: readonly LinkItem[];
}

const HeaderAvatar = forwardRef<HTMLDivElement, HeaderAvatarProps>(
  ({ children, sx, ...others }, ref) => {
    const theme = useTheme();

    return (
      <Avatar
        ref={ref}
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          transition: 'all .2s ease-in-out',
          display: { xs: 'none', md: 'flex' },
          color: theme.vars.palette.secondary.dark,
          background: theme.vars.palette.secondary.light,
          '&:hover, &[aria-controls="menu-list-grow"]': {
            color: theme.vars.palette.secondary.light,
            background: theme.vars.palette.secondary.dark
          },
          ...theme.applyStyles('dark', {
            color: theme.vars.palette.secondary.main,
            background: theme.vars.palette.dark.main,
            '&:hover, &[aria-controls="menu-list-grow"]': {
              color: theme.vars.palette.secondary.light,
              background: theme.vars.palette.secondary.main
            }
          }),
          ...sx
        }}
        {...others}
      >
        {children}
      </Avatar>
    );
  }
);

HeaderAvatar.displayName = 'HeaderAvatar';

const linkList: readonly LinkGroup[] = [
  {
    id: 'user-quick',
    label: 'User Quick',
    children: [
      { link: '#!', label: 'Social Profile' },
      { link: '#!', label: 'Account Profile' },
      { link: '#!', label: 'User Cards' },
      { link: '#!', label: 'User List' },
      { link: '#!', label: 'Contact' }
    ]
  },
  {
    id: 'application',
    label: 'Applications',
    children: [
      { link: '#!', label: 'Chat' },
      { link: '#!', label: 'Kanban' },
      { link: '#!', label: 'Mail' },
      { link: '#!', label: 'Calendar' },
      { link: '#!', label: 'E-commerce' }
    ]
  },
  {
    id: 'primitives',
    label: 'Primitives',
    children: [
      { link: '#!', label: 'Colors' },
      { link: '#!', label: 'Typography' },
      { link: '#!', label: 'Shadows' },
      { link: 'https://tabler-icons.io/', label: 'Icons', target: '_blank' },
      { link: '#!', label: 'Elements' }
    ]
  }
] as const;

// ==============================|| SEARCH INPUT - MEGA MENU||============================== //

export default function MegaMenuSection(): React.JSX.Element {
  const theme = useTheme();
  const {
    state: { themeDirection }
  } = useConfig();

  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <HeaderAvatar
        variant="rounded"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <WifiIcon />
      </HeaderAvatar>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        sx={{
          ...(themeDirection === ThemeDirection.RTL && {
            right: { md: '-170px !important', lg: '-300px !important' }
          })
        }}
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [150, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper
                sx={{
                  width: {
                    md: `calc(100vw - 100px)`,
                    lg: `calc(100vw - ${drawerWidth}px - 100px)`,
                    xl: `calc(100vw - ${drawerWidth}px - 200px)`
                  },
                  minWidth: 750,
                  maxWidth: {
                    md: 850,
                    lg: 1200
                  }
                }}
              >
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                  >
                    <Grid container spacing={0}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Banner />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <Grid container spacing={gridSpacing as unknown as number} sx={{ p: 3 }}>
                          {linkList.map((links) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={links.id}>
                              <List
                                component="nav"
                                aria-labelledby={`list-${links.id}`}
                                subheader={
                                  <ListSubheader id={`list-${links.id}`}>
                                    <Typography variant="subtitle1">{links.label}</Typography>
                                  </ListSubheader>
                                }
                              >
                                {links.children.map((items, index) => (
                                  <ListItemButton
                                    component={Link}
                                    to={items.link}
                                    key={index}
                                    {...(items.target && { target: items.target })}
                                  >
                                    <ListItemIcon>
                                      <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={items.label} />
                                  </ListItemButton>
                                ))}
                              </List>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}

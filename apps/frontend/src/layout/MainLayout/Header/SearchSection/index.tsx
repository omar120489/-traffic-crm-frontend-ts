import { forwardRef, useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

// third party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@/icons';

// TypeScript interfaces
import type { AvatarProps } from '@mui/material/Avatar';
import type { SxProps, Theme } from '@mui/material/styles';

interface HeaderAvatarProps extends Omit<AvatarProps, 'children' | 'sx'> {
  readonly children: React.ReactNode;
  readonly sx?: SxProps<Theme>;
}

interface MobileSearchProps {
  readonly value: string;
  readonly setValue: (value: string) => void;
  readonly popupState: Parameters<typeof bindToggle>[0];
}

const HeaderAvatar = forwardRef<HTMLDivElement, HeaderAvatarProps>(
  ({ children, ...others }, ref): React.JSX.Element => {
    const theme = useTheme();

    return (
      <Avatar
        ref={ref}
        variant="rounded"
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          color: theme.vars.palette.secondary.dark,
          background: theme.vars.palette.secondary.light,
          '&:hover': {
            color: theme.vars.palette.secondary.light,
            background: theme.vars.palette.secondary.dark
          },

          ...theme.applyStyles('dark', {
            color: theme.vars.palette.secondary.main,
            background: theme.vars.palette.dark.main,
            '&:hover': {
              color: theme.vars.palette.secondary.light,
              background: theme.vars.palette.secondary.main
            }
          })
        }}
        {...others}
      >
        {children}
      </Avatar>
    );
  }
);

HeaderAvatar.displayName = 'HeaderAvatar';

// ==============================|| SEARCH INPUT - MOBILE||============================== //

function MobileSearch({ value, setValue, popupState }: MobileSearchProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <OutlinedInput
      id="input-search-header"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <IconSearch stroke={1.5} size="16px" />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <HeaderAvatar>
            <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
          </HeaderAvatar>
          <Box sx={{ ml: 2 }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: 'orange.light',
                color: 'orange.dark',
                '&:hover': { bgcolor: 'orange.dark', color: 'orange.light' },

                ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.dark.main })
              }}
              {...bindToggle(popupState)}
            >
              <IconX stroke={1.5} size="20px" />
            </Avatar>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      slotProps={{ input: { 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
      sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
    />
  );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection(): React.JSX.Element {
  const [value, setValue] = useState<string>('');

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="19.2px" />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{
                  zIndex: 1100,
                  width: '99%',
                  top: '-55px !important',
                  px: { xs: 1.25, sm: 1.5 }
                }}
              >
                {({ TransitionProps }) => (
                  <>
                    <Transitions
                      type="zoom"
                      {...TransitionProps}
                      sx={{ transformOrigin: 'center left' }}
                    >
                      <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                        <Box sx={{ p: 2 }}>
                          <Grid
                            container
                            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                          >
                            <Grid size="grow">
                              <MobileSearch
                                value={value}
                                setValue={setValue}
                                popupState={popupState}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlinedInput
          id="input-search-header"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="16px" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <HeaderAvatar>
                <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
              </HeaderAvatar>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          slotProps={{ input: { 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
          sx={{ width: { md: 250, lg: 434 }, ml: 2, px: 2 }}
        />
      </Box>
    </>
  );
}

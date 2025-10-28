import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// TypeScript interfaces
interface LinearProgressWithLabelProps {
  readonly value: number;
  readonly [key: string]: unknown;
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({
  value,
  ...others
}: LinearProgressWithLabelProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'primary.800',
            ...theme.applyStyles('dark', { color: 'dark.light' })
          }}
        >
          Progress
        </Typography>
        <Typography variant="h6" sx={{ color: 'inherit' }}>{`${Math.round(value)}%`}</Typography>
      </Stack>
      <LinearProgress
        aria-label="progress of theme"
        variant="determinate"
        value={value}
        {...others}
        sx={{
          height: 10,
          borderRadius: 30,
          [`&.${linearProgressClasses.colorPrimary}`]: {
            bgcolor: 'background.paper'
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            bgcolor: 'primary.main'
          }
        }}
      />
    </Stack>
  );
}

// ==============================|| SIDEBAR MENU Card ||============================== //

function MenuCard(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Card
      sx={{
        bgcolor: 'primary.light',
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50%, transparent 50%)`,
          borderRadius: '50%',
          top: -30,
          right: -180
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14%, transparent 70%)`,
          borderRadius: '50%',
          top: -160,
          right: -130
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  bgcolor: 'primary.800',
                  color: 'primary.200'
                }}
              >
                <TableChartOutlinedIcon fontSize="inherit" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                mt: 0,
                mb: 0,
                '& .MuiListItemText-primary': { color: 'primary.800' },
                '& .MuiListItemText-secondary': { color: 'primary.800', mt: 0.25 }
              }}
              primary={<Typography variant="subtitle1">Berry Dashboard</Typography>}
              secondary={<Typography variant="caption"> 28/23 GB</Typography>}
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel value={80} />
      </Box>
    </Card>
  );
}

export default memo(MenuCard);

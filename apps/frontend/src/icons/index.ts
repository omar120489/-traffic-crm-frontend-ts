// SPDX-License-Identifier: MIT
// Centralized Tabler icon re-exports for lint-safe usage.
//
// This wrapper provides a unified import path that:
// - Satisfies ESLint no-restricted-imports rules
// - Works with TypeScript path aliases (@/*)
// - Enables tree-shaking optimization
// - Allows future icon library migration flexibility
//
// Usage:
//   import { IconUser, IconBell, IconSettings } from '@/icons';
//
// Instead of:
//   import { IconUser } from '@tabler/icons-react';

export * from '@tabler/icons-react';

// Common icon aliases for better tree-shaking
export {
  IconUser,
  IconBell,
  IconSettings,
  IconSearch,
  IconMenu2,
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconCheck,
  IconPlus,
  IconMinus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconHome,
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconExternalLink,
  IconCopy,
  IconShare,
  IconFileText,
  IconVideo,
  IconMusic,
  IconArchive,
  IconStar,
  IconHeart,
  IconBookmark,
  IconTag,
  IconFlag,
  IconAlertTriangle,
  IconInfoCircle,
  IconHelp,
  IconQuestionMark,
  IconLogout,
  IconLogin,
  IconLock,
  IconLockOpen,
  IconShield,
  IconKey,
  IconAccessPoint,
  IconWifi,
  IconDevices,
  IconDeviceMobile,
  IconDeviceTablet
} from '@tabler/icons-react';

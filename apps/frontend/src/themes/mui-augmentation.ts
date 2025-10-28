/**
 * Material-UI theme augmentation for custom properties
 */

import type {
  CustomShadows,
  CustomPaletteColor,
  CustomTextColor,
  CustomTypographyVariants
} from './types';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }

  interface ThemeOptions {
    customShadows?: Partial<CustomShadows>;
  }

  interface Palette {
    orange: CustomPaletteColor;
    dark: CustomPaletteColor;
  }

  interface PaletteOptions {
    orange?: Partial<CustomPaletteColor>;
    dark?: Partial<CustomPaletteColor>;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypedText extends CustomTextColor {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariants extends CustomTypographyVariants {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypographyVariantsOptions extends Partial<CustomTypographyVariants> {}
}

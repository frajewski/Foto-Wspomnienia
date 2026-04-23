import { MD3LightTheme } from 'react-native-paper';

import { lightColors } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

export const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
  spacing,
  radius,
  typography,
} as const;

export type AppTheme = typeof lightTheme;

export const theme: AppTheme = lightTheme;

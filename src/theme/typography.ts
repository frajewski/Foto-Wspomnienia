import { Platform } from 'react-native';

export const fontFamily = {
  regular:
    Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }) ?? 'System',
  medium:
    Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'System',
    }) ?? 'System',
  bold:
    Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }) ?? 'System',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
} as const;

export type AppTypography = {
  fontFamily: typeof fontFamily;
  fontWeight: typeof fontWeight;
};

export const typography: AppTypography = {
  fontFamily,
  fontWeight,
};

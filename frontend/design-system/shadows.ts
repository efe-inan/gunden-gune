export const shadows = {
  none: 'none',
  light: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(139, 154, 109, 0.3)',
  glowHover: '0 0 30px rgba(139, 154, 109, 0.5)',
} as const;

export const shadowColors = {
  default: 'rgba(0, 0, 0, 0.1)',
  primary: 'rgba(139, 154, 109, 0.3)',
  success: 'rgba(107, 144, 128, 0.3)',
  warning: 'rgba(212, 165, 116, 0.3)',
  error: 'rgba(212, 132, 106, 0.3)',
} as const;

export type ShadowKey = keyof typeof shadows;
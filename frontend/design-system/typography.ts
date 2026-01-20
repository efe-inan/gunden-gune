export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
  },
  fontSize: {
    h1: {
      size: '2.5rem',
      lineHeight: '1.2',
      fontWeight: 700,
    },
    h2: {
      size: '2rem',
      lineHeight: '1.3',
      fontWeight: 600,
    },
    h3: {
      size: '1.75rem',
      lineHeight: '1.4',
      fontWeight: 600,
    },
    h4: {
      size: '1.5rem',
      lineHeight: '1.4',
      fontWeight: 600,
    },
    h5: {
      size: '1.25rem',
      lineHeight: '1.5',
      fontWeight: 500,
    },
    h6: {
      size: '1.125rem',
      lineHeight: '1.5',
      fontWeight: 500,
    },
    body: {
      size: '1rem',
      lineHeight: '1.6',
      fontWeight: 400,
    },
    small: {
      size: '0.875rem',
      lineHeight: '1.5',
      fontWeight: 400,
    },
    caption: {
      size: '0.75rem',
      lineHeight: '1.4',
      fontWeight: 400,
    },
    label: {
      size: '0.875rem',
      lineHeight: '1.4',
      fontWeight: 500,
    },
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
  textAlign: {
    left: 'left',
    center: 'center',
    right: 'right',
  },
} as const;

export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
export type LetterSpacingKey = keyof typeof typography.letterSpacing;
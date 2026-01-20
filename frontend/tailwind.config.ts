import type { Config } from 'tailwindcss';
import { colors } from './design-system/colors';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        text: colors.text,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
      },
    },
  },
  plugins: [],
};

export default config;

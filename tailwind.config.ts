import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './ui/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F0EFFE',
          100: '#E4E2FD',
          200: '#CBC7FB',
          300: '#ABA4F6',
          400: '#8B80EF',
          500: '#6F63E8',
          600: '#5A4FE4',
          700: '#4A3FC7',
          800: '#3B32A0',
          900: '#2F2A7C',
          DEFAULT: '#5A4FE4',
        },
        amber: {
          50: '#FEF6E7',
          100: '#FDECC8',
          200: '#FBD98C',
          300: '#F9C34E',
          400: '#F5A524',
          500: '#E1900F',
          600: '#B9760B',
          DEFAULT: '#F5A524',
        },
        success: '#12B76A',
        warning: '#F79009',
        error: '#F04438',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1.25rem',
        '2xl': '1.75rem',
        pill: '999px',
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgb(25 24 40 / 0.06), 0 1px 1px rgb(25 24 40 / 0.04)',
        soft: '0 4px 12px rgb(25 24 40 / 0.07), 0 2px 4px rgb(25 24 40 / 0.05)',
        'soft-lg': '0 12px 28px rgb(25 24 40 / 0.10), 0 4px 10px rgb(25 24 40 / 0.05)',
        float: '0 20px 48px rgb(47 42 124 / 0.16), 0 8px 16px rgb(25 24 40 / 0.06)',
        glow: '0 16px 36px rgb(90 79 228 / 0.20)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(100deg, #6F63E8, #4A3FC7 45%, #F5A524)',
        mesh: 'radial-gradient(680px 520px at 12% -6%, rgba(111,99,232,.16), transparent 60%), radial-gradient(560px 460px at 96% 4%, rgba(245,165,36,.12), transparent 60%), radial-gradient(700px 620px at 82% 92%, rgba(90,79,228,.10), transparent 62%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;

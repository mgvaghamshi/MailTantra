import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Nimbus Theme Colors
      colors: {
        // Primary Azure Blue
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DFFF',
          300: '#7CC7FF',
          400: '#36ABFF',
          500: '#1A73E8', // Main brand color
          600: '#1557B8',
          700: '#134494',
          800: '#153B7A',
          900: '#173366',
          950: '#0F1F45',
          DEFAULT: '#1A73E8',
          foreground: '#FFFFFF',
        },
        // Neutral Grays - Nimbus Palette
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        // Success Green
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        // Warning Orange
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Error Red
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        border: "hsl(220 13% 91%)",
        input: "hsl(220 13% 91%)",
        ring: "hsl(221 83% 53%)",
        background: "#F9FAFB",
        foreground: "hsl(224 71% 4%)",
        secondary: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(220 9% 46%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(220 9% 46%)",
        },
        accent: {
          DEFAULT: "hsl(220 14% 96%)",
          foreground: "hsl(220 9% 46%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(224 71% 4%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(224 71% 4%)",
        },
        chart: {
          '1': 'hsl(221 83% 53%)',
          '2': 'hsl(212 95% 68%)',
          '3': 'hsl(216 92% 79%)',
          '4': 'hsl(210 98% 78%)',
          '5': 'hsl(212 97% 87%)'
        }
      },
      // Nimbus Typography
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "SF Pro Display", ...fontFamily.sans],
        inter: ["var(--font-inter)", "Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", "Fira Code", ...fontFamily.mono],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      // Nimbus Spacing & Layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Nimbus Border Radius
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
        'nimbus': '12px',
        'nimbus-lg': '16px',
        'nimbus-xl': '20px',
      },
      // Nimbus Box Shadows
      boxShadow: {
        'nimbus-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'nimbus': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'nimbus-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'nimbus-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'nimbus-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'nimbus-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'nimbus-glow': '0 0 0 1px rgba(26, 115, 232, 0.05), 0 1px 3px 0 rgba(26, 115, 232, 0.1)',
      },
      // Nimbus Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "nimbus-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "nimbus-pulse": "nimbus-pulse 2s ease-in-out infinite",
      },
      // Nimbus Backdrop Filters
      backdropBlur: {
        'nimbus': '8px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

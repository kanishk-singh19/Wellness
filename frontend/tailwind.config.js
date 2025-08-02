/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
      colors: {
        border: "var(--color-border)", /* minimal gray border */
        input: "var(--color-input)", /* white input background */
        ring: "var(--color-ring)", /* grounded slate focus ring */
        background: "var(--color-background)", /* pure white with subtle warmth */
        foreground: "var(--color-foreground)", /* deep charcoal */
        primary: {
          DEFAULT: "var(--color-primary)", /* grounded slate */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* soft mint */
          foreground: "var(--color-secondary-foreground)", /* deep charcoal */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* clear red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* barely-there gray */
          foreground: "var(--color-muted-foreground)", /* medium gray */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* warm amber */
          foreground: "var(--color-accent-foreground)", /* white */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white popover background */
          foreground: "var(--color-popover-foreground)", /* deep charcoal */
        },
        card: {
          DEFAULT: "var(--color-card)", /* barely-there gray surface */
          foreground: "var(--color-card-foreground)", /* deep charcoal */
        },
        success: {
          DEFAULT: "var(--color-success)", /* natural green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* warm amber */
          foreground: "var(--color-warning-foreground)", /* white */
        },
        error: {
          DEFAULT: "var(--color-error)", /* clear red */
          foreground: "var(--color-error-foreground)", /* white */
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-in": "slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        'wellness': '0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05)',
        'wellness-lg': '0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
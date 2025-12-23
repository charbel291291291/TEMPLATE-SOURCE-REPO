import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    // Mobile-first approach - base sizes are for mobile
    screens: {
      xs: "360px", // Small mobile (iPhone SE)
      sm: "640px", // Standard mobile
      md: "768px", // Tablet portrait
      lg: "1024px", // Tablet landscape / small desktop
      xl: "1280px", // Desktop
      "2xl": "1536px", // Large desktop
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // Mobile padding
        xs: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      // Dynamic viewport units for full-height layouts
      height: {
        "screen-dvh": "100dvh", // Dynamic viewport height (handles mobile UI)
        "screen-svh": "100svh", // Small viewport height (stable)
        "screen-lvh": "100lvh", // Large viewport height (includes browser UI)
      },
      minHeight: {
        "screen-dvh": "100dvh",
        "screen-svh": "100svh",
        "screen-lvh": "100lvh",
      },
      width: {
        "full-safe":
          "calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right))",
      },
      padding: {
        // Safe area support for notches
        "safe-t": "env(safe-area-inset-top)",
        "safe-r": "env(safe-area-inset-right)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
      },
      margin: {
        "safe-t": "env(safe-area-inset-top)",
        "safe-r": "env(safe-area-inset-right)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
      },
      fontSize: {
        // Responsive typography using clamp()
        // Mobile: 12px → Tablet: 14px → Desktop: 16px
        xs: "clamp(0.75rem, 2vw, 0.875rem)",
        sm: "clamp(0.875rem, 2.5vw, 1rem)",
        base: "clamp(1rem, 3vw, 1.125rem)",
        lg: "clamp(1.125rem, 3.5vw, 1.25rem)",
        xl: "clamp(1.25rem, 4vw, 1.5rem)",
        "2xl": "clamp(1.5rem, 4.5vw, 1.875rem)",
        "3xl": "clamp(1.875rem, 5vw, 2.25rem)",
        "4xl": "clamp(2.25rem, 6vw, 3rem)",
        "5xl": "clamp(3rem, 8vw, 3.75rem)",
        display: "clamp(2rem, 8vw, 4rem)",
        subheadline: "clamp(1rem, 3.5vw, 1.5rem)",
      },
      spacing: {
        // Mobile-first spacing system
        gutter: "clamp(1rem, 4vw, 2rem)",
        "section-padding": "clamp(1.5rem, 6vw, 3rem)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          rose: "hsl(var(--accent-rose))",
          "rose-dark": "hsl(var(--accent-rose-dark))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cream: {
          DEFAULT: "hsl(var(--cream))",
          dark: "hsl(var(--cream-dark))",
        },
        sage: {
          DEFAULT: "hsl(var(--sage))",
          light: "hsl(var(--sage-light))",
          dark: "hsl(var(--sage-dark))",
        },
        charcoal: {
          DEFAULT: "hsl(var(--charcoal))",
          light: "hsl(var(--charcoal-light))",
        },
        rose: {
          DEFAULT: "hsl(var(--rose))",
          light: "hsl(var(--rose-light))",
          dark: "hsl(var(--rose-dark))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
        },
        whatsapp: "#25D366",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
        "gradient-sage": "var(--gradient-sage)",
        "gradient-warm": "var(--gradient-warm)",
      },
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
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.4)" },
          "50%": { boxShadow: "0 0 0 15px rgba(37, 211, 102, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

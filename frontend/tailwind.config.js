/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Dark navy palette
        navy: {
          950: "#050A18",
          900: "#0B1120",
          800: "#0F1729",
          700: "#111827",
          600: "#1E293B",
          500: "#253449",
          400: "#334155",
          300: "#475569",
        },
        // Accent colors
        accent: {
          blue: "#3B82F6",
          indigo: "#6366F1",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        // Surface colors
        surface: {
          primary: "#0B1120",
          secondary: "#111827",
          card: "#1E293B",
          elevated: "#253449",
          border: "#1E3A5F",
        },
        // Text colors
        content: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#64748B",
          inverse: "#0B1120",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        'glow-blue': '0 0 30px -5px rgba(59, 130, 246, 0.3)',
        'glow-indigo': '0 0 30px -5px rgba(99, 102, 241, 0.3)',
        'glow-purple': '0 0 30px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.3)',
        'card-dark': '0 4px 24px -6px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.08)',
        'card-hover': '0 8px 40px -8px rgba(59, 130, 246, 0.2)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'radial-gradient(ellipse at 30% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
};

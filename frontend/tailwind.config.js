/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
        ivory: "#F8F7F3",
        brand: {
          dark: "#191919",
          muted: "#77756F",
          accent: "#5555A5",
          accentHover: "#46468E",
          border: "#DFDDD6",
          surface: "#FFFFFF",
          surfaceMuted: "#F2F0EA",
        },
        border: "#DFDDD6",
        background: "#F8F7F3",
        foreground: "#191919",
        primary: {
          DEFAULT: "#191919",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F2F0EA",
          foreground: "#191919",
        },
        accent: {
          DEFAULT: "#5555A5",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F2F0EA",
          foreground: "#77756F",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#191919",
        },
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "3px",
        md: "6px",
        lg: "8px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

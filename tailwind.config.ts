import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Libre Baskerville'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        slate: {
          50: "#f8f7f4",
          100: "#f0ede6",
          200: "#ddd8cc",
          300: "#c4bcac",
          400: "#a89d8a",
          500: "#8c816e",
          600: "#72695a",
          700: "#5c554a",
          800: "#4a443d",
          900: "#3d3934",
          950: "#201e1b",
        },
        teal: {
          50: "#f0f9f6",
          100: "#d9f0e9",
          200: "#b4e0d4",
          300: "#84c9b9",
          400: "#52ae9c",
          500: "#359282",
          600: "#27766a",
          700: "#215f57",
          800: "#1e4c46",
          900: "#1b3f3b",
          950: "#0a2421",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "progress": "progress 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

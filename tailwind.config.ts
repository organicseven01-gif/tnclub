import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./layout/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#124734",
          DEFAULT: "#1F7A4A",
          light: "#57C878",
        },
        ink: "#222222",
        surface: "#F5F5F5",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(18, 71, 52, 0.18)",
        card: "0 4px 20px -6px rgba(18, 71, 52, 0.12)",
        nav: "0 -4px 24px -8px rgba(18, 71, 52, 0.14)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

export default config;

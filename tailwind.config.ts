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
        "5xl": "2.5rem",
      },
      boxShadow: {
        // Sombras suaves e em camadas — profundidade premium sem "peso".
        soft: "0 18px 48px -22px rgba(18, 71, 52, 0.26)",
        card: "0 6px 24px -12px rgba(18, 71, 52, 0.14), 0 1px 2px -1px rgba(18, 71, 52, 0.06)",
        nav: "0 -10px 40px -20px rgba(18, 71, 52, 0.16)",
        premium: "0 30px 70px -30px rgba(18, 71, 52, 0.42)",
        cta: "0 14px 34px -12px rgba(31, 122, 74, 0.48)",
        "cta-hover": "0 20px 44px -12px rgba(31, 122, 74, 0.55)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2E9159 0%, #1F7A4A 45%, #124734 100%)",
        "brand-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 42%)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

export default config;

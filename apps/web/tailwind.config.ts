import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f2f1f0",
        section: "#eeedec",
        card: "#f0f0ee",
        header: "#504933",
        border: "#cfcab8",
        accent: {
          DEFAULT: "#87702a",
          hover: "#715c21",
          light: "#efe7cb",
        },
        text: {
          DEFAULT: "#1c1c1a",
          muted: "#78766f",
        },
        success: {
          DEFAULT: "#418357",
          light: "#e2efe6",
        },
        warning: {
          DEFAULT: "#a28751",
          light: "#f9f4ea",
        },
        error: {
          DEFAULT: "#944e47",
          light: "#f7e8e7",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        card: "8px",
        btn: "4px",
      },
      boxShadow: {
        editorial: "0 1px 3px rgba(80, 73, 51, 0.08), 0 4px 12px rgba(80, 73, 51, 0.04)",
        card: "0 2px 8px -2px rgba(28, 28, 26, 0.06), 0 1px 4px -1px rgba(28, 28, 26, 0.04)",
        glow: "0 0 20px rgba(135, 112, 42, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

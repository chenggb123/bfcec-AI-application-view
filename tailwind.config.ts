import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#DA291C",
          "red-hover": "#EC001A",
          "red-glow": "rgba(218,41,28,0.25)",
          subtle: "rgba(218,41,28,0.10)",
          crimson: "#B60005",
          "dark-blue": "#005587",
          "light-blue": "#0085AD",
          "green-yellow": "#808C24",
          "dark-green": "#006C5B",
        },
        surface: {
          bg: "#0a0a0a",
          DEFAULT: "#141414",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          hover: "rgba(255,255,255,0.14)",
          accent: "rgba(218,41,28,0.18)",
        },
        text: {
          primary: "#e8e8e8",
          muted: "#8a8a8a",
        },
        success: "#22c55e",
        warn: "#f59e0b",
      },
      fontFamily: {
        display: [
          "Helvetica Neue",
          "PingFang SC",
          "Microsoft YaHei",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "PingFang SC",
          "Microsoft YaHei",
          "Helvetica Neue",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "JetBrains Mono",
          "ui-monospace",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};

export default config;

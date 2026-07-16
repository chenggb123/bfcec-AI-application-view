// Brand / Accent colors
export const brand = {
  red: "#DA291C",
  redHover: "#EC001A",
  redGlow: "rgba(218,41,28,0.25)",
  subtle: "rgba(218,41,28,0.10)",
  crimson: "#B60005",
  darkBlue: "#005587",
  lightBlue: "#0085AD",
  greenYellow: "#808C24",
  darkGreen: "#006C5B",
} as const;

// Surface colors
export const surface = {
  bg: "#0a0a0a",
  DEFAULT: "#141414",
} as const;

// Border colors
export const border = {
  DEFAULT: "rgba(255,255,255,0.07)",
  hover: "rgba(255,255,255,0.14)",
  accent: "rgba(218,41,28,0.18)",
} as const;

// Text/Foreground colors
export const text = {
  primary: "#e8e8e8",
  muted: "#8a8a8a",
} as const;

// Semantic colors
export const semantic = {
  success: "#22c55e",
  warn: "#f59e0b",
} as const;

// Font stacks
export const fonts = {
  display:
    "'Helvetica Neue','PingFang SC','Microsoft YaHei',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
  body: "'PingFang SC','Microsoft YaHei','Helvetica Neue',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
  mono: "'SF Mono','JetBrains Mono',ui-monospace,Menlo,monospace",
} as const;

// Border radii
export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
} as const;

// CSS custom property names (for referencing var() in inline styles)
export const cssVars = {
  bg: "--bg",
  surface: "--surface",
  fg: "--fg",
  muted: "--muted",
  border: "--border",
  borderHover: "--border-hover",
  accent: "--accent",
  accentHover: "--accent-hover",
  accentGlow: "--accent-glow",
  accentSubtle: "--accent-subtle",
  success: "--success",
  warn: "--warn",
  fontDisplay: "--font-display",
  fontBody: "--font-body",
  fontMono: "--font-mono",
  radiusSm: "--radius-sm",
  radiusMd: "--radius-md",
  radiusLg: "--radius-lg",
} as const;

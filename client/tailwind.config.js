/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        "primary": "#9fa7ff",
        "primary-dim": "#8a95ff",
        "primary-fixed": "#8d98ff",
        "primary-fixed-dim": "#7f8af6",
        "primary-container": "#8d98ff",
        "on-primary": "#101b8b",
        "on-primary-container": "#000a7b",
        "on-primary-fixed": "#000000",
        "on-primary-fixed-variant": "#0c1889",
        "inverse-primary": "#4954bc",

        // Secondary palette
        "secondary": "#be83fa",
        "secondary-dim": "#be83fa",
        "secondary-fixed": "#e4c6ff",
        "secondary-fixed-dim": "#dbb4ff",
        "secondary-container": "#62259b",
        "on-secondary": "#32005b",
        "on-secondary-container": "#e4c4ff",
        "on-secondary-fixed": "#4e0487",
        "on-secondary-fixed-variant": "#6c31a5",

        // Tertiary palette
        "tertiary": "#7de9ff",
        "tertiary-dim": "#1ad0eb",
        "tertiary-fixed": "#3adffa",
        "tertiary-fixed-dim": "#1ad0eb",
        "tertiary-container": "#3adffa",
        "on-tertiary": "#005561",
        "on-tertiary-container": "#004b56",
        "on-tertiary-fixed": "#00363e",
        "on-tertiary-fixed-variant": "#005561",

        // Surface palette
        "surface": "#060e20",
        "surface-dim": "#060e20",
        "surface-bright": "#1f2b49",
        "surface-container-lowest": "#000000",
        "surface-container-low": "#091328",
        "surface-container": "#0f1930",
        "surface-container-high": "#141f38",
        "surface-container-highest": "#192540",
        "surface-variant": "#192540",
        "surface-tint": "#9fa7ff",
        "inverse-surface": "#faf8ff",
        "inverse-on-surface": "#4d556b",

        // On-surface
        "on-surface": "#dee5ff",
        "on-surface-variant": "#a3aac4",
        "on-background": "#dee5ff",

        // Background
        "background": "#060e20",

        // Outline
        "outline": "#6d758c",
        "outline-variant": "#40485d",

        // Error
        "error": "#ff6e84",
        "error-dim": "#d73357",
        "error-container": "#a70138",
        "on-error": "#490013",
        "on-error-container": "#ffb2b9",
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}

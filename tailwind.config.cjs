/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-tint": "var(--color-surface-tint)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-secondary": "var(--color-on-secondary)",
        "primary-container": "var(--color-primary-container)",
        "error": "var(--color-error)",
        "surface": "var(--color-surface)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "on-primary-container": "var(--color-on-primary-container)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "inverse-primary": "var(--color-inverse-primary)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "secondary-container": "var(--color-secondary-container)",
        "surface-container-low": "var(--color-surface-container-low)",
        "secondary": "var(--color-secondary)",
        "tertiary": "var(--color-tertiary)",
        "inverse-surface": "var(--color-inverse-surface)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "outline": "var(--color-outline)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "primary-fixed": "var(--color-primary-fixed)",
        "surface-variant": "var(--color-surface-variant)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "on-background": "var(--color-on-background)",
        "on-error-container": "var(--color-on-error-container)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "on-tertiary": "var(--color-on-tertiary)",
        "primary": "var(--color-primary)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-dim": "var(--color-surface-dim)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "on-error": "var(--color-on-error)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "background": "var(--color-background)",
        "error-container": "var(--color-error-container)",
        "on-primary": "var(--color-on-primary)",
        "surface-container": "var(--color-surface-container)",
        "on-surface": "var(--color-on-surface)",
        "outline-variant": "var(--color-outline-variant)",
        "surface-bright": "var(--color-surface-bright)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "on-primary-fixed": "var(--color-on-primary-fixed)"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        unit: "8px",
        "container-padding-desktop": "80px",
        "container-padding-mobile": "24px",
        gutter: "32px",
        "section-gap": "128px"
      },
      fontFamily: {
        "headline-lg": ["Bodoni Moda", "serif"],
        "label-sm": ["Hanken Grotesk", "sans-serif"],
        "display-lg": ["Bodoni Moda", "serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Bodoni Moda", "serif"],
        "display-lg-mobile": ["Bodoni Moda", "serif"],
        "body-lg": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.0", letterSpacing: "0.15em", fontWeight: "600" }],
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "300" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "400" }],
        "display-lg-mobile": ["42px", { lineHeight: "1.2", fontWeight: "300" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "300" }]
      }
    }
  }
}

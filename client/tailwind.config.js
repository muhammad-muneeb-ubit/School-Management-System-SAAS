/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-primary-hover)',
          light: 'var(--brand-primary-light)',
          dark: 'var(--brand-primary-dark)',
          // NEW
          secondary: 'var(--brand-secondary)',
          secondaryHover: 'var(--brand-secondary-hover)',
          secondaryLight: 'var(--brand-secondary-light)',
        },
        sidebar: {
          DEFAULT: 'var(--brand-sidebar-bg)',
          hover: 'var(--brand-sidebar-hover)',
          active: 'var(--brand-sidebar-active)',
        }
      }
    },
  },
  plugins: [],
}
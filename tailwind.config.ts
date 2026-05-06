import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#d4af37",
          50: "#fdf9e9",
          100: "#faf0c8",
          200: "#f5e08e",
          300: "#eeca4c",
          400: "#e5b523",
          500: "#d4af37",
          600: "#a87c13",
          700: "#845c13",
          800: "#6d4916",
          900: "#5c3d17",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
}

export default config

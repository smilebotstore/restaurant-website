/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          950: "#2a0a0a",
          900: "#3d0f0f",
          800: "#551717",
          700: "#6b1f1f",
          600: "#832626",
        },
        gold: {
          400: "#f6c64f",
          500: "#eeb022",
          600: "#d69614",
        },
        cream: {
          50: "#fdf8f0",
          100: "#faf1e2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        soft: "0 20px 45px -15px rgba(42, 10, 10, 0.35)",
        card: "0 10px 30px -10px rgba(42, 10, 10, 0.25)",
      },
    },
  },
  plugins: [],
};

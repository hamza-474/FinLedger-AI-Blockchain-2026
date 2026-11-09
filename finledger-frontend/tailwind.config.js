/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155'
        },
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb'    // blue-600
        },
        accent: {
          DEFAULT: '#6366f1', // indigo-500
          hover: '#4f46e5'    // indigo-600
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#007bff',
        'secondary': '#6c757d',
        'success': '#28a745',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8',
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        'blue': '0 2px 8px rgba(0, 123, 255, 0.3)',
        'green': '0 2px 8px rgba(40, 167, 69, 0.3)',
        'custom': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        '25': '6.25rem',
        '30': '7.5rem',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#E1EAE0",
        "white-transparent": "#E1EAE05A",
        "green-light": "#CCE7C3",
        "green-dark": "#31412F",
        "green-transparent": "#4B615024",
      },
    },
  },
  plugins: [],
};

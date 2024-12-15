/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        lofi: {
          ...require("daisyui/src/theming/themes")["lofi"],
          primary: "#f97316",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.55rem",
        },
      },
    ],
  },
};

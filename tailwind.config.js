module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "100ms": {
          dark: "#0b0f15",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

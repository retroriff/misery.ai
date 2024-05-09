module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#171717",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

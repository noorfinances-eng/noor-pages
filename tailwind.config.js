/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",   // or mat (plus crédible, ton luxueux)
        night: "#0A0A0A",  // noir profond
        muted: "#B1B1B1"   // gris clair pour texte secondaire
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji"
        ]
      }
    }
  },
  plugins: []
};

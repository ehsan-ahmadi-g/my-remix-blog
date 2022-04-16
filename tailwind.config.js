module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        xcolor0: "#1a1a1d",
        xcolor1: "#01071D",
        xcolor2: "#1F2833",
        xcolor3: "#C5C6C7",
        xcolor4: "#66FCF1",
        xcolor5: "#45A29E",
        xcolor6: "#ff4d4f",
      },
      backgroundImage: {
        "home-header": "url(home-header.jpeg)",
      },
      height: {
        "screen-height-with-header": "calc(100vh - 8rem)",
      },
      minHeight: {
        "screen-height-with-header": "calc(100vh - 8rem)",
      },
    },
  },
  variants: {},
  plugins: [],
};

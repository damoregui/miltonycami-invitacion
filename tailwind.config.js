export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { primario: "#46549f", terciario: "#7BAFD4" },
      fontFamily: { principal: ["'Crimson Pro'","serif"] },
      keyframes: {
        scroll: { "0%": { transform: "translate(0)" }, "100%": { transform: "translate(calc(-1200px - 6rem))" } },
        zoomInOut: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.1)" }, "100%": { transform: "scale(1)" } },
        bounceUp: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-20px)" } }
      },
      animation: {
        scroll: "scroll 55s linear infinite",
        zoom: "zoomInOut 2s ease-in-out infinite",
        bounceUp: "bounceUp 2s infinite"
      }
    }
  },
  plugins: []
};
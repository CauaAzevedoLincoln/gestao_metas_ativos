import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#135bec",
      },
      fontFamily: {
        display: ["Verdana", "sans-serif"],
        sans: ["Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
    },
    fontSize: {
      mxs: ".6875rem",
      xxs: ".75rem",
      xs: ".84rem",
      sm: ".89rem",
      tiny: "0.94rem",
      base: "1rem",
      lg: "1.09rem",
      "2lg": "1.125rem",
      xl: "1.25rem",
      "2xl": "1.4rem",
      "3xl": "1.5rem",
      "4xl": "1.6rem",
      "5xl": "1.8rem",
      "6xl": "2rem",
      "7xl": "2.45rem",
      "8xl": "2.6rem",
      "9xl": "3rem",
      "10xl": "3.2rem",
      "11xl": "3.4rem",
      "12xl": "3.6rem",
      "13xl": "3.8rem",
      "14xl": "4rem",
      "15xl": "4.2rem",
      "16xl": "5rem",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

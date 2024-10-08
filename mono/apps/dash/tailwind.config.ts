import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
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
    zIndex: {
      bg: "-1",
      "0": "0",
      "10": "10",
      "20": "20",
      "30": "30",
      "40": "40",
      "50": "50",
      container: "100",
      auto: "auto",
      scrollbar: "1000",
      dropdown: "2000",
      sticky: "3000",
      overlay: "4000",
      modal: "4010",
      header: "5000",
      loading: "7000",
      toast: "6500",
      tooltip: "6300",
      cursor: "9000",
      preload_bg: "9998",
      preload: "9999",
    },
    screens: {
      xxs: "390px",
      xs: "475px",
      sm: "640px",
      md: "768px",
      mdl: "900px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1600px",
      "4xl": "2100px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        koraBlue: "#59ABFF",
        koraBlueLight: "#66CCFF",
        koraYellow: "#FAE27C",
        koraYellowLight: "#FEFCE8",
        koraSky: "#C3EBFA",
        koraSkyLight: "#EDF9FD",
        koraPurple: "#CFCEFF",
        koraPurpleLight: "#F1F0FF",
      },
    },
  },
  plugins: [],
};
export default config;

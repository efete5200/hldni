import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hlskyblue: "#00B4ED",
        hlblack: "#020A0A",
        hlnavy: "#002B68",
        hlsilver: "#B2B2B2",
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.2rem",
      },
      colors: {
        "sand-brown-normal": "#bba765",
        "sand-brown-dark": "#97864f",
        "sand-brown-light": "#cbc09d",
      },
    },
  },
  plugins: [],
};

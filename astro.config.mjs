// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// const SERVER_PORT = 4321;
// // the url to access your blog during local development
// const LOCALHOST_URL = `http://localhost:${SERVER_PORT}`;
// // the url to access your blog after deploying it somewhere (Eg. Netlify)
// const LIVE_URL = "https://brightybaron.github.io";
// // this is the astro command your npm script runs
// const SCRIPT = import.meta.env.NODE_ENV || "";
// const isBuild = SCRIPT.includes("astro build");
// let BASE_URL = LOCALHOST_URL;
// // When you're building your site in local or in CI, you could just set your URL manually
// if (isBuild) {
//   BASE_URL = LIVE_URL;
// }

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  site: "https://brightybaron.github.io/astro-badak-v2",
  // server: { port: SERVER_PORT },
  // base: BASE_URL,
});

import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import posthtml from "vite-plugin-posthtml";
import posthtmlInclude from "posthtml-include";

const root = resolve(__dirname);

export default defineConfig({
  root,
  // Change to "/your-repo-name/" if this deploys to username.github.io/repo-name
  // instead of a custom domain at the site root.
  base: "/",
  plugins: [
    tailwindcss(),
    posthtml([posthtmlInclude({ root: root })]),
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
        programs: resolve(root, "programs.html"),
        approach: resolve(root, "approach.html"),
        schedule: resolve(root, "schedule.html"),
        payments: resolve(root, "payments.html"),
        contact: resolve(root, "contact.html"),
        privacy: resolve(root, "privacy.html"),
      },
    },
  },
});

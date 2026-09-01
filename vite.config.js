import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import posthtml from "posthtml";
import posthtmlInclude from "posthtml-include";

const root = resolve(__dirname);

// vite-plugin-posthtml is unmaintained (last published 2021, no version
// compatible with current Vite), so this wires posthtml-include directly
// via Vite's transformIndexHtml hook instead.
function htmlPartials() {
  return {
    name: "html-partials",
    async transformIndexHtml(html) {
      const result = await posthtml([posthtmlInclude({ root })]).process(html);
      return result.html;
    },
  };
}

export default defineConfig({
  root,
  // Change to "/your-repo-name/" if this deploys to username.github.io/repo-name
  // instead of a custom domain at the site root.
  base: "/",
  plugins: [tailwindcss(), htmlPartials()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        about: resolve(root, "about.html"),
        subjects: resolve(root, "subjects.html"),
        masterclasses: resolve(root, "masterclasses.html"),
        contact: resolve(root, "contact.html"),
        privacy: resolve(root, "privacy.html"),
        terms: resolve(root, "terms.html"),
        notFound: resolve(root, "404.html"),
      },
    },
  },
});

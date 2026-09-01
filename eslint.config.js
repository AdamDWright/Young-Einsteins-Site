import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

// Flat config (ESLint 9+/10 format). The project brief named ".eslintrc.js",
// but that legacy format isn't the supported entry point for the ESLint
// version this installs today - this is the current equivalent.
export default [
  { ignores: ["dist/**"] },
  js.configs.recommended,
  {
    files: ["src/js/**/*.js", "vite.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  eslintConfigPrettier,
];

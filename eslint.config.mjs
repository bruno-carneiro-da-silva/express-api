import globals from "globals";
import pluginJs from "@eslint/eslint-plugin";

export default {
  files: ["**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: globals.node
  },
  ...pluginJs.configs.recommended,
  rules: {
    "no-unused-vars": ["error", {argsIgnorePattern: "next"}],
  }
};

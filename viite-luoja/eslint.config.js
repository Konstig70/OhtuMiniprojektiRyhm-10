import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import jestPlugin from "eslint-plugin-jest";
import { defineConfig, globalIgnores } from "eslint/config";
export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js, jest: jestPlugin }, extends: ["js/recommended"], languageOptions: { globals: {...globals.browser, ...globals.jest} } },
  pluginReact.configs.flat.recommended, jestPlugin.configs["flat/recommended"], {
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  }, 
  globalIgnores(["dist/"])]);

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginNode from "eslint-plugin-node";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"], // Include TypeScript and JavaScript files
    languageOptions: {
      parser: parserTs, // Use TypeScript parser for TypeScript files
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Enable JSX for React
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node, // Include Node.js globals
      },
    },
    plugins: {
      react: pluginReact,
      node: pluginNode,
      "@typescript-eslint": pluginTs,
    },
    rules: {
      // Merge recommended rules from all plugins
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginNode.configs.recommended.rules,
      ...pluginTs.configs.recommended.rules,
      
      "no-unused-vars": "warn", // Example: Adjust no-unused-vars rule
      "react/prop-types": "off", // Disable prop-types rule if not using prop-types
      "node/no-deprecated-api": "off", // Disable deprecated Node.js API warning (optional)
      "node/no-extraneous-require": "off",
      "node/no-exports-assign": "off",
      "node/no-missing-import": "off",
      "node/no-missing-require": "off",
      "node/no-process-exit": "off",
      "node/no-restricted-imports": "off",
      "node/no-sync": "off",
      "import/no-unresolved": "off",
      "import/no-commonjs": "off",
      "import/no-default-export": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/export": "off",
      "node/no-unpublished-require": "off",
      "node/no-unsupported-features/es-builtins": "off",
      "node/no-unsupported-features/es-syntax": "off",
      "node/no-unsupported-features/node-builtins": "off",
      "node/no-unpublished-import":"off",
      "@typescript-eslint/no-unused-vars": "off",
    
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the installed React version
      },
    },
  },
];

// Flat ESLint config for ESLint v9+
// Combines Next.js + TypeScript + import ordering + TS-only enforcement
// Migration guide: https://eslint.org/docs/latest/use/configure/migration-guide

const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const nextPlugin = require("@next/eslint-plugin-next");
const importPlugin = require("eslint-plugin-import");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ["node_modules", ".next", "dist", "coverage"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      import: importPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...(nextPlugin.configs.recommended?.rules || {}),
      ...(tsPlugin.configs.recommended?.rules || {}),
      "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/*.{js,jsx}", "!**/*.d.ts"],
              message: "Use TypeScript source files (.ts/.tsx) only.",
            },
          ],
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

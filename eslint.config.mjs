import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import solid from "eslint-plugin-solid";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: [
      "**/logs",
      "**/*.log",
      "**/pids",
      "**/*.pid",
      "**/*.seed",
      "**/coverage",
      "**/.eslintcache",
      "**/node_modules",
      "**/.DS_Store",
      "release/app/dist",
      "release/build",
      ".erb/dll",
      "**/.idea",
      "**/npm-debug.log.*",
      "**/*.css.d.ts",
      "**/*.sass.d.ts",
      "**/*.scss.d.ts",
      "**/.eslintrc.js",
      "**/dist",
      "**/vite.config.ts",
      "**/plopfile.js",
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:import/typescript",
      "plugin:jsx-a11y/recommended",
      "plugin:promise/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:solid/typescript",
      "plugin:prettier/recommended",
    ),
  ),
  {
    languageOptions: {
      ecmaVersion: 12,

      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: ["tsconfig.json"],
      },

      sourceType: "module",
    },

    plugins: {
      solid: fixupPluginRules(solid),
      "sort-keys-fix": sortKeysFix,
    },

    rules: {
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can", "did", "will"],
          selector: "variable",
          types: ["boolean"],
        },
        {
          custom: {
            match: false,
            regex: "^(I|T|E)[A-Z]",
          },
          format: ["PascalCase"],

          selector: "typeLike",
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          enforceForJSX: true,
        },
      ],
      curly: "error",
      eqeqeq: ["error", "smart"],
      "max-params": ["error", 3],
      "no-await-in-loop": "error",
      "no-console": "warn",
      "no-constant-binary-expression": "error",
      "no-duplicate-imports": "error",
      "no-lonely-if": "error",
      "no-self-compare": "error",
      "no-unneeded-ternary": "error",
      "no-use-before-define": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],

      "require-await": "error",

      "sort-keys-fix/sort-keys-fix": "warn",
    },
  },
];

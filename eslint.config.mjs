import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin but enables only a
  // handful of its rules. Turn on the full recommended set (rules only, so the
  // plugin isn't registered twice).
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "screenshots/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

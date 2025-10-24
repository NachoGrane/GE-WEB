/** @type {import("prettier").Config} */
module.exports = {
  $schema: "https://json.schemastore.org/prettierrc",
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  endOfLine: "lf",

  // Plugins
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
  ],

  // Opcional: si tu tailwind config es TS
  tailwindConfig: "./tailwind.config.ts",

  overrides: [
    { files: ["*.yml", "*.yaml"], options: { singleQuote: false } },
    { files: "*.md", options: { proseWrap: "always" } },
    { files: ["*.css", "*.scss"], options: { singleQuote: false } },
  ],
};
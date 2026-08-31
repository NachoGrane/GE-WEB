/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  endOfLine: 'lf',

  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],

  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    { files: ['*.yml', '*.yaml'], options: { singleQuote: false } },
    { files: '*.md', options: { proseWrap: 'always' } },
    { files: ['*.css'], options: { singleQuote: false } },
  ],
};

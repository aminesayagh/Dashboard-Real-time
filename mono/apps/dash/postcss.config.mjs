/** @type {import('postcss-load-config').Config} */


const config = {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.js',
    },
    'postcss-import': {},
    "tailwindcss/nesting": {},
    "autoprefixer": {},
    "cssnano": {},
    "@csstools/postcss-oklab-function": {
      preserve: true,
    },
  },
};

export default config;

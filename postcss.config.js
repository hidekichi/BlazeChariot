import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';

export default {
  plugins: [
    postcssImport,
    tailwindcss,
    //autoprefixer,
  ]
};
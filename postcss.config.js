import postcssImport from 'postcss-import';
import postcssNested from "postcss-nested";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// export default を使う
export default {
  plugins: [
    postcssImport,
    postcssNested,
    tailwindcss,
    autoprefixer,
    cssnano
  ]
};
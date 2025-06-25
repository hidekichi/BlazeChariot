import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // PostCSSの設定ファイル (postcss.config.js) を自動的に読み込んでくれるため、
  // 多くの場合、特別なCSS設定は不要です。
  // Viteはプロジェクトルートにあるpostcss.config.jsを認識します。

  // Eleventyの出力ディレクトリに合わせておくのが一般的です。
  build: {
    outDir: 'dist' 
  },
});
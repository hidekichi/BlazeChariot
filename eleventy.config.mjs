import { DateTime } from "luxon";
import path from "path";
import htmlmin from "html-minifier-terser";
import markdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import markdownItFigure from "markdown-it-figure";
import markdownItMultimdTable from "markdown-it-multimd-table-ext";
import rubyPlugin from "markdown-it-ruby";
import { HtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginNavigation from "@11ty/eleventy-navigation";
import sitemap from "@quasibit/eleventy-plugin-sitemap";
import EleventyPluginVite from "@11ty/eleventy-plugin-vite";

const isProduction = process.env.ELEVENTY_ENV === "production";

/**
 * YouTube埋め込み用のMarkdownプラグイン
 */
const embedYoutubeDiv = function (md) {
  const ytpBlock = function (state, startLine, endLine, silent) {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const src = state.src;
    const lineSrc = src.slice(pos, max);

    // クラス名とコンテンツ（アドレス::タイトル）をキャプチャ
    const match = lineSrc.match(/^{\s*(ytp(?:\s+[a-zA-Z0-9\-]+)*)::(.*)}$/);
    if (!match) return false;

    const fullClasses = match[1];
    const contentStr = match[2];
    if (!contentStr.trim()) return false;

    const lastSepPos = contentStr.lastIndexOf("::");
    let address, title;

    if (lastSepPos !== -1) {
      address = contentStr.slice(0, lastSepPos);
      title = contentStr.slice(lastSepPos + 2);
    } else {
      address = contentStr;
      title = "";
    }

    if (!address.trim()) return false;

    if (!silent) {
      const token = state.push("ytp_block", "", 0);
      token.content = address.trim();
      token.meta = {
        title: title.trim(),
        classes: fullClasses.trim(),
      };
      state.line = startLine + 1;
    }
    return true;
  };

  md.block.ruler.before("paragraph", "ytp_block", ytpBlock, {
    alt: ["paragraph", "blockquote"],
  });

  md.renderer.rules["ytp_block"] = function (tokens, idx) {
    const address = md.utils.escapeHtml(tokens[idx].content);
    const title = md.utils.escapeHtml(tokens[idx].meta.title);
    const classes = md.utils.escapeHtml(tokens[idx].meta.classes || "ytp");
    const titleAttr = title ? ` data-title="${title}"` : "";

    return `<div class="${classes}"${titleAttr}>${address}</div>\n`;
  };
};

export default async function (eleventyConfig) {

  // -----------------------------------------------------------------
  // Vite Plugin Config
  // -----------------------------------------------------------------

  let viteServer = null;

  // Vite は開発・本番どちらでも有効にする。
  // 開発時: CSS/JS の HMR を担当、serve-fresh-html で HTML キャッシュを回避
  // 本番時: vite build で CSS/JS をバンドルし HTML を自動更新する
  eleventyConfig.addPlugin(EleventyPluginVite, {
    viteOptions: {
      publicDir: false,
      // eleventy-plugin-vite は Vite の root を dist/ に設定して起動するため、
      // テンプレート内の /src/... という絶対パスはそのままでは dist/src/... を
      // 探しに行って見つからない。このエイリアスで src/ 本体へ読み替える。
      resolve: {
        alias: {
          "/src": path.resolve(".", "src"),
        },
      },
      // postcss.config.js はルートに置いておけば自動検知されるが、念のため明示
      css: {
        postcss: "./postcss.config.js",
      },
      // 画面クリアを無効化（ログが見やすくなります）
      clearScreen: false,
      build: {
        // Vite build は outDir(dist/) をクリアしてからビルドするが、
        // 11ty の passthrough copy で配置した static/ が消えてしまう。
        // emptyOutDir: false にすることで既存ファイルを保持する。
        emptyOutDir: false,
      },
      server: {
        open: false,
        headers: {
          "Cache-Control": "no-store",
        },
      },
      plugins: [
        // Vite サーバーのインスタンスを eleventy.after フック用に保持する
        {
          name: "capture-vite-server",
          configureServer(server) {
            viteServer = server;
          },
        },
        // Vite build 完了後に静的ファイルを再コピーするプラグイン。
        // eleventy-plugin-vite が emptyOutDir の設定を上書きするため
        // passthrough copy で配置したファイルが Vite build で消えてしまう。
        // closeBundle フックは Vite build の最後に実行されるため
        // ファイルが消えた後に確実に再コピーできる。
        {
          name: "copy-static-after-build",
          async closeBundle() {
            const { cpSync, copyFileSync, existsSync } = await import("fs");
            const path2 = await import("path");

            const dirCopies = [
              { from: "src/static/images", to: "dist/images" },
              { from: "src/static/favicons", to: "dist/favicons" },
            ];
            for (const { from, to } of dirCopies) {
              const fromPath = path2.resolve(".", from);
              const toPath = path2.resolve(".", to);
              if (existsSync(fromPath)) {
                cpSync(fromPath, toPath, { recursive: true, force: true });
                console.log(`[copy-static] ${from} → dist/`);
              }
            }

            const fileCopies = [
              { from: "src/robots.txt",           to: "dist/robots.txt" },
              { from: "src/pretty-atom-feed.xsl", to: "dist/pretty-atom-feed.xsl" },
              { from: "src/favicon.ico",          to: "dist/favicon.ico" },
            ];
            for (const { from, to } of fileCopies) {
              const fromPath = path2.resolve(".", from);
              const toPath = path2.resolve(".", to);
              if (existsSync(fromPath)) {
                copyFileSync(fromPath, toPath);
                console.log(`[copy-static] ${from} → dist/`);
              }
            }
            for (const file of ["sitemap.xml", "feed.xml"]) {
              const src = path2.resolve(".", `.11ty-vite/${file}`);  // .11ty-vite/ から
              const dest = path2.resolve(".", `dist/${file}`);        // dist/ へ
              if (existsSync(src)) {
                copyFileSync(src, dest);
                console.log(`[copy-static] ${file} → dist/`);
              }
            }
          },
        },
        // HTML を dist/ から毎回ディスク直読みするミドルウェア。
        // Vite・eleventy-dev-server どちらのキャッシュも完全にバイパスするため
        // 「1つ前の変更が反映される」問題を根本から防ぐ。
        {
          name: "serve-fresh-html",
          configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
              const url = req.url?.split("?")[0] ?? "";
              const acceptsHtml = req.headers.accept?.includes("text/html");
              if (!acceptsHtml) return next();

              const { promises: fs } = await import("fs");
              const path2 = await import("path");

              // URL から dist/ 内の候補パスを生成して順番に存在確認する
              const candidates = [
                path2.resolve("dist", url.replace(/^\//, "")),
                path2.resolve("dist", url.replace(/^\//, ""), "index.html"),
                path2.resolve("dist", (url.replace(/^\//, "") || "index") + ".html"),
              ];

              for (const candidate of candidates) {
                try {
                  const stat = await fs.stat(candidate);
                  if (!stat.isFile()) continue;
                  const html = await fs.readFile(candidate, "utf-8");
                  res.setHeader("Content-Type", "text/html; charset=utf-8");
                  res.setHeader("Cache-Control", "no-store");
                  res.end(html);
                  return;
                } catch {}
              }
              next();
            });
          },
        },
        // 開発時、画像を dist/ ではなく src/ から直接配信するプラグイン。
        // passthrough copy が完了する前に Vite がリロードしても画像が表示される。
        {
          name: "serve-src-images",
          configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
              const imgExts = /\.(jpg|jpeg|png|webp|svg|gif|avif|ogg)$/i;
              if (!imgExts.test(req.url)) return next();

              const { createReadStream, promises: fs } = await import("fs");
              const srcPath = path.resolve(".", "src", req.url.replace(/^\//, ""));
              try {
                await fs.access(srcPath);
                res.setHeader("Cache-Control", "no-store");

                // 拡張子ごとに Content-Type を明示する。
                // 設定しないとブラウザがバイナリをテキストとして解釈して文字化けする。
                const ext = req.url.split("?")[0].split(".").pop().toLowerCase();
                const mimeTypes = {
                  jpg: "image/jpeg",
                  jpeg: "image/jpeg",
                  png: "image/png",
                  webp: "image/webp",
                  svg: "image/svg+xml",
                  gif: "image/gif",
                  avif: "image/avif",
                  ogg: "audio/ogg",
                };
                const mime = mimeTypes[ext];
                if (mime) res.setHeader("Content-Type", mime);

                createReadStream(srcPath).pipe(res);
              } catch {
                next();
              }
            });
          },
        },
      ],
    },
  });

  // -----------------------------------------------------------------
  // 開発時: njk 編集後に Vite 経由でリロードを送る
  // -----------------------------------------------------------------
  // CSS は main.js の import で Vite のモジュールグラフに登録されているため
  // CSS 編集時は Vite が自動で HMR を処理する（ここでの処理は不要）。
  // njk 編集時のみ full-reload を送ればよい。
  if (!isProduction) {
    eleventyConfig.on("eleventy.after", () => {
      if (!viteServer) return;
      viteServer.ws.send({ type: "full-reload" });
    });
  }

  eleventyConfig.addGlobalData("isProduction", isProduction);

  // -----------------------------------------------------------------
  // Standard Plugins
  // -----------------------------------------------------------------
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://blazechariot.netlify.app",
    },
  });
  eleventyConfig.addPlugin(pluginRss);

  // Syntax Highlight settings
  eleventyConfig.addPlugin(syntaxHighlight, {
    lineSeparator: "\n",
    templateFormats: ["*"],
    preAttributes: {
      tabindex: 0,
      "data-language": function ({ language }) {
        return language;
      },
    },
    errorOnInvalidLanguage: false,
  });

  // -----------------------------------------------------------------
  // Passthroughs
  // -----------------------------------------------------------------
  // Vite使用時、CSS/JSはimportで解決するためPassthroughは画像やフォント等の静的ファイルに絞るのが理想です。
  eleventyConfig.setServerPassthroughCopyBehavior("copy");  // dev時もbuildと同じ実コピー（重要）

  // src/static/images → dist/images/ に直接展開（これが一番確実）
  eleventyConfig.addPassthroughCopy({
    "src/static/images": "images"
  });
  eleventyConfig.addPassthroughCopy({
    "src/static/favicons": "favicons"
  });
  eleventyConfig.addPassthroughCopy("src/*.{txt,xsl,ico}");
  eleventyConfig.addPassthroughCopy("src/blog/img/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");
  eleventyConfig.addPassthroughCopy("src/guitar/img/**/*.{jpg,jpeg,png,webp,svg,gif,avif,ogg}");
  eleventyConfig.addPassthroughCopy("src/pages/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");

  // -----------------------------------------------------------------
  // Filters
  // -----------------------------------------------------------------
  eleventyConfig.addFilter("shortDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  eleventyConfig.addFilter("getNewestUpdateDate", function (collection) {
    if (!collection || collection.length === 0) return null;
    return collection
      .map((item) => item.data.update || item.date)
      .sort((a, b) => new Date(b) - new Date(a))[0];
  });

  eleventyConfig.addFilter("normalizeDateToJST", function (value) {
    if (!value) return value;
    if (DateTime.isDateTime(value)) return value.toJSDate();

    let dt;
    if (typeof value === "string") {
      if (value.includes("T")) {
        dt = DateTime.fromISO(value, { zone: "Asia/Tokyo" });
      } else {
        dt = DateTime.fromISO(`${value}T09:00:00+09:00`);
      }
    } else {
      dt = DateTime.fromJSDate(new Date(value), { zone: "Asia/Tokyo" });
    }
    return dt.toJSDate();
  });

  eleventyConfig.addFilter("toLocalDate", function (date) {
    if (!date) return date;
    return DateTime.fromJSDate(new Date(date), {
      zone: "Asia/Tokyo",
    }).toJSDate();
  });

  eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  eleventyConfig.addFilter("randomize", function (items) {
    if (!Array.isArray(items)) return items;
    return [...items].sort(() => 0.5 - Math.random()); // 元の配列を変更しないようコピー
  });

  eleventyConfig.addFilter(
    "truncate",
    function (str, length = 400, useWordBoundary = true, ellipsis = "...") {
      if (!str) return "";
      if (str.length <= length) return str;
      const subString = str.slice(0, length - 1);
      return useWordBoundary
        ? subString.slice(0, subString.lastIndexOf(" ")) + ellipsis
        : subString + ellipsis;
    },
  );

  eleventyConfig.addFilter("excerpt", (post) => {
    if (!post) return "";
    return post
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&nbsp/gi, "&#160;")
      .split(" ")
      .slice(0, 5)
      .join(" ");
  });

  eleventyConfig.addNunjucksFilter("htmlDateString", (dateObj) =>
    new Date(dateObj).toISOString(),
  );

  eleventyConfig.addNunjucksFilter("readableDate", (dateObj) => {
    const date = new Date(dateObj);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  });

  eleventyConfig.addFilter("blogImage", function(path) {
    if (!path) return "";

    // "../img/xxx.avif" → "xxx.avif" を抜き出して /blog/img/ に整形
    const filename = path.split("/").pop();   // ファイル名だけ取り出す
    return `/blog/img/${filename}`;
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("sortByTagMatch", (posts, currentTags, currentUrl) => {
      if (!currentTags || currentTags.length === 0) return [];

      return [...posts]
        .filter((post) => post.url !== currentUrl)
        .map((post) => {
          const postTags = post.data.tags || [];
          const matchCount = postTags.filter((tag) => currentTags.includes(tag)).length;
          return { post, matchCount };
        })
        .filter((item) => item.matchCount > 0)  // 一致が0件は除外
        .sort((a, b) => b.matchCount - a.matchCount)
        .map((item) => item.post);
    });

  // -----------------------------------------------------------------
  // Collections
  // -----------------------------------------------------------------
  eleventyConfig.addCollection("blog", (api) =>
    api.getFilteredByGlob("src/blog/**/*.md").reverse(),
  );
  eleventyConfig.addCollection("guitar", (api) =>
    api.getFilteredByGlob("src/guitar/**/*.md"),
  );
  eleventyConfig.addCollection("guitarAll", (api) =>
    api.getFilteredByGlob("src/guitar/**/*.md"),
  ); // 重複していますが意図的であればOK

  eleventyConfig.addCollection("latestPosts", (api) => {
    return api.getFilteredByGlob("src/**/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("allPosts", (api) =>
    api.getFilteredByGlob("src/**/*.md"),
  );

  eleventyConfig.addCollection("posts", (api) => {
    return api
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("allTags", function (collectionApi) {
    const allTags = new Set();
    collectionApi.getAll().forEach((item) => {
      if (item.data.tags) {
        item.data.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  });

  eleventyConfig.addCollection("categoryTags", function (collectionApi) {
    let categoryTags = {};
    collectionApi.getAll().forEach((post) => {
      // パスからカテゴリ抽出 (例: src/blog/foo.md -> blog)
      // filePathStemは先頭にスラッシュが入るため [1] を取得
      let category = post.filePathStem.split("/")[1];
      let tags = post.data.tags || [];

      if (!categoryTags[category]) categoryTags[category] = {};
      tags.forEach((tag) => {
        categoryTags[category][tag] = (categoryTags[category][tag] || 0) + 1;
      });
    });
    return categoryTags;
  });

  eleventyConfig.addCollection("postsSortedByUpdate", (api) => {
    const normalizeDate = (val) => {
      if (!val) return "0000-00-00";
      const d = new Date(val);
      return isNaN(d.getTime()) ? "0000-00-00" : d.toISOString().slice(0, 10);
    };
    return api.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      const dateA = normalizeDate(a.data.update || a.data.updated || a.data.lastmod || a.data.date);
      const dateB = normalizeDate(b.data.update || b.data.updated || b.data.lastmod || b.data.date);
      return dateB.localeCompare(dateA);
    });
  });

  // -----------------------------------------------------------------
  // Transforms (Minify)
  // -----------------------------------------------------------------
  eleventyConfig.addTransform("compressHTMLOutput", (content, outputPath) => {
    const options = {
      collapseWhitespace: "conservative",
      removeEmptyAttributes: false,
      removeComments: true,
    };
    // 本番環境かつHTMLの場合のみ圧縮
    if (isProduction && outputPath && outputPath.endsWith(".html")) {
      try {
        return htmlmin.minify(content, options);
      } catch (err) {
        console.error("HTML minification failed:", err);
        return content;
      }
    }
    return content;
  });

  // -----------------------------------------------------------------
  // Markdown Library Config
  // -----------------------------------------------------------------
  const mdLib = markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(rubyPlugin, { rp: ["(", ")"] })
    .use(markdownItFigure)
    .use(embedYoutubeDiv)
    .use(attrs, { selectorExceptions: ["table", "table tbody", "tbody"] })
    .use(markdownItMultimdTable, {
      multiline: true,
      rowspan: true,
      headerless: false,
      Multibody: true,
    });

  eleventyConfig.setLibrary("md", mdLib);

  // .gitignore のファイルを監視対象から除外しない（開発中ファイルを検知するため）
  eleventyConfig.setUseGitIgnore(false);
}

export const config = {
  templateFormats: ["md", "njk", "html", "liquid"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dir: {
    input: "src",
    includes: "_includes",
    layouts: "_layouts",
    data: "_data",
    output: "dist",
  },
};

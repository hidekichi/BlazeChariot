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

// 削除: 使われていなかった imports
// import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
// import path from "path";

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
  // 開発環境だけでなく、ビルド時もViteを通してアセット処理を行うと構成がシンプルになります。
  // そのため if (dev) の条件を外すことも検討できますが、
  // 現在のpackage.json構成に合わせて「開発時はVite」「本番は11ty + 後処理」とするならこのまま維持します。
  // ただし、Viteの強みを活かすなら以下のようにオプションを追加します。
  if (!isProduction) {
    eleventyConfig.addPlugin(EleventyPluginVite, {
      viteOptions: {
        resolve: {
          alias: {
            // "/src" というパスを、実際の src フォルダへの絶対パスに紐付ける
            "/src": path.resolve(".", "src"),
          },
        },
        // TailwindなどPostCSSの設定ファイルを自動検知させる
        css: {
          postcss: "./postcss.config.js",
        },
        // 画面クリアを無効化（ログが見やすくなります）
        clearScreen: false,
        // 11tyの再構築トリガー設定
        server: {
          mode: "development",
          middlewareMode: true,
        },
      },
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
  eleventyConfig
    .addPassthroughCopy("src/static")
    .addPassthroughCopy("src/*.{txt,xsl,ico}")
    .addPassthroughCopy("src/blog/**/*.{jpg,jpeg,png,webp,svg,gif,avif}")
    .addPassthroughCopy("src/guitar/**/*.{jpg,jpeg,png,webp,svg,gif,avif,ogg}")
    .addPassthroughCopy("src/pages/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");

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

  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);

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

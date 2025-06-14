import { DateTime } from "luxon";
import { minify } from "terser";
const isProduction = process.env.ELEVENTY_ENV === "production"; // これはそのまま
import htmlnano from "htmlnano"; // 未使用の可能性あり
// const htmlSave = require("htmlnano").presets.safe; // 未使用の可能性あり
import CleanCSS from "clean-css";
import htmlmin from "html-minifier-terser";
import markdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import markdownItFigure from "markdown-it-figure";
import markdownItMultimdTable from "markdown-it-multimd-table-ext";
import rubyPlugin from "markdown-it-ruby";
import { HtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginNavigation from "@11ty/eleventy-navigation";
import postcss from "postcss";
import postcssConfig from "./postcss.config.js"; // postcss.config.js が CommonJS なら要確認
import sitemap from "@quasibit/eleventy-plugin-sitemap";

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import path from 'path';

import EleventyPluginVite from "@11ty/eleventy-plugin-vite";


const embedYoutubeDiv = function(md) {
  const ytpBlock = function(state, startLine, endLine, silent) {
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const src = state.src;

    // ルールを適用する行を特定
    const lineSrc = src.slice(pos, max);

    // 変更点: 正規表現をシンプル化し、ytpとそれに続く全てのクラスをキャプチャ
    // 例: {ytp f-left size-m::アドレス::タイトル} の場合
    // match[1] = "ytp f-left size-m"
    // match[2] = "アドレス::タイトル"
    const match = lineSrc.match(/^{\s*(ytp(?:\s+[a-zA-Z0-9\-]+)*)::(.*)}$/);
    if (!match) {
      return false;
    }

    // 抽出されたクラス名とコンテンツ
    const fullClasses = match[1]; // 例: "ytp f-left size-m"
    const contentStr = match[2]; // 例: "アドレス::タイトル"

    if (!contentStr.trim()) return false; // 中身が空なら無効

    // 最後の '::' を探してアドレスとタイトルを分割
    const lastSepPos = contentStr.lastIndexOf('::');

    let address, title;
    if (lastSepPos !== -1) {
      // タイトルあり
      address = contentStr.slice(0, lastSepPos);
      title = contentStr.slice(lastSepPos + 2);
    } else {
      // タイトルなし
      address = contentStr;
      title = '';
    }

    // アドレスが空の場合は無効
    if (!address.trim()) {
      return false;
    }

    // silent モードでなければトークンを生成
    if (!silent) {
      const token = state.push('ytp_block', '', 0);
      token.content = address.trim();
      token.meta = {
        title: title.trim(),
        // 抽出したクラス名をそのままメタ情報として保存
        classes: fullClasses.trim()
      };

      // このルールは1行だけを消費する
      state.line = startLine + 1;
    }

    return true;
  };

  md.block.ruler.before('paragraph', 'ytp_block', ytpBlock, {
    alt: ['paragraph', 'blockquote']
  });

  md.renderer.rules['ytp_block'] = function(tokens, idx, options, env, self) {
    const address = md.utils.escapeHtml(tokens[idx].content);
    const title = md.utils.escapeHtml(tokens[idx].meta.title);
    // 変更点: トークンから取得したクラス名をそのまま使用
    const classes = md.utils.escapeHtml(tokens[idx].meta.classes || 'ytp'); // 念のためデフォルトを設定

    const titleAttr = title ? ` data-title="${title}"` : '';

    // 変更点: class 属性に取得したクラス名を使用
    return `<div class="${classes}"${titleAttr}>${address}</div>\n`;
  };
};


export default async function (eleventyConfig) {
	if (process.env.ELEVENTY_ENV !== "production") {
		eleventyConfig.addPlugin(EleventyPluginVite);
	}
	
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(pluginNavigation);
	
	eleventyConfig.addPlugin(sitemap, {
		sitemap: {
			hostname: "https://blazechariot.netlify.app",
		},
	});
	
	// Folders to copy to build dir
	eleventyConfig
		.addPassthroughCopy("src/static")
		.addPassthroughCopy("src/*.{txt,xsl}")
		.addPassthroughCopy("src/blog/**/*.{jpg,jpeg,png,webp,svg,gif,avif}")
		.addPassthroughCopy("src/guitar/**/*.{jpg,jpeg,png,webp,svg,gif,avif}")
		.addPassthroughCopy("src/pages/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");

	
	//Filter to parse dates
	eleventyConfig.addFilter("shortDateString", function (dateObj) {
		return DateTime.fromJSDate(dateObj, {
			zone: "utc",
		}).toFormat("yyyy-LL-dd");
	});
	
	eleventyConfig.addFilter('logg', (...args) => {
		console.log(...args)
		debugger;
	});

	// Example Collections
	// Filter source file names using a glob
	eleventyConfig.addCollection("blog", function (collectionApi) {
		return collectionApi.getFilteredByGlob("src/blog/**/*.md");
	});
	
	eleventyConfig.addCollection("guitar", function (collectionApi) {
		return collectionApi.getFilteredByGlob("src/guitar/**/*.md");
	});
	
	eleventyConfig.addCollection("guitarAll", function (collectionApi) {
		return collectionApi.getFilteredByGlob("src/guitar/**/*.md");
	});
	
	//jdate convert
	eleventyConfig.addFilter("postDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});
	
	eleventyConfig.addFilter("getNewestUpdateDate", function(collection) {
	  return collection
		.map(item => item.data.update || item.date)
		.sort((a, b) => new Date(b) - new Date(a))[0];
	});

	eleventyConfig.addFilter("normalizeDateToJST", function (value) {
	  if (!value) return value;

	  // value がすでに Luxon の DateTime ならそのまま
	  if (DateTime.isDateTime(value)) return value.toJSDate();

	  // ISO文字列か日付だけの文字列か
	  let dt;
	  if (typeof value === "string") {
		// すでに時刻を含む場合はそのまま使う
		if (value.includes("T")) {
		  dt = DateTime.fromISO(value, { zone: "Asia/Tokyo" });
		} else {
		  // 時刻なし → 09:00 を補う
		  dt = DateTime.fromISO(`${value}T09:00:00+09:00`);
		}
	  } else {
		// JS Date オブジェクトなど → JST に変換
		dt = DateTime.fromJSDate(new Date(value), { zone: "Asia/Tokyo" });
	  }

	  return dt.toJSDate();
	});
	
	eleventyConfig.addFilter("toLocalDate", function(date) {
	  if (!date) return date;
	  return DateTime.fromJSDate(new Date(date), { zone: "Asia/Tokyo" }).toJSDate();
	});
	
	// rss plugin convert Rfc3339
	eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);
	
	eleventyConfig.addFilter("randomize", function (items) {
		if (!Array.isArray(items)) {
			return items;
		}
		items.sort(() => {
			return 0.5 - Math.random();
		});
	});
	
	eleventyConfig.addFilter("truncate", function (str, length = 400, useWordBoundary = true, ellipsis = "...") {
		if (!str) return "";
		if (str.length <= length) return str;
		const subString = str.slice(0, length - 1); 
		return useWordBoundary 
			? subString.slice(0, subString.lastIndexOf(" ")) + ellipsis 
			: subString + ellipsis;
	});
	
	eleventyConfig.addCollection("allTags", function (collectionApi) {
		const allPages = collectionApi.getAll();
	
		const allTags = new Set();
		// すべてのページをループ
		collectionApi.getAll().forEach((item) => {
		  if (item.data.tags) {
			// タグをセットに追加
			item.data.tags.forEach((tag) => allTags.add(tag));
		  }
		});
		// セットを配列に変換して返す
		return Array.from(allTags).sort();
	});
	
	
	eleventyConfig.addCollection("latestPosts", function(collectionApi) {
		return collectionApi.getFilteredByGlob("src/**/*.md")
		  .sort((a, b) => b.date - a.date); // 新しい順にソート
	});
	
	eleventyConfig.addCollection("allPosts", function(collectionApi) {
		return collectionApi.getFilteredByGlob("src/**/*.md");
	});
  
	eleventyConfig.addCollection("categoryTags", function(collectionApi) {
		let categoryTags = {};

		// 全コレクションの記事を取得
		let allPosts = collectionApi.getAll();

		allPosts.forEach(post => {
			let category = post.filePathStem.split("/")[1]; // blog, guitar など

			let tags = post.data.tags || [];

			if (!categoryTags[category]) {
				categoryTags[category] = {};
			}

			tags.forEach(tag => {
				if (!categoryTags[category][tag]) {
					categoryTags[category][tag] = 0;
				}
				categoryTags[category][tag]++;
			});
		});

		return categoryTags;
	});
  
	//feedPlugin
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		stylesheet: "/pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4
			}
		},
		collection: {
			name: "allPosts",
			limit: 0,
		},
		metadata: {
			language: "ja",
			title: "BlazeChariot",
			subtitle: "BlazeChariotはギター初心者のためとブログのサイトです。11tyと言うので作りました。",
			base: "https://blazechariot.netlify.app/",
			author: {
				name: "Hidekichi"
			}
		}
	});
	
	eleventyConfig.addNunjucksFilter("htmlDateString", (dateObj) => {
		return new Date(dateObj).toISOString();
	});
	
	eleventyConfig.addNunjucksFilter("readableDate", (dateObj) => {
		const date = new Date(dateObj);
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() は0から始まるため、1を加算
		const day = date.getDate();

		// 日本語の日付形式にフォーマット
		return `${year}年${month}月${day}日`;
	});
	
	eleventyConfig.addCollection("posts", function(collectionApi) {
		// 'posts'タグが付いたアイテムを日付の新しい順に取得
		// または、ブログ記事が格納されているディレクトリ glob を指定 (例: "src/blog/*.md")
		return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
			return b.date - a.date; // 新しい記事が上に来るように並べ替え
		});
	});
	
	eleventyConfig.addPlugin(syntaxHighlight, {

		// Line separator for line breaks
		lineSeparator: "\n",

		// Change which Eleventy template formats use syntax highlighters
		templateFormats: ["*"], // default

		// Use only a subset of template types (11ty.js added in v4.0.0)
		// templateFormats: ["liquid", "njk", "md", "11ty.js"],

		// init callback lets you customize Prism
		init: function({ Prism }) {
		  Prism.languages.myCustomLanguage = { /* … */ };
		},

		// Added in 3.1.1, add HTML attributes to the <pre> or <code> tags
		preAttributes: {
		  tabindex: 0,

		  // Added in 4.1.0 you can use callback functions too
		  "data-language": function({ language, content, options }) {
			return language;
		  }
		},
		codeAttributes: {},

		// Added in 5.0.0, throw errors on invalid language names
		errorOnInvalidLanguage: false,
	});

	// Compress/Minify HTML output on production builds
	eleventyConfig.addTransform("compressHTMLOutput", (content, outputPath) => {
		const options = {
			collapseWhitespace: "conservative", // Pass options to the module "collapseWhitespace"
			removeEmptyAttributes: false, // Disable the module "removeEmptyAttributes"
			removeComments: true,
		};
		
		if (outputPath && outputPath.endsWith(".html") && isProduction) {
			try {
				return htmlmin.minify(content, options);
			} catch (err) {
				console.error("HTML minification failed:", err);
				return content; // エラーが発生した場合は元のコンテンツを返す
			}
		}

		return content;
	});
	
	eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
		try {
			const minified = await minify(code);
			callback(null, minified.code);
		} catch (err) {
			console.error("Terser error: ", err);
			// Fail gracefully.
			callback(null, code);
		}
	});
	
	//sitemap
	/*
	const finalOptions = options || {};

	function getSitemap(items) {
		return sitemap(items, finalOptions);
	}
	eleventyConfig.addLiquidShortcode("sitemap", getSitemap);
	eleventyConfig.addJavaScriptFunction("sitemap", getSitemap);
	eleventyConfig.addNunjucksShortcode("sitemap", getSitemap);
	*/
	
	// CSSバンドルの設定
	  eleventyConfig.addBundle("css", {
		transforms: [
		  async function (content) {
			let { page } = this;
			// postcss.config.js の設定を利用
			let result = await postcss(postcssConfig.plugins).process(content, {
			  from: page.inputPath,
			  to: null,
			});
			return result.css;
		  },
		],
	  });
	  
	  eleventyConfig.addTransform("postcss", async function (content) {
		if (this.page.outputPath && this.page.outputPath.endsWith(".css")) {
		  let result = await postcss(postcssConfig.plugins).process(content, {
			from: this.page.inputPath,
			to: this.page.outputPath,
		  });
		  return result.css;
		}
		return content;
	  });
	
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});
	
	const mdLib = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	})
	.use(rubyPlugin, {
		rp: ['(', ')']
	})
	.use(markdownItFigure)
	.use(embedYoutubeDiv)
	.use(attrs, {
		selectorExceptions: ['table', 'table tbody', 'tbody']
	})
	.use(markdownItMultimdTable, {
		multiline: true,
		rowspan: true,
		headerless: false,
		Multibody: true,
	});

	eleventyConfig.setLibrary("md", mdLib);

	// This allows Eleventy to watch for file changes during local development.
	eleventyConfig.setUseGitIgnore(false);
	
	//eleventyConfig.addWatchTarget("src/_assets/css/"); // CSSファイルを監視
	//eleventyConfig.addWatchTarget("src/_assets/scripts/");
	//eleventyConfig.addWatchTarget("./src/**/*.md");

};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "src",          // default: "."
		includes: "_includes",  // default: "_includes" (`input` relative)
		layouts: "_layouts",
		data: "_data",          // default: "_data" (`input` relative)
		output: "dist"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};
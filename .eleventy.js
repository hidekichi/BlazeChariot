const { DateTime } = require("luxon");
const { minify } = require("terser");
const isProduction = process.env.ELEVENTY_ENV === "production";
const htmlnano = require("htmlnano");
const htmlSave = require("htmlnano").presets.safe;
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const htmlmin = require("html-minifier-terser");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const postcss = require("postcss");
const postcssNested = require("./postcss.config.js");
const markdownItMultimdTable = require("markdown-it-multimd-table-ext");
const attrs = require("markdown-it-attrs");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const path = require('path');

module.exports = async function (eleventyConfig) {
	const EleventyPluginVite = (await import("@11ty/eleventy-plugin-vite")).default;
	//eleventyConfig.addPlugin(EleventyPluginVite);
	
	//my URL
	eleventyConfig.addGlobalData("site", {
		url: "https://blazechariot.netlify.app" // あなたのサイトの絶対URL
	});
	
	// Folders to copy to build dir
	eleventyConfig.addPassthroughCopy("src/static");
	eleventyConfig.addPassthroughCopy("src/blog/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");
	eleventyConfig.addPassthroughCopy("src/guitar/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");
	eleventyConfig.addPassthroughCopy("src/pages/**/*.{jpg,jpeg,png,webp,svg,gif,avif}");

	
	//Filter to parse dates
	eleventyConfig.addFilter("htmlDateString", function (dateObj) {
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
	
	eleventyConfig.addFilter("postDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});
	
	eleventyConfig.addFilter("randomize", function (items) {
		if (!Array.isArray(items)) {
			return items;
		}
		items.sort(() => {
			return 0.5 - Math.random();
		});
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
	eleventyConfig.addPlugin(pluginRss);
	
	eleventyConfig.addNunjucksFilter("htmlDateString", (dateObj) => {
		return new Date(dateObj).toISOString();
	});
	eleventyConfig.addNunjucksFilter("readableDate", (dateObj) => {
		return new Date(dateObj).toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'});
	});
	
	eleventyConfig.addGlobalData("site", {
		title: "BlazeChariot",
		description: "ギターを弾き語れ！とLinuxなどPCの事を書いた11tyで作ったブログです。",
		url: "https://blazechariot.netlify.app", // あなたのサイトの絶対URL！重要！
		author: {
		  name: "Hidekichi",
		  url: "https://blazechariot.netlify.app/about/" // 著者ページのURLなど
		}
	});
	
	eleventyConfig.addCollection("posts", function(collectionApi) {
		// 'posts'タグが付いたアイテムを日付の新しい順に取得
		// または、ブログ記事が格納されているディレクトリ glob を指定 (例: "src/blog/*.md")
		return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
			return b.date - a.date; // 新しい記事が上に来るように並べ替え
		});
	});
	
	eleventyConfig.addNunjucksTemplate("atom-feed.njk", `
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ site.title }}</title>
  <subtitle>{{ site.description }}</subtitle>
  <link href="{{ site.url }}/feed.xml" rel="self"/>
  <link href="{{ site.url }}/"/>
  <updated>{{ collections.latestPosts | getNewestCollectionItemDate | htmlDateString }}</updated>
  <id>{{ site.url }}/</id>
  <author>
    <name>{{ site.author.name }}</name>
    <email>{{ site.author.email }}</email>
    <uri>{{ site.author.url }}</uri>
  </author>
  {%- for post in collections.latestPosts -%}
  {%- set absolutePostUrl = site.url + post.url -%}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ absolutePostUrl }}"/>
    <updated>{{ post.date | htmlDateString }}</updated>
    <id>{{ absolutePostUrl }}</id>
    <content type="html"><![CDATA[
      {{ post.templateContent | safe }}
    ]]></content>
  </entry>
  {%- endfor -%}
</feed>
  `, {
    permalink: "/feed.xml" // このURLでフィードが生成されます
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
		// posthtml, posthtml-render, and posthtml-parse options
		// const postHtmlOptions = {
			// lowerCaseTags: true, // https://github.com/posthtml/posthtml-parser#options
			// quoteAllAttributes: false, // https://github.com/posthtml/posthtml-render#options
		// };

		// if (outputPath.endsWith(".html") && isProduction) {
			// return htmlnano
				// .process(content, options, htmlSave, postHtmlOptions)
				// .then(function (result) {
					// return result.html;
				// })
				// .catch(function (err) {
					// console.error(err);
				// });
		// }
		
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
	
	eleventyConfig.setLibrary("md", markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	})
	.use(require('markdown-it-figure'))
	.use(attrs, {
		selectorExceptions: ['table', 'table tbody', 'tbody'] // テーブル要素を処理対象から除外
	})
	.use(markdownItMultimdTable, {
		multiline: true, // 複数行のセルを許可
		rowspan: true, // 行結合を許可
		headerless: false, // ヘッダーなしテーブルを許可
		Multibody: true,
	})
	);

	// This allows Eleventy to watch for file changes during local development.
	eleventyConfig.setUseGitIgnore(false);
	
	//eleventyConfig.addWatchTarget("src/_assets/css/"); // CSSファイルを監視
	//eleventyConfig.addWatchTarget("src/_assets/scripts/");
	//eleventyConfig.addWatchTarget("./src/**/*.md");
	
	return {
		dir: {
			input: "src/",
			output: "dist",
			includes: "_includes",
			layouts: "_layouts",
		},
		templateFormats: ["html", "md", "njk"],
		htmlTemplateEngine: "njk",
		passthroughFileCopy: true,
	};
};

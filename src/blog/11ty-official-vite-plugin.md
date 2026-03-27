---
title: EleventyVite.js から読み解くベスト設定ガイド 11ty+Vite
description: 公式ドキュメントからではわからないので、直接本体ソースを読み解いて、11ty本体はどう設定したら良いのか、Viteはどう言うことが想定されているのかを読み解いて解説します。
date: 2026-03-26
update: 2026-03-26
category:
  - blog
tags:
  - 11ty
  - Vite
images:
  - ../img/helium_toppage.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---


## EleventyVite.js(11ty公式Viteプラグイン)から読み解くベスト設定ガイド

元々がどのようにして作られているかを知らなければ、正しい設定などできはしないと[Githubのソースコード](https://github.com/11ty/eleventy-plugin-vite/tree/main)を読み解いてどう設定するのが良いのだろうかを考えるという話です。

### 公式Viteプラグインの役割

ここでの重要なことは11tyが先にビルドしてViteがその結果を後処理するということです。Viteは11tyを知らず、11tyはViteを知りません。プラグインがその橋渡しをしています。
そのためそのままで使用するとhtmlとcss、jsしか書き出さないことになり、画像やその他はViteによって消されてしまいます((11tyが書き出したものを必要かどうかは知らないのでViteが消してしまう。))。そうならないようにするためには、

- Viteにそれらの処理も任せるように書くか、
- Viteは開発段階の表示のみ担当して、ビルドは11tyに任せる

という割り切り方が必要になると思います。これらは11tyのv3から、

```js
const isServe = process.env.ELEVENTY_RUN_MODE === "serve";
```

というような書き方で判定できるので、開発段階だけViteを使用することができます。これは最後の方で書いておきたいと思います。

もしViteで画像他も扱うという場合については、そのディレクトリ構造などの環境によっても異なる部分がありますが、サイト全体で使用する共用画像他(sitemapやrobots.txt等)は`public/`にぶち込めばコピーされます。
しかし、されていない場合は<u>明確にサイト内で使用されている必要</u>があります。
Viteはそれらを見て必要か不要かを判断して、11tyは正しく書き出しているのに「知らん」とほとんどの場合削除してしまいます。

#### dev時( getServer() )

1. 11tyがビルドをし、outputディレクトリにHTMLを生成
2. Viteがoutputディレクトリをrootとしてmiddlewareで起動
   - HMRとasset解決はViteが担う

#### build時( runBuild() )

1. outputディレクトリを`.11ty-vite`にリネーム(丸ごと移動)
2. `11ty-vite`をrootとしてViteのbuildを実行
   - 入力は `.html`ファイルのみに絞られる
3. viteのoutDirをoutputに設定して書き出し
4. `.11ty-vite`を削除
   - エラー時は`11ty-vite`をoutputに設定して書き出し

#### Viteがわかるものわからないもの

わかるもの

- HTML内の `<script src="...">`、`<link rel="stylesheet">` は自動でバンドル対象
- CSS内の `url("/assets/font/...")`なども自動でコピー対象になる。

Viteに明示的に教える必要があるもの

- `<img src="...">`、`<a href="...pdf">`をはじめ、`robots.txt`、`sitemap.xml`等も教えないとコピーされない

こういう感じです。Viteに教える最も確実な方法は、`public/`に入れることですが、出力も`public/`の中に入るのでパスを工夫する必要があります。

viteのプラグインで`vite-plugin-static-copy`というのがあるので別途導入して、設定ファイルである`eleventy.config.js`の先頭でインポートします。
`src/`からのパスで管理する場合、

```js
viteOptions: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "blog/img/**/*",  // .11ty-vite内のパス
            dest: "blog/img"
          },
          { src: "assets/fonts/**/*", dest: "assets/fonts" },
        ]
      })
    ],
    // ...
}
```

と言う方法もありますし、ファイルとして認識させる場合は、

```js
assetsInclude: ["**/*.pdf", "**/*.xml", "**/*.xsl"]
```

などとして書くこともできます。

これ(`assetsInclude`)は、アセットとして認識しろという<u>宣言だけ</u>なのでHTMLから参照されていないとやはりコピーはされません。
一方、`vite-plugin-static-copy`は参照の有無に関係なく**指定したファイルを強制的にコピーする**ものです。`robots.txt`のようにルート下においてあるだけのものはこちらでやる必要があると思います。あるいは`public/`に入れるかなどでしょうか。

上記サンプルコードでは、`blog/img/**/*`、つまりblog記事が入っているディレクトリに`img/`ディレクトリもあり、記事で使用する画像はこの`img/`に入れて管理するなどの方がわかりやすいと思います。
それら画像を出力する際には`blog/img`にまとめると言う感じの使い方をする記述です。
記事内では、

```njk
_skipCopy_
![画像](/blog/img/xxx.jpg)
```

と書けます。これは(記事の)permalinkの設定がどう書いてあろうと、使用する画像は`/blog/img/`にあるので絶対パスで書くということです。
ここで大事なのは、`src/blog/img/`に画像を入れていくという事だけです。もちろん画像のファイル名を間違えてはいけません。

Viteはあくまで JS/CSS のバンドラーであり、それ以外は明示的に伝えない限り存在を知らないという前提で設計する必要があります。
これが Vite を build にも使う場合の根本的な注意点です。

#### どういうものかのまとめ

公式のViteプラグインは、Viteをフル活用するという設計ではなくあくまでも開発時に、より便利に表示させるものとしてViteを活用するという意味合いが強く、11tyがHTMLを生成し、Viteがjsやcss等を含めビルドで完了となっています。

これがもし、11tyがHTMLを生成し、Viteがjsやcss等を含めビルド、finalyとして静的アセットのコピーができるようにフックが用意されていれば技術的に11ty + Viteはもっと融合して連携できるようになるでしょう。
しかしながらviteのビルド後にはそれで完了となっていますから、アセットのコピーはできないわけです。

- 11tyはHTMLを作るもの
- ViteはJS/CSSを最適化するもの

として設計されていますので、`public/`を経由させる、あるいは`vite-plugin-static-copy`を使って補完するというのがプラグイン側の現在の答えとなっています。
そのため、前述しましたが開発時のみviteを利用して、ビルド時は11tyで行うという形が今日現在の割り切った1つの答えだと思います。

### 11ty側の設定で守るべきこと

outputディレクトリは`./`プレフィックス付きで書く事が必要となります。

```js
# skipCopy
dir: { output: "dist" } // これは壊れる

dir: { output: "./dist" } // 安全
dir: { output: "_site" } // デフォルトのまま使用が最も安全
```

これらの理由として、`runBuild()`内のコードでパスの比較が行われる所からもわかる部分です。

```js
# skipCopy
if (!entry.outputPath.startsWith(this.directories.output)) {
  throw new Error(`Unexpected output path ...`);
}
```

`"dist"`と`"./dist/index.html"`は`startWith`で一致しないので、コマンドライン環境でクラッシュします(ローカルは偶然通ることもあるかも知れませんが)。

#### .11ty-vite を .gitignore と watchIgnores の除外に入れる

```js
eleventyConfig.watchIgnores.add(".11ty-vite/**");
```

ブラグインの`getIgnoreDirectory()`がこのパスを返していて、11tyのwatchIgnoreとし設定されることを前提にしています。ビルドエラー時にこのフォルダが残ることがあります。

- 過去にVite buildを試していた残留
- 何らかの異常終了で残ってしまった
- 将来的にVite buildを試す可能性がある

等で `.11ty-vite/` が存在していると、11tyがそのフォルダを監視・処理しようとしてエラーになります。

Viteを表示のみに使用する場合は不要ともいえますが、置いておいて問題ではないのでお守り的に書いておくのが良いと思います。.gitignore に .11ty-vite を追加しておくのも同様の理由でセットでやっておくと安心です。

#### addPassthroughCopy と setServerPassthroughCopyBehavior

```js
# skipCopy
// Vite の publicDir と対応させるため
eleventyConfig.setServerPassthroughCopyBehavior("copy"); // "passthrough"ではなく"copy"
eleventyConfig.addPassthroughCopy("public");
````

dev時に`passthrough`(デフォルト)だとファイルがoutputにコピーされずViteのrootから見えなくなってしまいます。`"copy"`にするとoutputにコピーされてViteが正しく見つけられます。

これは上記の`watchIgnores`の件と同様でdev時に必要になるものです。ビルドは11tyがするという方法であれば不要です。

### Vite側の設定で守ること

デフォルトでそうなっていますが、`appType: "mpa"`は<u>変更しないようにする</u>ことが最重要設定です。
"mpa"にすることで、Viteは各HTMLファイルを独立したエントリーポイントとして扱います。

"spa"にすると単一エントリーを前提にした処理になり、複数ページの11tyサイトではルーティングが壊れます。
"custom"に変更する場は、rollupOptionsの`input`管理が複雑になるため、理由がない場合は"mpa"のままが一番無難です。

#### viteOptions.rootを自分で設定してはいけない

```js
# skipCopy
// getServer() / runBuild() 内で自動設定される
viteOptions.root = this.directories.output; // dev時
viteOptions.root = tempFolderPath;          // build時
```

`viteOptions`に`root`を自分で書いても、プラグイン側で上書きされるようになっていますので、書いても無意味であり混乱の元になります。

#### publicDir の設定

```js
# skipCopy
viteOptions: {
  publicDir: "public", // プロジェクトルートからの相対パス
}
```

Viteの`publicDir`はプラグイン設定時点での`root`(プロジェクトルート)からの相対パスで解釈されます。ただしビルド時は`root`が`11ty-vite`に変わるために注意が必要です。
`public`と言う名前をoutputディレクトリに使うと衝突が起こるため、outputは`"_site"`や`"dist"`を使って下さい。

#### resolve.alias の /node_modules エイリアス

```js
# skipCopy
resolve: {
  alias: {
    "/node_modules": path.resolve(".", "node_modules"),
  },
},
```

これにより、HTMLテンプレート内から`/node_modules/some-lib/file.js`と言う絶対パスで直接インポートできます。Viteはデフォルトでは `node_modules` への直接パス参照を許可しないため、このエイリアスが必要です。

### Tailwind cssは別プロセスが安定する

公式Viteプラグインのソースコードには **Tailwindを意識したコードがどこにもありません**。

#### build フローでのタイミング問題

- 11tyがビルド
  - この時点でTailwindが未処理だとHTMLにClassはあるがCSSがないということになります
- outputを`.11ty-vite`にリネームする
- ViteがHTMLをバンドル処理

#### Tailwind を ViteのPostCSSプラグインとして組み込んだ場合

- TailwindのJITはHTMLを走査して必要なクラスを確定する
- Viteの`root`はoutput(HTMLが生成された後のフォルダ)なので、元のテンプレートファイル(`src/`)を参照できない
- `content`のパスを`src/**/*.njk`などと明示すると動作するが、build/devでrootが変わるため`content`の相対パスが壊れやすい

これらのことから、`package.json`では、別プロセスとしてTailwindの出力CSSを11tyの`addPassthroughCopy`対処に含め、Viteがそれをバンドルする流れにするのが最も良い方法であると考えられます。
Tailwind v4の場合はCSSの`@import`ベースになるので、ViteのCSS処理と相性が良くなりますが、それでも`content`のパス問題は残ります。

#### 別プロセス化するために

まず、並行してプロセスを起動させるために`concurrently`が必要になります。また別プロセスでTailwind cssを動作させるために`@tailwindcss/cli`が必要((package.jsonのコマンドで使用するため))になります。

```bash
npm install -D concurrently @tailwindcss/cli
```

そして、package.jsonは、11tyを`--serve --incremental`で起動し、`src/assets/css/main.css`を`src/assets/css/output.css`に変更させます。スタイルシートの名称は自身の使用するものに合わせて下さい。

```json
{
  "scripts": {
    "build:css": "tailwindcss -i ./src/assets/css/main.css -o ./src/assets/css/output.css",
    "build": "npm run build:css && eleventy",
    "dev": "concurrently \"tailwindcss -i ./src/assets/css/main.css -o ./src/assets/css/output.css --watch\" \"eleventy --serve --incremental\" "
  }
}
```

<div class="table-container">

|コマンド|注意点・解説|
|------|------|
|`build:css`|-i: inputのcssを -o: outputのcssに変更する。<br>名称が同じだと止まるので作業するcssをstyles.css、出力をstyle.cssのようにする。<br>Tailwindcssもこの時に組み込まれる|
|`build`|`build:css`を動作させてからeleventyを起動して最終出力にする|
|`dev`|ローカルで作業するためのコマンド。<br>Tailwindcssでまず処理させてから変更を監視。その後11tyを起動して作業できるようにする|

</div>

#### バージョンの違いによって書くものが変わる

- Tailwindcss v3を使用している場合、別途`tailwind.config.js`が必要になります。
- v4を使用している場合`tailwind.config.js`は不要でスタイルシートにソースも記載することになります。

v4では、スタイルシート先頭にこのように書きます。

```css
/* main.css */
@import "tailwindcss";

/* contentの代わり。@sourceでCSS内に直接書く */
@source "../src/**/*.njk";
@source "../src/**/*.html";
@source "../src/**/*.md";
```

v3を使用している場合は、まずスタイルシートには、

```css
/* main.css */
/* @importではなく@tailwindディレクティブで読み込む */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

そして別途、`tailwind.config.js`が必要。プロジェクトフォルダ直下(eleventy.config.jsと同じ場所)に置いて次のように書きます

```js
// v3 では tailwind.config.js 必須
export default {
  content: [
    "./src/**/*.njk",
    "./src/**/*.html",
    "./src/**/*.md",
  ],
  // ...
};
````

という設定になります。

### 他のプラグインとの兼ね合い

#### eleventy-plugin-viteは必ず最後に addPlugin する

プラグインは afterBuild イベントと serverMiddleware を登録します。他プラグインが transform や addPassthroughCopy を行うより後に Vite が動く必要があるため、呼び出し順が重要になります。

```js
# skipCopy
eleventyConfig.addPlugin(EleventyPluginNavigation);
eleventyConfig.addPlugin(EleventyPluginRss);
eleventyConfig.addPlugin(EleventyPluginSyntaxhighlight);
eleventyConfig.addPlugin(EleventyVitePlugin, { ... }); // 最後
```

こういう感じに最後に呼び出す。

#### eleventy-img との組み合わせ

`eleventy-img` が生成する画像はoutputディレクトリに書き出されます。Viteは `.html` 以外のアセットを`assetsInclude`で明示しない限り処理対象外とするため、画像はViteのバンドル対象にならず、そのままoutputにコピーされます。
これは意図通りの挙動です。

#### RSS プラグインの XML / sitemap の txt

```js
# skipCopy
assetsInclude: ["**/*.xml", "**/*.txt"],
```

これを設定しないと Vite が XML/TXT ファイルをモジュールとして解釈しようとしてエラーになります。

### 推奨ディレクトリ構造

```ini
project/
├── src/                    # 11ty の input
│   ├── _includes/
│   ├── _data/
│   ├── assets/
│   │   ├── css/main.css    # CSSエントリー（Viteが処理）
│   │   └── js/main.js      # JSエントリー（Viteが処理）
│   └── posts/
├── public/                 # Vite の publicDir（そのままコピー）
│   └── favicon.ico
├── _site/                  # 11ty output（Viteのroot）← "./dist"でなくこちら推奨
├── .11ty-vite/             # 一時フォルダ（.gitignoreに追加）
├── eleventy.config.js      # ESM形式推奨
└── package.json
```

### eleventy.config.js 例

```js
// eleventy.config.js
import path from "path";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {
  // passthrough を実コピーにする（Vite の root から見えるようにするため）
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy("public");

  // Vite プラグインは最後に追加
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    serverOptions: {
      domDiff: false, // Vite HMR と競合するため無効化推奨
    },
    viteOptions: {
      publicDir: "public",
      clearScreen: false,
      appType: "mpa",          // ← MPA必須。変えない
      assetsInclude: ["**/*.xml", "**/*.txt"],
      server: {
        middlewareMode: true,
      },
      build: {
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
          output: {
            assetFileNames: "assets/css/[name].[hash].css",
            chunkFileNames: "assets/js/[name].[hash].js",
            entryFileNames: "assets/js/[name].[hash].js",
          },
        },
      },
      resolve: {
        alias: {
          "/node_modules": path.resolve(".", "node_modules"),
        },
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",      // ← "./dist" でなく "_site" 推奨
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
  };
}
```

デフォルトで設定されているもので省略できる項目をもう少しわかりやすいように。

```js
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {

  // 必須：実コピーにしないとViteのrootから見えない
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy("public");

  eleventyConfig.addPlugin(EleventyVitePlugin, {
    // tempFolderName: ".11ty-vite"  ← デフォルト、省略可
    // appType: "mpa"                ← デフォルト、省略可
    // clearScreen: false            ← デフォルト、省略可
    // server.middlewareMode: true   ← デフォルト、省略可
    // build.emptyOutDir: true       ← デフォルト、省略可
    // resolve.alias["/node_modules"]← デフォルト、省略可

    viteOptions: {
      // 必須：rootがbuild時に変わるため明示が必要
      publicDir: "public",

      // RSSやsitemapを使うなら必要（デフォルト外）
      assetsInclude: ["**/*.xml", "**/*.txt"],

      build: {
        // アセットにハッシュを付けるなら必要（デフォルトはfalse）
        manifest: true,
        rollupOptions: {
          output: {
            assetFileNames: "assets/css/[name].[hash].css",
            chunkFileNames: "assets/js/[name].[hash].js",
            entryFileNames: "assets/js/[name].[hash].js",
          },
        },
      },
    },
  });

  return {
    dir: {
      input: "src",          // デフォルトは"."なので必須
      // output: "_site"     ← デフォルト、省略可
      // includes: "_includes"← デフォルト、省略可
      layouts: "_layouts",   // デフォルトは"_includes"と共用なので分けるなら必須
      // data: "_data"        ← デフォルト、省略可
    },
    // デフォルトは"liquid"なのでnjkを使うなら必須
    htmlTemplateEngine: "njk",
  };
}
````

こんな感じにまとめられます。

#### 更にViteをdev時のみに使用する設定

```js
// import path from "path"; //resolve.alias["/node_modules"]が不要になればこれも
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {

  // 必須：実コピーにしないとViteのrootから見えない
  eleventyConfig.addPassthroughCopy("public");

  const isServe = process.env.ELEVENTY_RUN_MODE === "serve";
  
  if (isServe) {
    eleventyConfig.watchIgnores.add(".11ty-vite/**"); //おまじない的な意味で
    
    // Viteがミドルウェアとして動く
    // "copy"にしないとViteのrootから静的ファイルが見えないので
    // Viteが動作する際には 必須
    eleventyConfig.setServerPassthroughCopyBehavior("copy");
  
    eleventyConfig.addPlugin(EleventyVitePlugin, {
      // tempFolderName: ".11ty-vite"  ← デフォルト、省略可
      // appType: "mpa"                ← デフォルト、省略可
      // clearScreen: false            ← デフォルト、省略可
      // server.middlewareMode: true   ← デフォルト、省略可
      // build.emptyOutDir: true       ← デフォルト、省略可
      // resolve.alias["/node_modules"]← デフォルト、省略可
  
      serverOptions: {
        domDiff: false, // Vite HMR と競合するため無効化推奨
      },
      viteOptions: {
        // 必須：rootがbuild時に変わるため明示が必要
        publicDir: "public",
  
        // RSSやsitemapを使うなら必要（デフォルト外）
        assetsInclude: ["**/*.xml", "**/*.xsl", "**/*.txt"],
  
        build: {
          // アセットにハッシュを付けるなら必要（デフォルトはfalse）
          //manifest: true,
          //rollupOptions: {
          //  output: {
          //    assetFileNames: "assets/css/[name].[hash].css",
          //    chunkFileNames: "assets/js/[name].[hash].js",
          //    entryFileNames: "assets/js/[name].[hash].js",
          //  },
          //},
        },
      },
    });
  }

  return {
    dir: {
      input: "src",          // デフォルトは"."なので必須
      // output: "_site"     ← デフォルト、省略可
      // includes: "_includes"← デフォルト、省略可
      layouts: "_layouts",   // デフォルトは"_includes"と共用なので分けるなら必須
      // data: "_data"        ← デフォルト、省略可
    },
    // デフォルトは"liquid"なのでnjkを使うなら必須
    htmlTemplateEngine: "njk",
  };
}
```

コメントを取り除くとこうなる

```js
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("public");

  const isServe = process.env.ELEVENTY_RUN_MODE === "serve";
  
  if (isServe) {
    eleventyConfig.watchIgnores.add(".11ty-vite/**"); //おまじない的な意味で
    eleventyConfig.setServerPassthroughCopyBehavior("copy");
  
    eleventyConfig.addPlugin(EleventyVitePlugin, {
      serverOptions: {
        domDiff: false,
      },
      viteOptions: {
        publicDir: "public",
        assetsInclude: ["**/*.xml", "**/*.xsl", "**/*.txt"],
        build: {},
      },
    });
  }

  return {
    dir: {
      input: "src",
      layouts: "_layouts",
    },
    htmlTemplateEngine: "njk",
  };
}
```


## まとめ

11tyの公式プラグインViteの本質としては、11tyとViteを繋ぐためのアダプターであり、どちらかがもう一方を内包しているわけではないので、互いに知らない者同士を設定することになるため起点を正しく設定することが大切になります。
outputフォルダがViteのrootになるという設計上、outputに相当する相対パスの書き方、build順序が色々起こる問題の根源になっています。

Tailwindの別プロセス化も、RSSの`assetsInclude`も全てこのViteはoutputしか見えていないということから理解できるのではないかと思います。

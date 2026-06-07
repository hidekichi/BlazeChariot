---
title: EleventyVite.js から読み解くベスト設定ガイド 11ty+Vite
description: 公式ドキュメントからではわからないので、直接本体ソースを読み解いて、11ty本体はどう設定したら良いのか、Viteはどう言うことが想定されているのかを解説します。
date: 2026-03-26
update: 2026-05-31
category:
  - blog
tags:
  - 11ty
  - Vite
images:
  - ../img/11ty-vite-plugin.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## EleventyVite.js(11ty公式Viteプラグイン)から読み解くベスト設定ガイド

![11ty vite plugin](../img/11ty-vite-plugin.avif)

元々がどのようにして作られているかを知らなければ、正しい設定などできはしないと[Githubのソースコード](https://github.com/11ty/eleventy-plugin-vite/tree/main)を読み解いてどう設定するのが良いのだろうかを考えるという話です。

### どういう経緯でViteだとなったか

11tyだけでもライブ(自動)リロードはあります。記事を更新して保存するとブラウザに反映させるというやつです。記事を書くだけならこれで問題はないと思いますが、JavaScriptや画像の追加をしてもそれは更新されないのです。
あるいは記事を更新したからと言ってJavaScriptが再読み込みはされないのです。すると自ずと手動更新なので何のためのライブリロードなんだと。

と言っても画像の追加などはブラウザの更新をする必要があったりなので、そのあたりはViteでも完全にとは言いにくいところではあるのですが、その他は少なからず何か変更があれば反映はされると思います。以下の解説ではViteでは前述したように「必ずとは言い難くとも」ほぼ更新されるようにはしてあります。

更新したものが反映されないと、ちょっとした変更をするだけでもブラウザを手動更新となり、それがもう面倒くさくて。
ある程度できてしまえばあとは記事を書いていくだけなのでそれほどではないかも知れませんが、そこに至るまでが面倒くさいわけです。だからViteだとなりました。

しかしその設定が大変なんですよ。

### 公式Viteプラグインの役割

ここでの重要なことは<u>11tyが先にビルド</u>して<u>Viteがその結果を後処理</u>するということです。Viteは11tyを知らず、11tyはViteを知りません。そこをこの<u>プラグインがその橋渡し</u>をしています。
そのためそのままで使用するとせっかく11tyが全てをビルドしているのに、Viteはhtmlとcss、jsしか書き出さないことになり、画像やその他はViteによって消されてしまいます((11tyが書き出したものを必要かどうかは知らないのでViteが消してしまう。))。そうならないようにするためには、

- Viteにそれらの処理も任せるように書く
- Viteは開発段階の表示のみ担当して、ビルドは11tyに任せる

という割り切り方が必要になると思います。これらは11tyのv3から、

```js
const isServe = process.env.ELEVENTY_RUN_MODE === "serve";
```

というような書き方で判定できるので、開発段階だけViteを使用することができます。これは最後の方で書いておきたいと思います。

もしViteで画像他も扱うという場合については、そのディレクトリ構造などの環境によっても異なる部分がありますが、サイト全体で使用する共用画像他(sitemapやrobots.txt等)は`public/`にぶち込めばおおよそコピーされます。
しかし、されていない場合は<u>明確にサイト内で使用されている必要</u>があるわけです。
Viteはそれらを見て必要か不要かを判断して、11tyは正しく書き出しているのにViteは「知らん」とほとんどの場合削除してしまうのです。

#### dev時( getServer() )

1. 11tyがビルドをし、outputディレクトリにHTMLを生成
2. Viteがoutputディレクトリをrootとしてmiddlewareで起動
   - HMRとasset解決はViteが担う

#### build時( runBuild() )

1. outputディレクトリを`.11ty-vite`にリネーム(丸ごと移動)
2. `.11ty-vite`をrootとしてViteのbuildを実行
   - 入力は `.html`ファイルのみに絞られる
3. viteのoutDirをoutputに設定して書き出し
4. `.11ty-vite`を削除
   - エラー時は`.11ty-vite`をoutput(`_site/`等)に設定して書き出し

#### Viteがわかるものわからないもの

わかるもの

- HTML内の `<script src="...">`、`<link rel="stylesheet">` は自動でバンドル対象
- CSS内の `url("/assets/font/...")`なども自動でコピー対象になる。
- 使用している画像などは<u>何も設定しないとbase64でcssとしてまとめられる</u>

Viteに明示的に教える必要があるもの

- `<img src="...">`、`<a href="...pdf">`をはじめ、`robots.txt`、`sitemap.xml`等も教えないとコピーされない

こういう感じです。Viteに教える最も確実な方法は、`public/`に入れることですが、出力も`public/`の中に入るのでパスを工夫する必要があります。

例えばですが、アセットのコピーを半ば強引にするためにviteのプラグインで`vite-plugin-static-copy`というのがあるので別途導入して、設定ファイルである`eleventy.config.js`の先頭でインポートすることができます。
`src/`からのパスで管理する場合、

```js
viteOptions: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            // .11ty-vite内のパス
            // コメントのため縦二行で書いているが実際は下のassets/fonts/**/*のような感じでもよい
            src: "blog/img/**/*", // 入力ソース
            dest: "blog/img"      // 出力
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
Markdownの記事内では、

```njk
_skipCopy_
![画像](/blog/img/xxx.jpg)
```

と書けます。これは(記事の)permalinkの設定がどう書いてあろうと、使用する画像は`/blog/img/`にあるので絶対パスで書くということです。
ここで大事なのは、`src/blog/img/`に画像を入れていくという事だけです。もちろん画像のファイル名を間違えてはいけません。
とまぁ、シンプルなサイトであれば、必要なものを`vite-plugin-static-copy`で書けばよいわけですがやっぱり面倒なのは変わりません。こういうプラグインがあること自体皆同じような悩みを持っているんだなぁとも思います。

Viteはあくまで <u>JS/CSS のバンドラー</u>であり、それ以外は明示的に伝えない限り存在を知らないという前提で設計する必要があります。
これが Vite を build にも使う場合の根本的な注意点です。

#### どういうものかのまとめ

11ty公式のViteプラグインは、Viteをフル活用するという設計ではなくあくまでも開発時により便利に表示させるものとしてViteを活用するという意味合いが強く、11tyがHTMLを生成し、Viteがjsやcss等を含めビルドで完了となっています。

これがもし、11tyがHTMLを生成し、Viteがjsやcss等を含めビルド、finallyとして静的アセットのコピーができるようにフックが用意されていれば技術的に11ty + Viteはもっと融合して連携できるようになるでしょう。
しかしながらviteのビルド後にはアセットには触れず、HTMLとCSS、JSをバンドル・ビルドしてそれで完了となっていますから、11tyがパススルーコピーをしていてもViteがビルドしたHTML他のビルドで上書きしてしまい11tyのパススルーコピーしていたアセットのコピーは簡単にはできないわけです。

- 11tyはHTMLを作るもの
- ViteはJS/CSSを最適化するもの

として設計されていますので、`public/`を経由させる、あるいは`vite-plugin-static-copy`を使って補完するというのがプラグイン側の現在の答えとなっています。
そのため、前述しましたが開発時のみviteを利用して、ビルド時は11tyで行うという形が、今日現在の割り切った1つの答えだと思います。

### 11ty側の設定で守るべきこと

outputディレクトリは`./`プレフィックス付きで書く事が必要となります。

```js
# skipCopy
dir: { output: "dist" }   // これは壊れる

dir: { output: "./dist" } // 安全
dir: { output: "_site" }  // デフォルトのまま使用が最も安全
```

これらの理由として、`runBuild()`内のコードでパスの比較が行われる所からもわかる部分です。

```js
# skipCopy
if (!entry.outputPath.startsWith(this.directories.output)) {
  throw new Error(`Unexpected output path ...`);
}
```

`"dist"`と`"./dist/index.html"`は`startWith`で一致しないので、コマンドライン環境でクラッシュします(ローカルは偶然通ることもあるかも知れませんが)。

> startsWith() は String 値のメソッドで、文字列が引数で指定された文字列で始まるかを判定して true か false を返します

#### .11ty-vite を .gitignore と watchIgnores の除外に入れる

```js
eleventyConfig.watchIgnores.add(".11ty-vite/**");
```

ブラグインの`getIgnoreDirectory()`がこのパスを返していて、11tyのwatchIgnoreとし設定されることを前提にしています。<u>ビルドエラー時にこのフォルダが残ることがあります</u>。
残ってしまうとそれらもGithubなどにpushする際の候補にもなってしまいますので無視リストに入れるわけです。また、

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

これは上記の`watchIgnores`の件と同様で<u>dev時に必要になる</u>ものです。ビルドは11tyがするという方法であれば不要です。

### Vite側の設定で守るべきこと

<u>デフォルトでそうなっています</u>が、`appType: "mpa"`は<u>変更しないようにする</u>ことが最重要設定です。
"mpa"にすることで、Viteは各HTMLファイルを独立したエントリーポイントとして扱います。

"spa"にすると単一エントリーを前提にした処理になり、複数ページで構成される11tyサイトではルーティングが壊れます。
"custom"に変更する場は、rollupOptionsの`input`管理が複雑になるため、理由がない場合は"mpa"のままが一番無難です。

#### viteOptions.rootを自分で設定してはいけない

```js
# skipCopy
// getServer() / runBuild() 内で自動設定される
viteOptions.root = this.directories.output; // dev時
viteOptions.root = tempFolderPath;          // build時
```

`viteOptions`に`root`を自分で書いても、<u>プラグイン側で上書きされるようになっています</u>ので、書いても無意味であり混乱の元になります。

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
あくまでも補助的なものとして考えている感じなので、自身で工夫して入れるような感じになります。

#### build フローでのタイミング問題

- 11tyがビルド
  - この時点でTailwindが未処理だとHTMLにTailwindCSSのClassは書いてあるが<u>CSSがない</u>ということになります
  - 11tyが出力する前にTailwindのcssが存在する必要がありますが、デフォルトではそれら処理がないのでhtmlにクラスがあるだけという状態です
- outputを`.11ty-vite`にリネームする
- ViteがHTMLをバンドル処理
  - ここで各種設定が行われるわけなので、素のHTMLが表示された後それをViteが上書きしてようやく完成形が表示される

つまりTailwindCSSは予め使用できる状態になったものを用意してからHTMLを用意しないといけないが、HTMLの記載がなければ使用するものが何かを判断もできないというタイミング問題があるのです。

#### Tailwind を ViteのPostCSSプラグインとして組み込んだ場合

- TailwindのJITはHTMLを走査して必要なクラスを確定する
- Viteの`root`はoutput(HTMLが生成された後のフォルダ、デフォルトは`_site/`)なので、元のテンプレートファイル(`src/`)を参照できない
- Tailwindcssの`content`のパスを`src/**/*.njk`などと明示すると動作するが、build時/dev時でrootが変わるため`content`の相対パスが壊れやすい

> JITモードとは
> テンプレートを解析してスタイルをオンデマンドで生成する仕組みです。

これらのことから、`package.json`では、別プロセスとしてTailwindの出力CSSを11tyの`addPassthroughCopy`対処に含め、Viteがそれをバンドルする流れにするのが最も良い方法であると考えられます。
Tailwind v4の場合はCSSの`@import`ベースになるので、ViteのCSS処理と相性が良くなりますが、それでも`content`のパス問題は残ります。

#### 別プロセス化するために

11tyとViteを別物として動作させる場合はまず、並行してプロセスを起動させるためにnpmパッケージの`concurrently`が必要になります。また別プロセスでTailwind cssを動作させるために`@tailwindcss/cli`が必要((package.jsonのコマンドで使用するため))になります。

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
|`build:css`|-i: inputのcssを -o: outputのcssに変更する。<br>名称が同じだと止まるので作業するcssをmain.css、出力をstyle.cssのようにする。<br>Tailwindcssもこの時に組み込まれる|
|`build`|`build:css`を動作させてからeleventyを起動して最終出力にする|
|`dev`|ローカルで作業するためのコマンド。<br>Tailwindcssでまず処理させてから変更を監視。その後11tyを起動して作業できるようにする|

</div>

build時、つまりはリモートではまずTailwindcssを用意してから11tyをビルドします。
dev時、つまりはローカルで作業する際は`concurrently`でこれらを同時にやります。build時にもなぜ同様にしないかは、htmlの各種変更の監視、Tailwindcssの監視とかが必要になるからです。build時には監視するという作業は必要ありません。
ローカルでhtmlだけ更新しても対応するcssが更新されないと意味がないですしまた逆も然り。なのでそれぞれの変更のたびに監視する機能の並行起動がdev時には必要なのです。build時は全部できていますから順番にそれぞれをビルドするだけでいいということです。

#### バージョンの違いによって書くものが変わる

- Tailwindcss v3を使用している場合、別途`tailwind.config.js`が必要になります。
- v4を使用している場合`tailwind.config.js`は不要でスタイルシートにソースも記載することになります。

v4では、スタイルシート先頭にこのように書きます。作り方によってはこれら(`content`部分に当たる`@souce`)は不要です。

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

そして別途、`tailwind.config.js`が必要。プロジェクトフォルダ直下(eleventy.config.jsと同じ場所)に置いて次のように書きます。

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
// skipCopy
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

## ここまでを踏まえて

基本的にここまでの話は、11tyとViteを別物として動作させる場合の話です。

### ディレクトリ構造

```ini
project/
├── src/                    # 11ty の input
│   ├── _includes/
│   ├── _data/
│   ├── assets/
│   │   ├── css/main.css   # CSSエントリー（Viteが処理）
│   │   └── js/main.js     # JSエントリー（Viteが処理）
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
      domDiff: false,       // Vite HMR と競合するため無効化推奨
    },
    viteOptions: {
      publicDir: "public",
      clearScreen: false,
      appType: "mpa",       // ← MPA必須。変えない
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
      input: "src",           // デフォルトは"."なので必須
      // output: "_site"      ← デフォルト、省略可
      // includes: "_includes ← デフォルト、省略可
      layouts: "_layouts",    // デフォルトは"_includes"と共用なので分けるなら必須
      // data: "_data"        ← デフォルト、省略可
    },
    // デフォルトは"liquid"なのでnjkを使うなら必須
    htmlTemplateEngine: "njk",
  };
}
````

こんな感じにまとめられます。

#### 更にViteをdev(開発・ローカル編集)時のみに使用する設定

```js
// import path from "path"; //resolve.alias["/node_modules"]が不要になればこれも
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

const isServe = process.env.ELEVENTY_RUN_MODE === "serve";

export default function (eleventyConfig) {

  // 必須：実コピーにしないとViteのrootから見えない
  eleventyConfig.addPassthroughCopy("public");
  
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
      input: "src",             // デフォルトは"."なので必須
      // output: "_site",       ← デフォルト、省略可
      // includes: "_includes", ← デフォルト、省略可
      layouts: "_layouts",      // デフォルトは"_includes"と共用なので分けるなら必須
      // data: "_data",         ← デフォルト、省略可
    },
    // デフォルトは"liquid"なのでnjkを使うなら必須
    htmlTemplateEngine: "njk",
  };
}
```

コメントを取り除くとこうなります。

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

この例はMarkdownの設定なども書いていませんのでこのままで動作を保証するものではありません。あくまで例です。

その際の`package.json`は、

```json
{
  "name": "",
  "version": "1.0.0",
  "main": "index.js",
  "devDependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@11ty/eleventy-img": "^6.0.4",
    "@11ty/eleventy-navigation": "^1.0.5",
    "@11ty/eleventy-plugin-rss": "^2.0.4",
    "@11ty/eleventy-plugin-syntaxhighlight": "^5.0.2",
    "@11ty/eleventy-plugin-vite": "^7.0.0",
    "@quasibit/eleventy-plugin-sitemap": "^2.2.0",
    "@tailwindcss/cli": "^4.2.2",
    "@tailwindcss/vite": "^4.2.1",
    "concurrently": "^9.2.1",
    "cross-env": "^10.1.0",
    "lightningcss": "^1.32.0",
    "markdown-it": "^14.1.1",
    "markdown-it-attrs": "^4.3.1",
    "markdown-it-multimd-table-ext": "^4.2.35",
    "markdown-it-ruby": "^1.1.2",
    "tailwindcss": "^4.2.1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "scripts": {
    "build:css": "npx @tailwindcss/cli -i ./src/assets/css/main.css -o ./src/assets/css/style.css",
    "build": "npm run build:css && eleventy",
    "dev": "concurrently \"eleventy --serve --incremental\" \"npx @tailwindcss/cli -i ./src/assets/css/styles.css -o ./src/assets/css/style.css --watch\" ",
    "preview": "npx serve _site",
    "clean": "node --eval \"fs.rmSync('_site',{recursive:true,force:true}); fs.rmSync('.cache',{recursive:true,force:true}); fs.rmSync('.vite',{recursive:true,force:true}); fs.rmSync('.11ty-vite-temp',{recursive:true,force:true})\""
  },
  "description": ""
}
```

上記`"main":"index.js"`はなんで入っているのかわかりません笑 そんなもの使用していないしで。
使っていたものをそのまま貼ったので不要なものが入っているかも知れません。

1. `build:css`がtailwindcssのcssを作る所です。ローカルで作業するcssは`main.css`です。それを`src/assets/css/style.css`に書き出します
2. 書き出されたcssを元に、eleventyが動作します。
3. eleventy.config.jsでは、`eleventyConfig.addPassthroughCopy("src/assets/css/style.css");`をコピーします。他必要なアセットも。
4. cssは3.でできているのでViteの管理から外す必要があります

```js
  const isServe = process.env.ELEVENTY_RUN_MODE === "serve";

  if (isServe) {
    eleventyConfig.setServerPassthroughCopyBehavior("copy");
    eleventyConfig.watchIgnores.add(".11ty-vite/**");

    eleventyConfig.addPlugin(vitePlugin, {
      serverOptions: {
        domDiff: false,
      },
      viteOptions: {
        publicDir: "public",
        assetsInclude: ["**/*.xml", "**/*.txt"],
        server: {
          mode: "development",
          middlewareMode: true,
          hmr: { overlay: true },
            watch: {
              // パススルーコピーされるJSはViteの監視対象から除外
              ignored: [
                "**/assets/js/*.js",
                "**/assets/js/**/*.js",
                //"**/assets/css/style.css",
              ],
            },
          },
        build: {
          emptyOutDir: true,
        },
      },
    });
  }
```

Viteの設定はこんなふうに書いていました。コメントにもあるように、jsを監視させないようにしてあるため、純粋に「11tyがファイルを書き出してTailwindがcssを作って」の部分に<u>Viteは一切関与しません</u>。単にHMRとリロードをするだけとも言えます。jsは変更があればこれらが走ります。cssも一応見てますが関与はしていません。HMRをするだけです。ファイルが変更されたというのを監視しているという方が正しいのでしょうか。
**11tyの足りない部分を補う**だけと言う感じです。

しかしながら、それらを設定して、他のプラグインなどは試していませんが、11tyとviteとtailwindcss(v4)を個別に動作させ最終的にまとめるという方法であれば機能しました。
この場合、

- 11tyだけでhtmlの生成、アセット(画像やrobots.txt等)はパススルーコピー
- ViteはHMRと自動ページリロード
- tailwindは自身がcssをビルド

を、行うため一番間違いがない構成であると思います。ほとんど11tyがしてますから。

このまま真似てもエラーが出ることもあるでしょうから諸々は修正しないといけませんが、基本的には11tyがほとんどサイトを作っているため問題が起きにくい構成とも言えると思います。

## 当サイトの独自構造

11tyとViteを別々で動作させる方の検証等に色々と時間がかかってしまったと言う感じですが、当サイトでは別々ではなくある意味簡易的に融合させてあります。
基本は11tyがしていますがViteは本来のバンドラーとして動いており、かつTailwindCSSのビルドなども含めJS/CSSの管理をしながら、独自スクリプトで11tyのパススルーコピーをインターセプトしてViteに渡して処理させるという、公式Viteプラグインで足りない部分を補う形にしています。

### 当サイトのディレクトリ構成

```ini
project/
├── src/                    # 11ty の input
│   ├── _data/
│   ├── _includes/
│   │   ├── components/
│   │   └── layouts/
│   ├── _plugins/
│   │   └── eleventy-passthrough-bridge.js
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css    # CSSエントリー（Viteが処理）
│   │   │   ├── font-settings.css
│   │   │   └── 各種リセットcssなど
│   │   ├── fonts/
│   │   ├── images/         # サイト全体で使用する画像など
│   │   └── js/
│   │       ├── modules/
│   │       └── main.js     # JSエントリー（Viteが処理）
│   ├── blog/
│   ├── guitar/
│   ├── public/
│   │   ├── ogp画像
│   │   └── robots.txt
│   ├── about.md
│   ├── index.njk
│   └── sitemap.njk
├── _site/                  # 11ty output（Viteのroot）← "./dist"でなくこちら推奨
├── .11ty-vite/             # 一時フォルダ（.gitignoreに追加）
├── feed.xml
├── eleventy.config.js      # ESM形式推奨
└── package.json
```

別々に11tyとViteを動かす時のディレクトリ例からすると多少ややこしくなっていますが基本的には同じような構造をしています。

### sitemap.njk等のパスに注意

通常は、

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
```

こんな感じに`https://ドメイン`の後にsitemapが来るように出力するわけですが、

```njk
---
permalink: /public/sitemap.xml
eleventyExcludeFromCollections: true
---
```

このようにしてViteがわかるようにパスを書き換える必要があります。11tyをビルドした後、sitemap.xmlが`_site/`直下にない場合はパスの設定をまず疑って下さい。パスも配置も正しいのに出力されていないという場合はViteの設定に不備があるかも知れません。

### JS/CSSを完全にViteに任せるには

これはViteの本来の使い方です。11tyが作ったHTMLからViteが`<script type="module" src="/assets/js/scripts.js></script>`などを調べ、その`scripts.js`に記載がある`import "@css/style.css"`などを解析しTailwindのcssもJavascriptも適用しながら、各アセットも場合によっては`[file-name]-[hash].[css]`としてBase64で変換したりしてまとめられたり、同様の形式でjsもViteから操作ができる形に加工されて処理されます。

ここで、

1. 新たに記事などを修正すると11tyがそれらを書き換えます。
2. ファイルが変更されたと感知すると、Viteはそれらを再処理してHMRもしくはPage-Reloadを行います

問題は11tyも`_site/`にファイルを書き出していて、Viteは`11ty-vite/`と一時的に作業フォルダを作り、そこに処理したものを書き出して`_site`にリネームされている点です。
Viteは<u>11tyが処理した後から自身のビルドをしている</u>ので、Viteが本来のようにアセットも何もかもうまく処理して`_site/`に書き出してくれればよいですが、<u>プラグイン側の設定にはhtmlの受け渡ししかない</u>ためアセットが消えるという事態になります。

そこで、だったら11tyの`passthroughCopy`するアセットをインターセプトして、別で保持した後Viteに普通に処理をさせた後で戻せば良いとなったわけです。
以下がそのスクリプトです。

```js
// eleventy-passthrough-bridge.js
import path from 'path';
import fs from 'fs-extra';
import fg from 'fast-glob';

export default function EleventyPassthroughBridge(eleventyConfig, userOptions = {}) {
  const passthroughEntries = [];
  const verbose = userOptions.verbose ?? false;
  const projectRoot = process.cwd(); // ← プロジェクトルートを基準にする

  const _orig = eleventyConfig.addPassthroughCopy.bind(eleventyConfig);
  eleventyConfig.addPassthroughCopy = function (entry, copyOptions = {}) {
    passthroughEntries.push({ entry, copyOptions });
    return _orig(entry, copyOptions);
  };

  eleventyConfig.on('eleventy.after', async ({ dir, runMode }) => {
    if (runMode !== 'build') return;

    if (verbose) console.log('[passthrough-bridge] Restoring passthrough files after Vite...');

    for (const { entry } of passthroughEntries) {
      await restoreEntry(entry, dir.input, dir.output, projectRoot, verbose);
    }
  });
}

async function restoreEntry(entry, inputDir, outputDir, projectRoot, verbose) {
  try {
    if (typeof entry === 'string') {
      const isGlob = fg.isDynamicPattern(entry);

      // cwd はプロジェクトルート、entryはそのまま使う
      const files = await fg(isGlob ? entry : `${entry}/**/*`, {
        cwd: projectRoot,
        dot: true,
        onlyFiles: true,
      });

      for (const file of files) {
        // inputDir プレフィックス（例: "src/"）を除去してdestを計算
        const inputPrefix = inputDir.endsWith('/') ? inputDir : inputDir + '/';
        const destRelative = file.startsWith(inputPrefix)
          ? file.slice(inputPrefix.length)
          : file;

        const src = path.join(projectRoot, file);
        const dest = path.join(projectRoot, outputDir, destRelative);

        await fs.ensureDir(path.dirname(dest));
        await fs.copy(src, dest, { overwrite: true });
        if (verbose) console.log(`  [restore] ${src} → ${dest}`);
      }
    } else if (typeof entry === 'object' && entry !== null) {
      for (const [srcRel, destRel] of Object.entries(entry)) {
        const srcAbs = path.resolve(projectRoot, srcRel);
        const destAbs = path.resolve(projectRoot, outputDir, destRel || path.basename(srcRel));

        const stat = await fs.stat(srcAbs).catch(() => null);
        if (!stat) continue;

        if (stat.isDirectory()) {
          const files = await fg('**/*', { cwd: srcAbs, dot: true, onlyFiles: true });
          for (const f of files) {
            const src = path.join(srcAbs, f);
            const dest = path.join(destAbs, f);
            await fs.ensureDir(path.dirname(dest));
            await fs.copy(src, dest, { overwrite: true });
            if (verbose) console.log(`  [restore] ${src} → ${dest}`);
          }
        } else {
          await fs.ensureDir(path.dirname(destAbs));
          await fs.copy(srcAbs, destAbs, { overwrite: true });
          if (verbose) console.log(`  [restore] ${srcAbs} → ${destAbs}`);
        }
      }
    }
  } catch (err) {
    console.error('[passthrough-bridge] Error restoring entry:', entry, err);
  }
}
```

11tyの内部構造はわかりませんから、何がどうなった時にこうしたいというのをおおよそ書いた仕様をAIに渡して、組み上げてもらったコードですが、これを使用することで、11tyの`addPassthroughCopy`をそのままに使って、画像が消えること無く`_site/`をビルドできました。実際に今使用しているものもこれです。
上記をコピーしファイル名を`eleventy-passthrough-bridge.js`として新たに`src/_plugins/`を作成し、その中に入れます。呼び出しはeleventy.config.jsでインポートしています。

11tyの処理、Viteの処理の後で動くものですからその分全体のビルドでは本来の11tyより多少時間がかかります。規模によりけりとなるでしょうが極端な待ち時間があるわけではありません。そもそもViteは高速ですから。
現在の当サイトの場合、 Copied 364 Wrote 151 files in 1.10 seconds (7.3ms each, v3.1.2) とログにでてました。

これらはおそらく11tyで使用する際の最大の問題点であるアセット(画像やhtml,css,js以外の部品的なもの)が消えてしまうのを回避できるのと、ほぼ11tyの設定はそのままに書けるため現時点でのベストプラクティスだろうと思います。

- 11tyがhtmlやその他を作り、ViteはHMRや自動リロードのみを担当するセパレート型
- 11tyは本来の働きをし、ViteはViteの働きをし、としながらもその問題点をスクリプトで解決する

このスクリプトは後者に当たります。

#### 当サイトのeleventy.config.js抜粋

<div class="border-2 border-indigo-500 p-4">

一部、旧バージョンのコードを載せてしまっていたため正しく動作しなかったのが発覚しました。修正したものを掲載しました。
場所的には、以下の`viteOptions:`の下にある`plugins: [tailwind({...}),`の後、`{name: 'watch-src-js, ...}'`の部分です。これがないとJavaScriptを更新してもブラウザの自動リロードが行われませんでした。
2026/5/31の修正版(以下)では正しく動作するのを当サイト、また今作ってる[VidPick](https://vidpick.pages.dev/)でも確認しました。
</div>

```js
// 必要なものだけ抜粋してあるのでフィルターその他で必要であれば別途導入・インポートが必要

import path from "path";
import tailwind from "@tailwindcss/vite";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import markdownIt from "markdown-it";
import EleventyPassthroughBridge from './src/_plugins/eleventy-passthrough-bridge.js';

const isServe = process.env.ELEVENTY_RUN_MODE === "serve";

export default function (eleventyConfig) {
  //ignore
  eleventyConfig.watchIgnores.add("src/assets");

  // passthrough を実コピーにする（Vite の root から見えるようにするため）
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy("public");

  // -----------------------------------------------------------------
  // plugins
  // -----------------------------------------------------------------
  
  // ここに各種プラグインの読み込み

  // Vite プラグインは最後に追加
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    tempFolderName: ".11ty-vite",
    serverOptions: {
      domDiff: false, // Vite HMR と競合するため無効化推奨
    },
    viteOptions: {
      plugins: [tailwind(
        // { content: ['./src/**/*.{html,njk,md,js}'], } 
      ),
          {
            name: 'watch-src-js',
            configureServer(server) {
                server.watcher.add(path.resolve('./src/assets/js'));
                server.watcher.on('change', (file) => {
                  // バックスラッシュをスラッシュに統一して比較
                  if (file.replace(/\\/g, '/').includes('src/assets/js')) {
                    server.ws.send({ type: 'full-reload' });
                  }
                });
              }
          }
      ],
      publicDir: "public",
      clearScreen: false,
      appType: "mpa",
      assetsInclude: ["**/*.xml", "**/*.txt"],
      server: {
        middlewareMode: true,
        watch: {
            ignored: [
              '**/.11ty-vite/assets/js/**',
              '**/.11ty-vite/assets/images/**',
              '**/.11ty-vite/assets/fonts/**',
              '**/_site/**',
            ]
          }
      },
      build: {
        emptyOutDir: true,
        manifest: true,
        assetsInlineLimit: 0,
        rollupOptions: {
          output: {
            /*
            // Viteがアセットをbase64でcss化してしまう場合に
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) {
                return 'assets/css/[name].[hash][extname]';
              }
              if (/\.(png|jpe?g|gif|svg|avif|webp|ico)$/.test(assetInfo.name ?? '')) {
                return 'assets/images/[name].[hash][extname]';
              }
              if (/\.(woff2?|ttf|eot|otf)$/.test(assetInfo.name ?? '')) {
                return 'assets/fonts/[name].[hash][extname]';
              }
              return 'assets/[name].[hash][extname]';
            },
            */
            // assetFileNames: "assets/css/[name].[hash].css",
            chunkFileNames: "assets/js/[name].[hash].js",
            entryFileNames: "assets/js/[name].[hash].js",
          },
        },
      },
      resolve: {
        alias: {
          '@css': path.resolve('./src/assets/css'),
          "/node_modules": path.resolve(".", "node_modules"),
        },
      },
    },
  });
  eleventyConfig.addPlugin(EleventyPassthroughBridge, { verbose: true });


  // -----------------------------------------------------------------
  // Passthrough
  // -----------------------------------------------------------------
  
  // ここは各々コピーするものが変わると思いますが、
  // 例として書いておきます
  
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/_plugins");
  eleventyConfig.addPassthroughCopy("src/blog/img");
  eleventyConfig.addPassthroughCopy("src/guitar/img");
  eleventyConfig.addPassthroughCopy("src/guitar/sound/**/*.ogg");
  eleventyConfig.addPassthroughCopy("src/public/*.{txt,xsl,jpg}");

  // -----------------------------------------------------------------
  // filter
  // -----------------------------------------------------------------

  // ここに各種フィルター

  //eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  // -----------------------------------------------------------------
  // collections
  // -----------------------------------------------------------------

  // ここに各種コレクション

  // 本来の書き方 例
  // eleventyConfig.addCollection("blog", (api) =>
  //   api.getFilteredByGlob("src/blog/**/*.md").reverse()
  // );

  // ドラフト記事を除外する関数
  // isServeの設定必須
  // const isServe = process.env.ELEVENTY_RUN_MODE === "serve";
  const noDraft = (items) => {
    return isServe ? [...items] : items.filter(item => !item.data.draft);
  };

  eleventyConfig.addCollection("blog", (api) => {
    return noDraft(api.getFilteredByGlob("src/blog/**/*.md")).reverse();
  });

  eleventyConfig.addCollection("guitar", (api) => {
    return noDraft(api.getFilteredByGlob("src/guitar/**/*.md"));
  });

  // -----------------------------------------------------------------
  // shortcode
  // -----------------------------------------------------------------

  // ここにショートコード

  // -----------------------------------------------------------------
  // Markdown Library
  // -----------------------------------------------------------------
  const mdLib = markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(rubyPlugin, { rp: ["(", ")"] }); // markdown-itの各種プラグインを使用する場合

  // Chrome(blink系)で<br>に高さ・パディングなどを持たせられないため、
  // 新たに<br>を<cr></cr>で書き出す設定
  mdLib.renderer.rules.softbreak = () => '<cr></cr>';
  mdLib.renderer.rules.hardbreak = () => '<cr></cr>';

  eleventyConfig.setLibrary("md", mdLib);

  return {
    // テンプレートエンジンにnunjucksを使用している場合
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    }
  };
}
````

#### JavaScriptとCSSはどう書いているか

```js
import "@css/style.css"; 

//他各種import

document.addEventListener("DOMContentLoaded", async () => {
  // スクリプトを書く
}
```

jsは上記のように書いています。1行目は`style.css`をjsでインポートしてViteで処理させるための記述です。

```css
@import "tailwindcss";
@import "./uaplus.css"; /* リセットcss */
@import "./font-settings.css";

/* ============================================================
   @layer 構造の宣言
   優先度（低→高）: base → layout → component → utility
   Tailwind v4 の @layer との共存のため、カスタム層は
   tailwind の layer より後に定義する。
   実際の詳細度は宣言順ではなく @layer の順序で決まる。
   ============================================================ */
@layer base, layout, component, utility;

/* ============================================================
   @theme — Tailwind v4 のカスタムトークン定義
   （@layer の外に置く。これは Tailwind の管轄）
   ============================================================ */
@theme {
  /* フォント (theme.fontFamily.sans) */
  --font-sans: "Reddit Sans", sans-serif;

  /* カスタムスペーシング (theme.extend.spacing.1px) */
  --spacing-1px: 1px;
}

@layer base {
  :root {
    ...
  }
}
```

cssはこういう感じです。`@layer`とかを使用していますが別に使用しなくてもよいです。ごく普通のcssで問題ありませんが、最初に`@import "tailwindcss";`でTailwindCSS(v4なのでこれだけでok)を読み込み、必要であればリセットcssなどを読み込み、サイト内で使用(self-host)しているフォントの設定を読み込みます。
特別なところはないですが、`@import "tailwindcss";`はnpmパッケージでインストールしておく必要があります。当サイトではviteのプラグインとしてのtailwindcssと本体もインストールしてあります。

#### package.jsonはどうなっているか

```json
{
  "name": "blazechariot",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "preview": "npx serve _site",
    "clean": "node --eval \"fs.rmSync('_site',{recursive:true,force:true});fs.rmSync('.cache',{recursive:true,force:true});fs.rmSync('.vite',{recursive:true,force:true})\""
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "@11ty/eleventy-img": "^6.0.4",
    "@11ty/eleventy-navigation": "^1.0.5",
    "@11ty/eleventy-plugin-rss": "^3.0.0",
    "@11ty/eleventy-plugin-syntaxhighlight": "^5.0.2",
    "@11ty/eleventy-plugin-vite": "^7.0.0",
    "@quasibit/eleventy-plugin-sitemap": "^2.2.0",
    "@tailwindcss/vite": "^4.0.0",
    "fast-glob": "^3.3.0",
    "fs-extra": "^11.2.0",
    "markdown-it-attrs": "^4.3.1",
    "markdown-it-multimd-table-ext": "^4.2.35",
    "markdown-it-ruby": "^1.1.2",
    "nunjucks": "^3.2.4",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0"
  }
}
```

一応、(`npm run build`をして)でき上がった`_site/`も確認するため`serve`というパッケージも入れていますが、たいていはいらないと思います。
`fast-glob`や`fs-extra`は`eleventy-passthrough-bridge.js`に必要になります。後は編集を楽にするmarkdown-itのプラグインパッケージぐらいです。特殊なものは他にはないだろうと思います。

`script:`部の、

```json
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "preview": "npx serve _site",
    "clean": "node --eval \"fs.rmSync('_site',{recursive:true,force:true});fs.rmSync('.cache',{recursive:true,force:true});fs.rmSync('.vite',{recursive:true,force:true})\""
  },
```

`dev`にしろ、`build`にしろ11tyのデフォルトで何かしら特殊な事をしているわけではありません。Viteの設定と追加した独自プラグイン`eleventy-passthrough-bridge.js`それと各種ファイルのパスやインポートの仕方を上手くすれば、ほぼ11tyのデフォルトの振る舞いでViteを組み合わせられます。
普段、記事を書く場合に何かしら意識するところはなく、例えばWindowsでスリープからの復帰後なんかビルドが遅いなぁと感じたら、エディター内蔵(あるいは別で開いている)ターミナルで`Ctrl+C`をして停止してから、私のpackage.jsonの場合なら`clean`をして再度`dev`をするだけです。

既に行っていてキーボードの`↑↓`矢印キーで過去の履歴も見れるでしょうから、そこで`npm run dev`なりを探すだけという感じです。

## まとめ

11tyの公式プラグインViteの本質としては、11tyとViteを繋ぐためのアダプターであり、どちらかがもう一方を内包しているわけではないので、互いに知らない者同士を設定することになるため起点を正しく設定することが大切になります。
outputフォルダがViteのrootになるという設計上、outputに相当する相対パスの書き方、build順序が色々起こる問題の根源になっています。

Tailwindの別プロセス化も、RSSの`assetsInclude`も全てこのViteはoutputしか見えていないということから理解できるのではないかと思います。

この記事では、

- 11tyで全部作って、Viteの便利な機能(HMRや自動リロード)だけを使う
- Viteのプラグインの力も借りてアセットを強制的に使用できるようにする
- 11tyで普通に編集し、独自スクリプトを入れて、なるべくViteでビルドをする

というような方法を書いてみました。

11tyは他の静的ジェネレーターと違って特殊な記載方法を勉強したりする必要もなく、基本自由ですが内部での処理が見えない所もあり、ドキュメントの通りやってはみるものの思った通りにはできないと言う場面もあります。

基本11tyだけで全ては完結できるようになっています。ライブリロードもあるので記事だけを書くのであれば何も問題はありません。しかしそのライブリロードはJavaScriptを再読込してくれないとか、画像を新たに追加しているのに読み込めないとか、微妙に面倒くさい(手動でブラウザリロードが必要になる)所もあるわけけです。
Vite以外にも同じようなものはありますが、それように最初から構築する必要もあり、JS/CSSバンドラーで他のものもあるにはありますが、今の所、Viteほど高速なものは他にありません。だから自ずとViteに落ち着くわけですが、11tyはViteはおろかTailwindCSSを意識したコードもないのです。

AstroなどはViteありきで作ってあるのでもっと融合していますが、11tyは使えるなら使ったら良いんじゃない？というスタンスでとにかくシンプルにHTML/JS/CSSで静的サイトを生成するという目的と哲学ですから、シンプルがゆえに自由度は高いが難しい点があるわけです。
だいたいAstro、Hugoとかが多く使用されていますが、11tyのJSがわかったらだいたいできると言う点が私は潔いとも思うのです。

何もかもを個人が作成するのは難しいですが、その何かしらの助けになれればと記事を書きました。
言いたいことがあるけどもそれを発表できる場がないと言う人もいるでしょう。Wordpressも変わりましたが、そのためだけにレンタルサーバーを借りると言う人もいるでしょう。そういうのが面倒なのでNoteやLivedoorブログなどのブログサービスを利用する人もいると思います。記事を書くというのが目的ではありますが、11tyはサイトを作る楽しみみたいのも体験できます。

昔はhtmlとcss/JSで1ページずつ作っていたサイトよりも便利に、ブログやその他にもデータベース的なサイトまでおそらくどんなものでも作れると思います。
興味を持たれた方がいましたら是非試してみて下さい。すべて無料でPCさえあれば全部できます。

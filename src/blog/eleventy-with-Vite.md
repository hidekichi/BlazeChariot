---
title: 11tyでVITE
description: 静的サイトジェネレーターである11tyを使用してブログを書こうぜという話。簡単ではないが、きっとできる、誰でもできると前置きしながらWindowsをこき下ろす
date: 2026-03-04
update: 2026-03-18
category:
  - blog
tags:
  - 11ty
  - ブログ
images:
  - ../img/github_download.avif
  - ../img/nodejs-download.avif
  - ../img/11ty-project-ss.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
templateEngineOverride: md
---

## なんで今更11ty(eleventy)なのかという話

公式サイト：[www.11ty.dev](https://www.11ty.dev/)

ザーッと調べた感じ、11ty関連の記事は2020～2021年頃のものを多く見られる気がします。そこがピークというわけでもなく、今でももちろん開発が進められていて、逆に2020年頃の記事が内容的にもう古いという感じでもあります。
2020年当時は、コロナ禍ということもあり、家にいることもありで記事が増えたんでしょうね。

そんな中で11tyを勧める理由としては、今はAIでサイト検索も、詳細を教えてもらうのも一般的になりつつあり、ブログもWordPress、他にもlivedoorブログなど多くのブログサービスがあるので「<u>敢えて11tyを使う必要はないじゃないか</u>」、「[Astro](https://astro.build/)、[Hugo](https://gohugo.io/)の方が一般的じゃないのか」と言う意見もあるでしょうがそれはさておき、あまりにも鬱陶しい広告まみれのブログが多すぎることを「それはどうなんだ？」と思っているからです。
AstroもHugoもなんか仕様が独特で難しくない？と思うんです。JavaScriptを知らなくても行けるとしながらも、モダンすぎてわかりにくいというのもあると思うんです。分かる人には便利なんでしょうけども。

あまり人のことは言えませんが内容が薄いというか、まとめるにしても「もっとスレ全体からまとめろよ」と思うぐらい、10件ぐらいのリプをまとめて9割は広告とか正気ですかと。
SEOに注力するのは良いけども、あまりにも役に立たない内容の記事が、Google検索のトップに来るのもどうなのかと思いますし、昔はもっと検索して解決できたこともあったじゃないと思うことも。
そう思ってたんで、だったら軽量でエラーもない((ローカルでエラーの原因を調べられるので本番環境で起きにくい))htmlのサイトが作れる<u>11tyは最適と思いますがどうですか</u>？という提案です。

どこかの仕様があまりよろしくなく、既に廃止されたJavaScriptのエラーを出すメソッドを内部でいまだに使っているブログのなんと多いことかと。
それらも現在ではサービス会社の方で改善されているはずですが、ブログサービスの利用者がそういうことには{疎|うと}い人たちも多く、自分で直すには技術も必要で「書く」に専念したい気持ちも汲み取れるわけですが、公開したものにはもうちょっと配慮もいるんじゃないか？と。
放置状態ならいざ知らず、更新してるのに直さないの？と思う所があります。
更にそういう点はわからなくはないもののSEOには{躍起|やっき}になって金儲けには注力できるじゃないかと、そういう矛盾がどうなんだろうと思う点です。

### Wordpressと11ty

11tyは静的サイトジェネレーターであり、昔ながらのwebサイトが作れるものです。[阿部寛のホームページ](https://abehiroshi.la.coocan.jp/)がどうやって作ってあるのかは知りませんが、<u>同じぐらいの軽さでもっと中身は現代風にサイトが作れる</u>というものです。

Wordpressが動的サイトを作るツール、11tyなどは静的サイトを作るツールです。Wordpressはサーバー上で記事を書き、見てる人のリクエストに応じてPHPでデータベースからそれらを読み取り表示するのに対して、11tyはローカルで必要なものを作り、Node.jsを用いてビルド(構築)します。公開はまた別で。

どこでファイルを作成するかまたその手法の違いですが、PHPでやる動的サイトはサーバーのパワーも必要ですし、今どきはSSDで運用されていたりで、昔に比べると高速になってはいると思いますが、11tyはローカルでできあがったものをそのまま表示するわけで、それと比べると昨今のネットワークのスピードも相まって爆速になるわけです。阿部寛のホームページ並の速度のサイトが作れるはずです。

jpgやgifも新しいフォーマットのwebpやavifなどが[モダンブラウザでは100%表示可能](https://caniuse.com/?search=webp+avif&static=1)ですから、表示はほぼそのままにファイルサイズを減量してくれるわけです。
そうするとサーバーの負担も減り、ネットワークのトラフィックも減り、自分の思うようなサイトも自由に作れる、誰しもが損することもなくホームページ(htmlとは)本来はこうあるべきという姿を実現できるということです。
なのでftpも不要、アップロード(push)も一瞬、ビルドも[Hugoほどではないが爆速な11ty](https://www.11ty.dev/#why-should-you-use-eleventy)は最適ではないかと思いますが、おひとついかが？と言う記事です。

性能やできることは追々書いていくとして、どういう仕様で構成するかからまずは書いていきたいと思います。

## ええぃつべこべ言うなさっさと触らせろ

<div class="border border-amber-400 p-[var(--padding-m)] mb-8">

この項目では、まずは最短で動かす方法としてZIPダウンロードから環境を作る方法を紹介します。
通常の手順も後で説明しますが、自分で一から制作するのと、設定済みファイルが手元にあるのとではやり方が若干異なります。注意して読んで下さい((同じ事を手法の違いで書いていますので))。
これに合わせてGithubからダウンロードできるファイルの内容は最小構成です。

</div>

「説明はその都度見るので、さっさとファイルをよこせ」と言う気の短い人にはGithubの[ウチのページ](https://github.com/hidekichi/11ty-project)からzipでダウンロードしたら超シンプルな構成ファイルが手元にできます。
…と思いましたが、<u>あまりにも最小構成すぎるのと検証も兼ねてまだ公開する前というのもあったのでやや手を加えました</u>。
Githubの`example/`にテストで使用した`src/`が入っています。

![Githubのどこから](../img/github_download.avif)

上記画像の緑色の<span class="bg-green-600/90 text-stone-100 rounded-sm px-2">Code</span>とある所から開くと一番下に「Download ZIP」があります。
それらはただのファイルのzipなので、それだけでは11tyは動作しません。次の手順を踏んで下さい。

1. Node.jsをダウンロードしてインストール(2026年3月現在ではv24系LTSで)
2. Githubからダウンロードしたzipをお好きな所に解凍します
   - 上級者で既にgitを使用している人は以下のコマンドで一発です。他にも色々と[方法](https://docs.github.com/ja/get-started/git-basics/about-remote-repositories)はあります。

   ```ini
   git clone https://github.com/hidekichi/11ty-project.git
   ```

3. 解凍したフォルダを開き、右クリックから「ターミナルで開く」をします(Windowsの場合)
4. 依存パッケージをインストール

これだけです。それぞれ説明します。

上記リストの1、2 は、下記「<u>1～2 ローカルPCの好きな所にフォルダを作り、Node.jsをダウンロード</u>」で説明しています。zipをダウンロードしたのであれば解凍したフォルダを好きなもの(わかりやすいもの)に変更します。
記憶が曖昧ですがダウンロードを解凍したフォルダ名は、`11ty-project-main`だったかと思います。これは`[リポジトリ名]-[ブランチ名]`となっているだけです。これを例えば「eleventy-blog」に直すとか自分の好きな名前にして下さい。

上記リスト3～4は、下記の「<u>3～4 - フォルダに11tyで必要なものをインストールする</u>」の説明とやや違います。zipを解凍した場所(までのパス、フォルダのアドレス欄のパス)とターミナルのプロンプトが同じかを確認して、もしくはzipを解凍した<u>フォルダを右クリックしてメニューからターミナルを開けば</u>、プロンプトの部分に、

```bash
PS C:\Users\username\project>
```

と出てると思います。ここのパス(`PS C:\Users\[アカウント名]\[フォルダ名]>`)は<u>フォルダを解凍した場所で異なります</u>が、各コマンドはこのプロンプトから行います。

すでに必要なファイルとpackage.jsonもありますので、

```bash
npm install
```

とすれば必要な物(11ty本体、vite本体など)が入ります。

11tyとviteの起動方法は、

```bash
npm run dev
```

です。勝手にブラウザに新しいタブでページが表示されたと思います。開いていない場合は`http://localhost:5137/`で開きます。

> `http://localhost:5137/`はViteのデフォルトのポートです。通常は`http://localhost:8080/`です。11tyだけなら後者になりますが、Viteで表示させているのでこのポートを使用することになります。
> 11ty + 公式プラグインの場合は、後者のポートで何も触らなくても使用可能です。またViteのオプションで設定も可能です。ただしこれらは同じに設定すると同じポートを使用することになるので色々問題がでてきます。サンプルの設定は11tyとViteが別で動作するのでブラウザに表示するのはViteですからそちらのポートを見ることになります。

ディレクトリ構造などは下記に書いてありますので、<u>それらを触りながら魔改造していってください</u>。

まず試してみることとしては、`src/assets/css/main.css`をお使いのコードエディタ、あるいはテキストエディターで編集して**保存**してみて下さい。開いた**ブラウザのリロード(画面の更新)なし**にcssが反映されれば成功です。

編集の方法は、

1. ブラウザに表示されている対象要素を右クリックをして、検証(firefoxでは調査)を選ぶ
2. 表示されたのがブラウザのデベロッパーツールです。インスペクターと言うところで表示されているのが、右クリックした箇所のhtmlの構造です
3. 変えたい部分がタイトル部分の`<h1>`だとすると、`main.css`に以下のcssを書けば文字が赤くなります。

   ```css
   h1 {
     color: red;
   }
   ```

このようにして変更していくのですが、これは<u>Viteの機能のHMR(ホットリロード)を見せたいだけです</u>。

> HMRとは
> Hot Module Replacementの事で、コードの変更時にページ全体を再読み込みすることなく、変更部分だけを更新してリアルタイムに反映させる機能のことを言います。

本格的に作っていくとすれば`src/index.njk`と`src/_includes/layouts/base.njk`を正しい形にすることから考える必要があります。サイト全体を表示するテンプレート部分です。
サンプルの`base.njk`では、アイコンの設定もsnsの設定もありませんし`robots.txt`も`sitemap.xml`もありません。

- `sitemap.xml`については出力できる準備はしてあります。
  - 公開先が決まったらそのドメインを`src/_data/site.json`のサイトアドレスを修正すると`sitemap.xml`が正しく機能します
     - 現在は、`"url": "https://example.com"`としてあります。

更に(テスト・説明用を除く)記事もなければ((全くなしもあれなのでテストで使用したのを残してあります))何も無いというまっさらな状態ですから、まずはどういうサイトを作りたいかの構想を考えましょう。
どこにヘッダーフッターを入れるかとか。
それは最初と最後に決まってますが、固定にするかどうかでhtmlの書き方が異なりますし、記事のタイトルをヘッダーに表示したいとなれば、それは記事のテンプレートにヘッダーがなければ記事の情報を読めません。

`index.njk`もどういう事を最初表示するのかを考えないといけません。

最初はごく普通に考えつつ、htmlでこんな感じかと作ってみて、cssで大まかなページをスタイルしてみるのが良いと思います。
その後、タイトルやfooter等でサイト名を標示したりすると思いますが、共通パーツでサイト名を表示する箇所には、nunjucksを利用した変数`{{ site.name }}`などで出力を表示できる形にしていけばよいのです。

記事一覧を作るのであれば、そのテンプレートも必要です。
11tyはコレクション([collections](https://www.11ty.dev/docs/collections/))という形で各種データを保持できます。それを上手く使用することでサイト自体にある色んなデータを各ページで表示することができます。

ブログ記事とは別に、「何かを紹介する単体ページを作る場合はそのテンプレート」も必要になり、作るものはたくさんあります。思い通りにするにはどうするか、それをAIに相談しながら試してみても良いと思います。やりたいことは各々異なっていて必要なものも違ってくるだろうと思うので。

ブログ記事を書くためには、下記「<u>6 上手なpostsの利用方法</u>」を見てディレクトリ構造や必要なテンプレートファイル、またその仕組を理解する必要がありますが、

1. テンプレートを好きなように作る
2. 記事を入れるディレクトリ、表示するテンプレート、記事本体と、そのフロントマターを書いていく

と言うだけです。テンプレートもでき上がっていれば、記事とそのフロントマターを書いていきます。

わからない所はAIにでも聞いたら答えてくれるはずです。その前に、

- どういう構造になっているのか
- 何が動いているのか

などをAIは質問してくるでしょうし、<u>ある程度は仕組みや仕様を知っておく必要があります</u>。設定は極シンプルになってますので、どのAIでもそれなりに答えてくれるはずです。
特に全体の設定である`eleventy.config.js`と`package.json`は重要です。更にディレクトリ構造、サイトをスタイルする`css`と後から色々付け加えたり構造を変更できる`JavaScript`は、Viteと連携してcssを制御したりもしています。

ローカルで作っている間はどこにも公開していないので、トラブルが起こっても11ty側のエラーなら勝手に止まるでしょうし、動作しながらもおかしいとなれば11tyを止めれば(ターミナルで`Ctrl + C`)、使用しているPCにはだいたい何も起きません。あってもブラウザが勝手に落ちるぐらいのことです。

色々魔改造して、まずはローカルで正しく動くかを確かめられる所が11tyの良いところでもあります。

---

以下は設定と説明。一から自身で作るための解説なので上記とはやや内容が異なることがあります。

## 11tyの設定

従来、ローカルで作業するというのは、いちいちエディタで編集して保存して、ブラウザを手動でリロードして変更点を確認して、またエディターで問題点を修正してと、あっち行ったりこっち行ったりだと大変でした。
大変であったからブラウザで全てができるブログサービスのようなものが生まれたわけですが、<u>逆になんでもできるという自由が奪われました</u>。お手軽さの代償に自由が奪われたのです。そこにあるもので完結させて、そこにあるものが全てのようにみせかける。だからどこでも同じようなスタイルの量産型が生まれるのです。
時代は多様性と言われて久しいですが、もっと自由を求めて良いのです。

と言いつつ、今からやることは最小限度の、まだまだ不自由な設定です。まずは動作する環境作りからです。作業ができるという環境からです。それを作ればそこからは自由が待っているのです。

目的とするのはこうです。

- 11tyを動作させておく
- ユーザーは必要なファイルやテンプレートを作り変更・保存する
- それを検知した11tyが処理し、できたものをViteがHMR(ホットリロード)・リロードで、即ブラウザに反映
- ユーザーは記事の作成・変更・修正だけに集中できるので、あっち行ったりこっち行ったりが軽減される
- そうやってできあがったものは本番環境と同じになるため、サイト全体を見ながらこれで良いとなればGithubにpushしたりして、本番環境へデプロイすることができるようになる

つまり、

- ローカルでは最終的にどうなるのかという**設計図を作る**
- Githubはその設計図の置き場
- 公開先はGithubの変更を自動でチェックして、公開先(NetlifyやCloudflare page)のサーバーでローカルと同じようにビルドが行われ公開される

という流れです。

**本番環境で公開するための設計図をローカルで作るのです**
そのため、ローカルで正しくビルドができればリモート(公開先)でも同じようにビルドが行われます。

> リモート(Netlify)ではUbuntuがサーバーとして動作しているようでした。これは他にも違うディストリビューションが使用されているかも知れませんが、Linux/MacOSでは何も変更無く動作するコマンドもWindowsではPowerShell向けに変更しないといけないことを意味しています。
> 逆にWindowsでも動作するようにしたのに、最終的にはLinux/MacOSでも動作するようにコマンドを作る必要があります。このあたりがWindows単体では不便なところではあります。
> こういう理由があるために、パスをわざわざreplace(置換)したり、コマンドを変更・吸収したり工夫も必要で、コマンドを動かせるようにクロスプラットフォームで動作するパッケージも入れてあります

## 必要なもの

1. ローカルPCの好きな所にフォルダを作る
2. [Node.jsをダウンロード](https://nodejs.org/ja/download)してインストール。2026年3月現在v24LTS推奨
3. 1で作ったフォルダで右クリックしてターミナルで起動
4. 11tyと必要なものをインストール
5. 各設定をする
6. テンプレートを作り、記事を書く
7. Githubでリポジトリを作りpushできる環境づくり
8. その他諸々

こういう流れになります。

### 1～2 - ローカルPCの好きな所にフォルダを作り、Node.jsをダウンロード

わかりやすいようにしておけばよいですが、Windowsであれば`C:\Users\[アカウント名]\11ty-project`としましょう。この「11ty-project」がルートディレクトリになります。

> Windowsのパス
> 世の中のパスというのは`/`こうです。`https://google.com/`と、パスといわれるものは`スラッシュ(/)`で区切ります。しかしWindowsは`\`ですよね？見た目が「￥」になっていると思いますが、`C:\Users\[アカウント名]\11ty-project`とWindowsはスラッシュではないのです。こういったパスの違いが正しいパスを拾えない原因にもなっていたりします。トラブルの元になっていたりでプラグインが正しく動かなかったりもします。

Node.jsは色々なバージョンがありますが、2026/3月現在ではバージョン24のLTSが良いと思います。

![node.js download](../img/nodejs-download.avif)
{class="md:w-[30vw] md:float-right md:px-[1rem] flex w-fit justify-center"}

[Node.js](https://nodejs.org/ja/download)は、上にもリンクを貼りましたがWindowsの場合は、サイトページの上部にあるコマンドよりも、中央下にある画像のような感じ<span class="f-img" data-target="../img/nodejs-download.avif">fix</span>で、x64のWindowsインストーラーでダウンロードしてインストールするのが良いと思います。
インストーラーを進めると途中でnpm、yarn、pnpmが選べる画面が出てくると思いますが、デフォルトの**npm**で良いと思います。以降もnpmで話を進めます。

### 3～4 - フォルダに11tyで必要なものをインストールする

1で作ったフォルダで右クリックをしてターミナルを起動すると、`PS C:\Users\[アカウント名]\11ty-project>`として起動します。

- ターミナルをスタートメニュー(Windowsキー)から立ち上げて目的のフォルダーを探すとなると`cd`や`dir`コマンドで確かめながらになり面倒くさいので、最初から<u>フォルダで右クリックして開きます</u>。

```bash
npm init -y
```

ターミナルが起動して、プロンプトとパスが正しいのを確認して、まず上記のコマンドを実行します。

これは、「現在のフォルダをnpmプロジェクトとして初期化し、<u>最小限のpackage.jsonだけを作成する</u>」ということです。この`package.json`がNode.jsあるいはnpmの{肝|キモ}となります。

#### package.json

> package.jsonとは
> Node.jsで使用される、プロジェクトの基本情報や設定、それらで使用されるパッケージ(依存関係・ライブラリ)を一覧にしたものです。
> (開発時、それ以外でも)使用するパッケージがリストされているので、他の人がこれらを入手すると`npm install`で必要なものが揃えられ、また環境も同じにできるというjsonファイルです。完全に同じバージョンを固定する役割は、セットで生成される`package-lock.json`が担っています。
> 必要なライブラリなどを`npm install <パッケージ名> --save-dev`としてインストールすると、それは開発時に必要なライブラリだとして自動でリストアップされていきます。

できたpackage.jsonに、<u>"type": "module"</u>と追記します。下に何か続くようであれば`"type": "module",`として書きます。続かないなら書きません。逆に、何も続かないのに書いたらエラーになります。[jsonについてはこちらで](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Scripting/JSON)。

```json
// skip-copy
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module"
}
```

上記のtypeを**module**にするというのは**必須**です。これをしないとエラーが出ます。
キーワードや、author(管理者・作者名)は必要であれば。descriptionも同様に。これらは自動で入らないので追記する必要があります。
devDependenciesは、npmでpackageをインストールしたりすると自動で入りますので特別触る必要はありません。

> devDependenciesとdependenciesの違い
> devDependenciesは開発時に必要な依存関係パッケージ一覧です。つまりはローカルで必要なものと言う感じです。一方、dependenciesはローカル以外でも必要な依存関係パッケージです。
> 11tyはローカルで作るものなのでdevDependenciesに必要パッケージがあったら良いわけです。

全体的には以下のように書きます。<u>基本的に`"type":"module"`と`script`部分ができたら始められます</u>。

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fpackage.json&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

11tyはターミナルで起動させる事(コマンド操作)が必要なので、OS付属のターミナルを個別で開いても大丈夫ですが、[VS Code](https://code.visualstudio.com/)や[Zed](https://zed.dev/)など<u>ターミナルが内蔵されているコードエディターで作業するのが良いかと</u>思います。

`script`の所(上記で言う6～10行目)に、devやらbuildやらがありますが、これがターミナルから実行するコマンドになります。

```bash
npm run dev
```

こういう感じです。devの部分が変わるだけです。

<div class="table-container">

| コマンド | 働き                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| `dev`    | 11tyとviteを立ち上げます                                                       |
| `build`  | 本番環境と同様`_site`に処理したファイルを出力します                            |
| `clean`  | もしトラブルがあり11tyやviteがエラーを出した時、キャッシュや諸々を消去します。 |
| `fresh`  | まずキャッシュや諸々をクリアしてから開発環境を立ち上げます                     |

</div>

ちなみに(大事なことなんで何度も書きますが)ターミナルで11tyやviteを停止させるのは`Ctrl + C`です。再度起動する時には`npm run dev`を入れるわけですが矢印キーで過去に入れたコマンドは出てくるのでそれを使用した方がたいてい早いです。出てこない環境であれば入力して下さい。

> npmとは
> Node Package Managerの略で、Node.jsのライブラリやツール（パッケージ）を管理するためのツールです。紹介したpackage.jsonで言うと、
> `"dev": "concurrently \"eleventy --watch\" \"vite\"",`
> この部分は、concurrentlyで、eleventyの監視モードとViteを並列で起動させるという処理を行っています。起動させるまでに記事やテンプレートファイルが更新・保存されていたらそれらも含めて再ビルドし、それをViteで表示すると言う感じです。

次に、11tyに必要なものを入れます。

```bash
npm install --save-dev @11ty/eleventy vite @tailwindcss/vite tailwindcss concurrently @11ty/eleventy-plugin-rss
```

これでデフォルトで必要なものが全部入ります。
`markdown-it`も`eleventy.config.js`でimportしているわけですが、これは11tyが内部で持っているということでしたので、importしてオプションを書き、`setLibrary`しています。つまり別途導入する必要はないということです。
ただし、あくまでも他のMarkdown系のプラグインから`Markdown-it`を参照するものがあった場合は、`Markdown-it`本体がないと11tyを介してそれらライブラリを参照するということはありませんので、そういう場面が出てきたら本体を導入する必要があります。
その際には、

```bash
npm install --save-dev markdown-it
```

で導入して下さい。というか<u>後々のトラブルを無くすために、ついでに入れておいても良い</u>ものとも思います。

### 5 どういう仕様を目指しているか

<div class="table-container">

| 名称                                        | 役割                                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 11ty                                        | 作る担当。<br/>`src/`の中の`.njk`でテンプレート、`.md`でマークダウンの記事を書き、諸々(`css`等)を処理して`_site/`にHTMLを出力します。 |
| VITE                                        | 見せる担当。<br/>11tyが作った`_site/`のファイルをブラウザに表示して、HMR(ホットリロード)で即ブラウザに反映させる役目となります。      |
| [Tailwindcss](https://tailwindcss.com/docs) | cssの補助。テンプレートでも使用可能                                                                                                   |

</div>

ディレクトリ構成は、

```ini
#skip-copy
my-project/
├── src/
│   ├── _data/
│   │   └── site.json
│   ├── _includes/
│   │   └── layouts/
│   │       └── base.njk
│   ├── assets/
│   │   ├── css/
│   │   │   ├── font-settings.css
│   │   │   └── main.css
│   │   ├── fonts/
│   │   │   ├── fragment_Mono/
│   │   │   └── lato/
│   │   └── js/
│   │       └── main.js
│   ├── posts/
│   │   ├── img/
│   │   ├── posts.json
│   │   └── test.md
│   └── index.njk
├── eleventy.config.js
├── vite.config.js
└── package.json
```

こんな感じにします。

まずどういうことかを説明すると、<u>ローカルで作成していくファイルは`src/`の中に入れていきます</u>。ソース元となるファイルです。

記事を作ったら`src/posts/`を作り、その中に入れていきます。`posts/`以外に`blog/`でもなんでもフォルダ名はつけても構いません(つけて構わないはずですが万が一もあるので必ずテストして下さい)。`https://ドメイン/posts/`もしくは`blog/`等となる所なので最初に決めて下さい。
ディレクトリを作ったらその中に作るファイルは`yyyy-mm-dd タイトル.md`です。プレフィックスに当たる日付は<u>なくても大丈夫</u>です。`md`とあるようにMarkdownで書いていきます。記事の作り方は後述します。

```ini
#skip-copy
my-project/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── font-settings.css
│   │   │   └── main.css
│   │   ├── fonts/
│   │   │   ├── fragment_Mono/
│   │   │   └── lato/
│   │   └── js/
│   │       └── main.js
```

好きな名前をつけたフォルダのすぐ下に`src/`を作ります。そのすぐ下に`assets/`があり、その中に`css/`と`js/`、更にその中に本体があります。

#### fontの保持について

GithubにPushした2回目の更新で`src/assets/fonts/`を新設して[Fragment Mono](https://fonts.google.com/specimen/Fragment+Mono)と[Lato](https://fonts.google.com/specimen/Lato)はローカルで保持するようにしました。これによりインターネットを介してのダウンロードが無くなるのでその分だけは直ぐに表示されるようになります。

実際に公開した後は、Google Fontsへのリクエストが無くなり更に`gstatic.com`へもリクエストするので使用するフォントの数によりもっと増えることもありますが<u>リクエスト数が減ります</u>。Googleのサーバーは応答がそれぞれ速いサーバーでしょうがサーバーがある場所によっては遅延します。

self-host(公開先サーバー)にフォントがあればこれらはなくなり、`gstatic.com`からのダウンロードも無くなるので、公開先サーバーから自身のPCへのダウンロードだけになります。
昔はGoogleのCDNにあると共通でキャッシュされているから速いと言われていましたが、プライバシー保護が導入されて他サイトからのキャッシュが効きにくくなっています。同一オリジンからはブロックされにくくなっているのもあり、公開先のサーバーが遅ければ意味も薄くなりますがCloudflareなどの高速サーバーなら十分GoogleCDNに勝てるぐらいに速い……かもしれません。
体感では速くなっていると思います。
それ以上にローカルでもWebFontが使用されている場合、開発でリロードが起こりキャッシュがない場合はその都度ダウンロードが走ります。もちろんキャッシュされたりもするので1回目よりは2回目の方が速いとかはありえますが、キャッシュが無くなればまたダウンロードとなります。
ローカルにFontがあればそれらが無くなるだけでも体感速度は上がるはずです。そういう意図で半角英数字だけですがフォントを導入しています。

使用方法は、

```css
要素 {
  font-family: FragmentMono, sans-serif;
}

要素 {
  font-family: Lato, sans-serif;
}
```

のようにして任意の要素に対して使用することができます。いずれも英語のフォントなので英数字にしか当たりません。日本語はその後に続くsans-serif(ブラウザデフォルトのゴシック体)で表示します。Fragment Monoがソースコード用、Latoが記事の中のアルファベット用みたいな感じです。

> フォントの設定
> これは好きに設定すればよいですが、私はローカルで[BIZ UDPGothic](https://fonts.google.com/specimen/BIZ+UDPGothic)([Github](https://github.com/googlefonts/morisawa-biz-ud-gothic/))を使用しているので記事本文は、`font-family: Lato, san-serif`で十分ですが、他の環境だと読みにくさはあるかも知れません。

`src/index.njk`はindexとありますが、サイトにアクセスされたら最初に読み込まれるファイルでもありながら、それが本体ではありません。本体は、`src/_includes/layouts/`の中にある`base.njk`です。

#### 各テンプレートファイル

base.njkはこのようになっています。

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fsrc%2F_includes%2Flayouts%2Fbase.njk&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

上の6行目のタイトル部分の話はまた後述します。

上の12行目`{{ content | safe }}`、ここに各コンテンツが入っていきます。この {{}} で囲まれた中に、`index.njk`が読み込まれるという仕組みです。`{ xx ｜ safe }`は読み込んだファイルの本来変換しないといけない文字を実体参照(htmlエスケープ)をするということです。

また`src/assets/`と言う構造になっているため、11tyが処理して`src/`を`_site/`に出力・まとめられたとしても、`_site/assets/`と言う`/assets/`への相対的なパス変わりません(src/から見てもsite/から見てもassets/は同じ位置にある)。
そのため、8行目に`link`タグでcssが設定されていますが、変に異なったディレクトリから持ってくるのではなく`src/`で作ったままのパスが使用できて、`src/assets/css/main.css`と指定することができます。

> 他でも書きましたが、このcssのリンクはブラウザで二重にcssを読み込んでいるようなら外して下さい

この`base.njk`は基本的な部分しか書いていないので、Webフォントを使うとか、OGP画像やSNS用の設定を書くとか、Faviconも同様にそれぞれ設定・変更する必要があります。こういった画像をどこに置くのかなどは後述します。

<div class="table-container">

| フォルダ名    | 役割                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/`        | ローカルで作るファイルを入れる                                                                                                                                                                                                                                                                                                       |
| `src/assets/` | サイトの骨格になるものを入れる                                                                                                                                                                                                                                                                                                       |
| `src/*`       | 必要であればrobots.txt、sitemap.xmlなど。<br/>・ `https://ドメイン/(ここ)`にあたる部分になるので、色々設定入力が楽になるので<br/>・ `posts/`あるいは`blog/`などに記事を入れるとすると、`https://ドメイン/posts/(記事名).html`となります<br/>・ `index.njk`と同様に`about.njk`を作るとすると、`https://ドメイン/about.html`になります |

</div>

`src/sitemap.xml.njk`はテンプレートとそこに必要なフィルターは用意しました。公開先のアドレスが決定したら`src/_data/site.json`でドメインを書き換えます。アドレスが絶対アドレスの必要があるためです。

全部を一度には覚えられないので、まずはこういう感じでやるんだなと理解できればよいです。

#### index.njkとbase.njkの仕組み

index.njkは次のようになっています。

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fsrc%2Findex.njk%3Ftarget%3Dhttps%253A%252F%252Fgithub.com%252Fhidekichi%252F11ty-project%252Fblob%252Fmain%252Fsrc%252Findex.njk%26style%3Ddefault%26type%3Dcode%26showBorder%3Don%26showLineNumbers%3Don%26showFileMeta%3Don%26showFullPath%3Don%26showCopy%3Don%26maxHeight%3D500&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

上記6～9行目、各要素タグのclassにある呪文みたいなのが、tailwindcssのクラスです。
例えば`<h1>`にある`text-blue-600`というのは、文字色を<span class="text-blue-600">blueで600</span>という濃さ(←で表示されている色)で表示すると言うことです。tailwindcssで決められたルールで書かれたcssのスタイルと考えればよいかと思います。
各色はtailwindcssの[color](https://tailwindcss.com/docs/colors)でわかりやすくカラーパレットで一覧になっています。

`text-blue-600`というのはcssで書くと、

```css
element {
  color: oklch(54.6% 0.245 262.881);
}
```

というのと同じ事です。

#### cssファイルの中身は

cssの場所は`src/assets/css/main.css`となっています。

main.cssは、

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fsrc%2Fassets%2Fcss%2Fmain.css&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

とだけ書いてあります。これは最初にtailwindcssを読み込ませて、自身が使用するcssで上書きができるような意味も入っています((下にあるほど優先度が上がる。例外もあり !important 付きや、 @layer での読み込み順など))。
`font-settings.css`は、Googleフォントをローカルで保持する設定です。なのでこれらが不要であればcssから`@import "./font-settings.css"`を外せばよいですし、`fonts/`も捨てることができます。
別途違うフォントを使用する場合はファイルを書き換えて、元になるフォントファイルを用意する必要があります。

```ini
#skip-copy
my-project/
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── font-settings.css
│   │   │   └── main.css
│   │   ├── fonts/
│   │   │   ├── fragment_Mono/
│   │   │   └── lato/
```

もしリセットCSSや何かしらを入れる場合、`main.css`本体と同じ所か、同じ所にフォルダを作り、その中に入れて管理します。で`@import`を用いてそれらを`tailwindcss`より後に読み込ませます。
tailwindcssの設定を上書きできるようにする感じです。

#### jsの中身は

jsの場所は`src/assets/js/main.js`となっています。別途モジュールフォルダが作ってありますが中身は何もありません((当初は本当に何もありませんでしたが、それではあまりにもアレなので実用的な脚注スクリプトのサンプルを置いてあります))。

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fsrc%2Fassets%2Fjs%2Fmain.js&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

と書きます。cssもそうですがあまり手を入れず、<u>まずはそれぞれを設定してからシンプルな状態で起動するという所まで持っていってください</u>。正しく起動した後に自身が追加して行き、そこで動かなくなったら追加したものに問題があると問題点をすぐに発見できます。

> cssが二重に読み込まれる
> 使用していく中でインラインスタイルシートとmain.cssが重複してブラウザに読まれているようであれば、base.njkのhead内に書いたスタイルシートへのリンクを取り除いてみて下さい。それで問題なく動作するならそれが最適ということです。

`src/assets/js/module/`ですが、上記base.njkの下の方(14行目)に`script type="module"`とあるようにモジュール形式が使用できます。例えば、`utility.js`というファイルを作り、

```javascript
export function isExternalLink(url) {
  // 外部リンクなら行う処理
}

export function credit() {
  // 自身のサイトクレジットを処理する
  // 例えば年が変われば2026だけから、2026 - 2027と表示を足したり
}
```

これをmain.jsでは、

```javascript
import { externalLink } from "./module/utility.js";
import { credit } from "./module/utility.js";

document.addEventListener("DOMContentLoaded", async () => {
  externalLink();
  credit();
});
```

などのようにして同じファイルの関数でも別々で使用できるという感じの使い方ができます。必要なファイルで必要な関数を呼び出せるというようなことです。
jsファイルなのにモジュールが使用できるというのも、**最初にpackage.json**に、

```json
"type": "module"
```

と追記したからです。JavaScriptが分かる人は少しだけ便利に使用できるとも言えます。
一応サンプルでは、脚注にしたい文章を`(())`で囲めば脚注になるスクリプトを忍ばせました。Markdownの記法が面倒くさいので。

#### eleventy.config.jsの設定

11tyの設定が集約されています。今回の仕様は11tyが本来の基本的な役目をし、Viteは見せるだけと役割を分けますのでとてもシンプルに記載できます。
公式に[eleventy-plugin-vite](https://github.com/11ty/eleventy-plugin-vite)というのがありますが、これは11tyとViteを繋ぐような役目をし、作るのも見せるのもする働きをします。
公式プラグインでも同じようにできますが、めちゃくちゃ複雑になり、またWindowsではWindowsであるための問題も出て、公式Viteプラグインの設定は初めて触る人には不向きなので今回は使用していません。

> 公式Viteプラグインについて
> これは複雑というかAstro等のレベルには達しておらず、親和性がやや低いのではないかと思います。できるが工夫が必要という感じです。特にWindowsで使用するには様々な工夫が必要になります。
> この記事は公式Viteプラグインを用いた設定でWindowsで書いていますが、11tyの常識内にありながら一般的ではない構成にする必要があるような工夫をして使用しています。
> Githubで紹介しているものは11tyとViteを分離して考え、シンプルながら本来のViteに近い使い方をしています。

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Feleventy.config.js&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

11tyのテンプレートで使用する便利そうなフィルターを追加してあるのでちょっと長いですが、それがなければとてもシンプルです。
初版はとてもシンプルでしたが実際試して動作させてみると足りないものもわかるようになり、そう感じたものは修正しました。

それぞれのフィルターの役目は、
<div class="table-container">

| フィルター名 | 働き                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `dateJP`     | YYYY年mm月dd日 と日本語表記の日付にするために使用するフィルターです                                                 |
| `dateISO`    | 2026-03-04T15:30:00 のように日付を-(ハイフン)、日付と時間をTで区切る形式です                                        |
| `limit`      | コレクションされたオブジェクトの先頭からn個分取り出すなどで使用します。使い方)limit(5)                              |
| `excludeTag` | postsは11tyの各記事のデフォルトのタグなので、それを取り除きそれ以外の自身が付けたタグだけにする。記事一覧などで使用 |
| `excerpt`    | サマリーなどで文字数を指定して丸め末尾に`...`をつける                                                               |

</div>
と言う感じのもので、

```njk
<ul>
{% for post in posts %}
  {% set dateOrigin = post.date %}
  {% set jpDate = dateOrigin | dateJP %}
  {% set isoDate = dateOrigin | dateISO %}
  <time datetime="{{ isoDate }}">{{ jpDate }}</time>
{% endfor %}
</ul>
```

こうすると記事の時間が以下のような感じで取り出せます。
各記事の日付を`dateOrigin`という変数で受けたとして、そこにフィルタ(「dateOrigin | dateISO」 等)を使い、上記`time`タグの`datetime`には`dateISO`で表示し、`time`タグの中は`dateJP`で日本語表示にするとコンビネーションで使えます。

```html
<!-- skip-copy -->
<time datetime="2026-03-01T00:00:00z">2026年2月26日</time>
```

これらは使い方次第です。どういう事ができるのかは、公式の[nunjucks](https://mozilla.github.io/nunjucks/templating.html)で調べてみて下さい。
今回採用したのはnunjucksですが、テンプレートには色々なものが使用できます。eleventy.config.jsを一部書き換えないといけませんが、nunjucks以外の方が馴染みがあるという場合には、そちらを使用することもできます。

テンプレート言語には、`HTML *.html`、`Markdown *.md`、`WebC *.webc`、`JavaScript *.11ty.js`、`Liquid *.liquid`、`Nunjucks *.njk`、`Handlebars *.hbs`、`Mustache *.mustache`、`EJS *.ejs`、`Haml *.haml`、`Pug *.pug`、`TypeScript *.ts`、`JSX *.jsx`、`MDX *.mdx`、`Sass *.scss`、`Custom *.*`を使用することができます。

#### vite.config.js

vite.config.jsの中身は、

<script src="https://emgithub.com/embed-v2.js?target=https%3A%2F%2Fgithub.com%2Fhidekichi%2F11ty-project%2Fblob%2Fmain%2Fvite.config.js&style=github-dark&type=code&showBorder=on&showLineNumbers=on&showFileMeta=on&showFullPath=on&showCopy=on"></script>

となっています。ここはあまり変更されると動作がおかしくなったり不安定になるので敢えて多くは説明はしません。
`eleventy.config.js`とサイトの構成、そして本ファイルをAIに提示して「こういうふうにしたい」と問い合わせ、それに従って下さい。やりたいことが異なるのもありますし、環境も各々に違うので各自で聞いてもらった方が確実です。もしエラーが出てもそのエラーを元に問題点を修復もできるでしょう。
ただしAIの過信は禁物です。

作業を始める時、

1. `npm run dev`と入れる
2. 11tyが動作を始めます、一緒にviteも起動する。ブラウザにも自動でローカルホストが表示される
   - `open: false`に設定したので開かなければ`http://localhost:5173/`を開く
3. 11tyが作ったファイルをviteがHMR(ホットリロード)・自動ページリロード(フルリロード)で自動表示する
4. 本番環境でも変更したものができるか確認に、`npm run build`する。
   - あるいは`npm run fresh`でも良いですが、11tyとviteも起動してしまうので確認だけなら`npm run build`で`_site/`フォルダを確認

という流れで、2と3の間はファイルを変更したらブラウザで確認するだけなので基本はシンプル構成で良いかとこうなっています。

#### (上でも書きましたが) 起動コマンド、ビルドコマンド(本番ビルド)

起動コマンド

```bash
npm run dev
```

ビルドコマンド

```bash
npm run build
```

これで、`_site/`に、最適化されたファイルが出力されます。
ここは案外デリケートな設定もあるのであえて説明無しでこういうものですという感じと思って下さい。

#### HMR(ホットリロード)の動作

<div class="table-container">

| 変更したファイル | 動作                                  |
| ---------------- | ------------------------------------- |
| `.css`           | cssだけを指し据え(ページリロードなし) |
| `.js`            | モジュール単位で差し替え              |
| `.njk` `.md`     | 11tyが再ビルド→Viteがページリロード   |

</div>

こういう動作をしていたら成功です。ブラウザを見て確認だけです。
つまり簡単に言うと、ある程度決まった環境でCodepenがローカルにあるようなイメージではありますが、サイト全体を作ることができると言う、そういう環境づくりが可能なわけです。

#### gitignoreについて

これはGithubにPushする際に無視するリストです。

```ini
node_modules/
_site/
.cache/
.vite/
.env
.env.local
.zed/
Thumbs.db
desktop.ini
```

Githubのリポジトリはいわゆる設計図を置いておく倉庫です。ローカルからpushする際に変なものをpushすると容量も消費しますし、ほとんどがテキストだけで超軽量なのに時間がかかったり色々と問題が出ることがあるので、Githubへ送らないものは無視するようにgit(あるいはgitクライアント)に伝えます。
`.vscode/`とか`.vscode/settings.json`とか、それは11tyのビルドなどでは不要と思うものを無視リストに入れればよいわけです。

すでに`.gitignore`はあればそれを利用して、`.gitignore`に記載がなく本番環境でビルド不要なものは追記していきます。
もし`.gitignore`がリポジトリにない場合は作成します。

### 6 11tyの記事の正しい書き方

記事を書くのに正しいも間違いもないですけども、一応形式としては次のような感じになります。

```yaml
---
title: "記事のタイトル（必須推奨）"
description: "meta description（SEO用、120-160文字推奨）"
date: 2026-03-01 # ISO形式がベスト（または "2026-03-01T12:00:00Z"）
tags: # 配列で複数可
  - eleventy
  - blog
  - tips
layout: "layouts/post.njk" # レイアウト指定（デフォルトはなし）
permalink: "/blog/{{ title | slugify }}/" # カスタムURL（任意）
draft: "true" # trueならビルド除外（便利）
---
(ここからMarkdownで記事を書きます。)
```

このように、ハイフン3つで囲んだ中身をフロントマターと言います。記事の情報が書かれている部分です。本来は`クォート(")`、`#`からのコメントは書きません。
上記で言うと`draft:`以外は全部必要ですが、もしまだ書けていない記事などがあれば`draft: true`にすれば表立って表示されないのである意味便利です。いちいち記述を追加するのが面倒ではありますが。

しかしこれは本番環境で表には出さないがローカルでは見えるようにするためのものであり、<u>その仕組み上、アドレスを叩けばもちろん表示されます</u>。一般的には隠せるようになっているものと理解するのが良いかも知れません。

#### draftを可能にする

またDraftを可能にするには、スクリプトが必要です。様々な書き方があると思いますが、`eleventy.config.js`に次のスクリプトを追加して下さい。

```js
eleventyConfig.addCollection("allPosts", function(collectionApi) {
  const all = collectionApi.getFilteredByGlob("./src/posts/*.md");

  if (process.env.ELEVENTY_ENV === "production") {
    return all.filter(item => !item.data.draft);
  }

  return all;
});
```

更に、クロスプラットフォームで動くように`cross-env`を導入する必要があります。

```bash
npm install --save-dev cross-env
```

として導入後、`package.json`の`build`コマンド部分を以下のように変更します。

```json
"scripts": {
  "dev": "concurrently \"eleventy --watch\" \"vite\"",
  "build": "cross-env ELEVENTY_ENV=production eleventy && vite build",
  "clean": "node --eval \"fs.rmSync('_site',{recursive:true,force:true});fs.rmSync('.cache',{recursive:true,force:true});fs.rmSync('.vite',{recursive:true,force:true})\"",
  "fresh": "npm run clean && npm run dev"
},
```

jsの`return all.filter(item => !item.data.draft);`ここが重要でそれぞれのフロントマターにdraftのデータがなければ通すというような仕組みが大事になります。
`src/posts/`にある記事が全てを対象に、production、つまりは本番環境であれば、記事のフロントマターでdraftがついてないものだけを集めるというようなスクリプトです。ローカルでは本番環境でないですから全部集められて表示されるということです。

#### 上手なpostsの利用方法

記事は基本的に全て非表示ですが`posts`というタグが自動でつきます。これを利用してまとめて管理ができます。

```ini
# skip-copy #
src/
├── _includes/
│   └── layouts/
│       ├── base.njk        ← 共通レイアウト
│       └── post.njk        ← 記事用レイアウト
├── _data/
│   └── site.json           ← サイト全体の共通データ
├── posts/
│   ├── posts.json          ← posts/ 全体に適用する設定
│   ├── 2024-01-01-first-post.md
│   ├── 2024-01-15-second-post.md
│   └── ...
├── assets/
│   ├── css/
│   └── js/
└── index.njk
```

このような構造が考えられます。`posts.json`には次のように書かれています。

```json
{
  "layout": "post.njk",
  "tags": "posts"
}
```

これでタグが`posts`のものが対象になり、それがpost.njkを使用するとなります。
サンプルのサイトは、別で記事リストを作るようなものではなく一般的なトップページに記事が並ぶプログサイトのような作りなので、これでいけますが、当サイトのように記事リスト一覧が必要になる場合はこれらを使用せず、リンクから特定のページに飛びそこでは専用のテンプレートを利用して記事リスト一覧を作っています。

```ini
# skipCopy
リンク[http://.../guitar/contens/]
              ↓
contents.njk  記事リスト一覧表示(※)
              ↓
    post.njk  各ページへの表示
```

上記の記事リスト一覧(※)は、リスト表示する専用テンプレートをcontents.njkで読み、各ページではpost.njkを読むというようになっているということです。

`src/_includes/layout/post.njk`をまず作ります。いわゆる`base.njk`の`{{ content | safe }}`タグの中に入る部分です。全体的にテンプレートから考えるのを勧めてますが、その構造によって必要なことが変わったりするからです。

例えば、

```html
<!- skip-copy -->
<header>
  <h1>シンプルなEleventy記事の例</h1>
  <time datetime="2026-03-04T00:00:00.000Z">2026年03月04日</time>
  <div class="tags">
    <a href="/tags/eleventy/">#eleventy</a>
    <a href="/tags/test/">#test</a>
  </div>
</header>

<article class="post">
  <div class="post-content">
    <h2>見出し2</h2>
    <p>
      普通の文章、<strong>太字</strong>、<em>斜体</em>、<a href="/about/">リンク</a>など。
    </p>
    <p><img src="./images/sample.jpg" alt="画像の例" /></p>
    <pre><code class="language-js">console.log("Hello Eleventy");</code></pre>
  </div>
</article>
```

こういう構造で表示されると想定して、記事のフロントマター等が入ります。

上記の構造の簡単にしたバージョン

```njk
_skipCopy_
---
layout: base.njk  {# 読み込むテンプレートを指定 #}
---

<header>...</header>
<article>
  {{ content | safe }} {# ここに記事が読み込まれる #}
</article>

{# SNS button/link #}
{# sidebar #}
{# etc. #}
```

フロントマターのlayoutに、base.njkとあるように、これがbase.njkに読み込まれます。
nunjucksのドキュメントなども参考にしてですが、

```njk
_skipCopy_
{{ title }}             # ページのタイトル
{{ date }}              # ページの投稿日時
{{ description }}       # ページの説明
{{ author }}            # 作者名(これは _data/site.json に書くほうがいいかも)
{{ page.url }} あるいは {{ permalink }}
{{ site.title }}        # _date/site.jsonに登録必要
{{ contens | safe }}    # ここに記事の内容が入ります
```

こういったものが使用できます。


```njk
_skipCopy_
---
(他省略)
tags:
  - 11ty
  - pc
images:
  - ./img/aaa.jpg
  - ./img/bbb.jpg
---
```

上記のようなフロントマターがあったとして、タグの取り出し方は、

```njk
<ul>
{% for tag in tags %}
  <li>{{ tag }}</li>
{% endfor %}
</ul>
```

こんな感じのループで取り出せます。リストのようにタグが入っていますが配列で入っているのでループさせる必要があるわけです。
フロントマターの構造も同じような書き方をしていましたが、同様にして画像は、

```njk
<div class="flex justify-between">  {# tailwindcssを使用した時 #}
{% for image in images %}
  <img src="{{ image }}" />
{% endfor %}
</div>
```

などとして使用。`post.njk`では、

```njk
_skipCopy_
---
title: シンプルなEleventy記事の例
date: 2026-03-01
layout: base.njk
tags:
  - 11ty
  - pc
images:
  - ./img/aaa.jpg
  - ./img/bbb.jpg
---

<header>
  <h1>{{ title }}</h1>
  <time datetime="{{ page.date | dateISO }}">{{ page.date | dateJP }}</time>
  <div class="tags">
    {% for tag in tags %}
    <a class="tag" href="/tags/{{ tag }}/" title="{{ tag }}">#{{ tag }}</a>
    {% endfor %}
  </div>
</header>

<article>
  <div class="post-content">

  {{ content | safe }}

  </div>

</article>
```

`{{ content | safe }}`にMarkdownで書かれた`記事.md`がhtmlに変換されて読み込まれると言う感じです。

`src/posts/`というディレクトリを作り、その中に記事を作っていきます。そこに`posts.json`を作ります。**これが大事な所**です。

```json
{
  "layout": "post.njk",
  "tags": "posts"
}
```

`posts.json`には上記のように記載します。すると`tags`が`posts`の全て記事は、`layout`に`post.njk`を利用します。つまり、すべての記事は、

1. `post.njk`にMarkdownの記事が入った構造のパーツが入り
2. `base.njk`に`post.njk`が読み込まれる

こういうのがレイアウト・チェーン(Layout Chining)と呼ばれるものです。

#### レイアウト・チェーンはどうやって動作しているか

これは、記事のフロントマターに記載した`layout`が影響しています。

- 記事のフロントマターには`layout: post.njk`とテンプレートを指定します
- `post.njk`のフロントマターには`layout: base.njk`とテンプレートを指定します

この働きで最終的なテンプレートが連鎖して読まれるようになります。全てに同じhtmlを書かずとも一部を書いてそれを読み込むという考えです。
Word Pressで使用するPHPなどでも`include`でパーツ化されたhtmlを読み込んで最終的に全体的なhtmlにしますが、そういった事です。記事を書く人は記事だけ書けば後はテンプレートを処理して1枚のhtmlにしてくれるということです。

他にもheader、footerは別で書き、`base.njk`で読み込むということもできるわけですが、これは色々な方法があります。
`base.njk`で`{% block 名称 %}`を使用して、`{% include "_includes/layout/header.njk" %}`などとして直接読み込む事ができます。

```njk
---
title: my site
---

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
</head>
<body>
  {% block header %}
    {% include "_includes/layout/header.njk" %}   <!-- デフォルトのヘッダー -->
  {% endblock %}
  <main>
    {% block content %}
      {{ content | safe }}
    {% endblock %}
  </main>
  {% block footer %}
    {% include "_includes/layout/footer.njk" %}   <!-- デフォルトのフッター -->
  {% endblock %}
</body>
</html>
```

のような感じになります。includeは<u>直接パスを読み込む</u>のでheader,footerに**フロントマターのlayoutは不要**です。

他にも`base.njk`を継承してブログの内容を変更したりもできます。が、これはやや凝った使用法になるので後々考えればよいす。
少し説明すると、従来と言うか通常では何かしらの条件でヘッダーの内容変えるという場合にそれはnunjucksの`if`を使用して、条件毎に読み込むテンプレートを作り、指定し直せばよいわけです。
しかしそういうのが増えてくるとゴチャッとなるので、`extend`(拡張)というのがあります。`base.njk`を継承してテンプレート自体を変更させる方法です。

ある記事の内容は`post.njk`を変更させて作りたいが、post.njk自体はそのページだけを動的に変更できないので、`page.njk`を作り、extendでpost.njkを継承させます。すると、同じような機能で違う見た目のページができるという考え方です。Aboutページとか、個別ページにしたいこともありますよね。
しかしこれは予めの設計が必要なので、それなら最初から`post.njk`と`page.njk`を作ってそれぞれのフロントマターに`layout: base.njk`と指定すればいいとも言えます。

これらは、テンプレートを作る時の労力の差だろうと思います。別々にテンプレートを作っても良いが、使う機能が同じなら継承して部分的に変更したほうが修正・変更する量が減るだろ？と言う考え方かと。

#### パーマリンクについて

11tyのデフォルトではパーマリンクの設定をフロントマターに書かずとも、次のようになります。

<div class="table-container">

| 入力ファイル例              | 出力先(\_site/)例                         | 実際のURL                  |
| --------------------------- | ----------------------------------------- | -------------------------- |
| `index.md`                  | `_site/index.html`                        | `/`                        |
| `about.md`                  | `_site/about/index.html`                  | `/about/`                  |
| `blog/my-post.md`           | `_site/blog/my-post/index.html`           | `/blog/my-post/`           |
| `2025-03-06-hello-world.md` | `_site/2025-03-06-hello-world/index.html` | `/2025-03-06-hello-world/` |
| `posts/2025/my-article.md`  | `_site/posts/2025/my-article/index.html`  | `/posts/2025/my-article/`  |

</div>

と、「記事のファイル名」はできるだけわかりやすい英語で書くのが良いです。実際のurlでは<u>index.htmlは省略されます</u>。
またローカルで`posts/`ディレクトリの下に更に`posts/2025/`などとディレクトリを作りその中に`記事.md`を置いた場合、`posts/2025/記事ファイル名`とそのままのアドレスになります。

デフォルトのままだと日付やフォルダ名がURLに入ってしまうので、<u>フロントマターでpermalinkを明示的に指定</u>するのが一般的です。

```njk
---
title: 記事のタイトル
date: 2025-03-06
permalink: /blog/{{ page.fileSlug }}/
---
```

のように書かれることが多いです。
上記の`page.fileSlug`部分は、ファイル名から拡張子と日付プレフィックスを自動で除去したスラッグ、つまりファイル名だけのアドレス`/blog/my-first-post/`のような感じになります。混同してはいけないのが、ページの`title`ではなく、ファイルとして保存するファイル名が採用されるということです。
また末尾に`/`をつけると、11tyが自動でindex.htmlをつけてくれます。

基本は何も書かなくても大丈夫ですが、

```njk
permalink: /何かしら/{{ page.fileSlug }}/
```

を書いておくのが良いかと思います。「何かしら」は例えば`blog`などです。
`https://.../blog/[file-name]/`
というような形になる感じです。ドメインが何になるかでpermalinkをどうするかは考える必要もありますが、記事が増えてから修正するのは大変なのでそれなりに初期段階で結構決めておく必要があるかと思います。

## 記事が書けたらどうするか？

まずはどこで公開するかを考えて、そのサイトの仕様を把握します。ローカルで作成したファイルをどこ(例えばGithub)に置けば良いかなど調べておく必要があります。公開先の仕様がそれぞれあるからです。Githubにpushすればそれを自動で検知して自動でビルドしてくれるサイトもあります。

ここでは、Githubにリポジトリを作りそこにファイルをpushするという流れで説明します。

Gitクライアントに[Fork](https://git-fork.com/)と言うソフトを使用します。本来はターミナルや簡易なGUIのGitクライアントで完了できますが、Windows派の人は極度にターミナルを嫌う傾向があるのでできるだけターミナルを使わず行う方法で書きます。

- (Gitクライアントの)Forkをダウンロードする
- 念の為、下記の「デプロイ先を決める」というのもよく読んで、Githubのアカウント名とリポジトリ名を熟考して決める

まずこれで事前準備ができます。

### ブラウザからGithubに新しいリポジトリを作成

1. ブラウザで[Github](https://github.com/)にアクセスしてSign inか、アカウントなどが作られていない場合Sign upします。
2. ログインできたら、右上ある ＋ アイコンで New repository をクリック
3. 以下の項目を入力
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Owner</span>： 自分のユーザー名（デフォルトで選択済み）
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Repository name</span>： 例 my-eleventy-blog（小文字・ハイフン推奨）
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Description</span>（任意）： 簡単な説明を書く
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Public / Private</span>： 最初はPublicでOK
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Add a README file</span> → チェックを入れる（これで初期コミットが入る）
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Add .gitignore</span>（任意）： Node.jsプロジェクトならNodeを選択
   - <span class="font-bold dark:text-sky-200 light:text-sky-900">Choose a license</span>（任意）： MITなど
4. 一番下の <span class="font-bold dark:text-sky-200 light:text-sky-900">Create repository</span> ボタンをクリック

### Forkクライアントで操作

![fork](../img/fork.avif)

1. Forkアプリを起動
2. 左上のfileメニューからInit New Repository(一番上)を選ぶ
3. するとフォルダ選択ウィンドウが開いて、現在作業している11tyのフォルダを選択します
4. 左ペインからRemotesで右クリックして、Add new Remoteを選ぶと小さなウィンドウが出てきます
   - Remote: が origin となっているかと思いますが、それはそのままで問題ありません
   - Repository Url: にはブラウザで自身のリポジトリまで行き、そのアドレスを入れたら良いです
      - 正確にはGithubなのでそれで許容されていますが、他だとリポジトリアドレスの末尾に`.git`をつけるのが正確です
      - 真ん中上の<span class="bg-green-700 text-natural-200 px-2 mx-1">Code</span>を押して表示されるアドレスが正しいアドレスです

2のInit New Repositoryの作業が終わった段階でForkの左ペイン一番上にある Local Changes と言う所に更新されたファイルが出てくるはずです。更新などは確認されているがどこにpushすべきか不明なので、それを4の Remotes で指定するわけです。

真ん中のペインにUnstagedとstagedと言う欄があります。ファイルは全てUnstagedにあり、初回はでき上がっているもの全てをpushするので、キーボードの`Shift`を押しっぱなしにすると、「Stage」ボタンが「Stage All」となってボタンを押せば全てが「Staged」に移動します。

> (Un)staged　とは
> これはそのままの意味です。unstagedがまだステージに上っていない、つまり変更はあるけどもまだCommitする候補に入っていないという事です。
> Stagedはステージに上って準備okの状態です。Commitする内容として選ばれている状態です
> アイドルで言う、皆が一所懸命レッスン受けたりで準備をしているが、全てUnstagedでまだ選抜メンバーが選ばれておらず、選抜メンバーに選ばれるとStageに立てるというような意味と同じ事です。

同時に、右側の下にある、「Commit Subject」や「description」に文字を入れられるので、日本語・英語どっちでも良いですが、基本英語で「1st commit」とSubjectに入れて右下のcommitボタンでコミットします。

> commitとは
> AKBで喩えると、(Un)stagedが毎日頑張っているメンバー(作成しているファイル)から、いわゆるアイドルの選考をマネージャー・運営がしている段階で、それらで選ばれたメンバー(staged)を秋元康の所に持っていって最終決定で「よし次のシングルはこれで行こう」とされるのがいわゆるcommitされるということです。

その後、また小さな画面が出て特別何か手を付ける必要はないですが、今度は push するという感じになります。これでGithubにファイルがアップロードされる流れとなります。

> pushとは
> これまでと同じ流れで言うと、「よし次のシングルはこれで行こう」とcommitされ、pushは正式にシングルとして世に出るということを意味しています。

これでForkの使用方法は理解できたでしょうか？
(Un)staged/Stagedの段階ではどれを選ぶかはまだ決まっていない状態なので、ローカルで作業している記事ファイルが途中のもの・完成したものがあれば、完成したものだけを選んでStagedにしCommit/pushすればよいです。

Gitというのはバージョンを自動で管理するためのものであるので、pushした後で、タイプミス(タイポ)があったとしても、既に行ったpushを取りやめて修正ではなく、<u>新たに修正したものをpushしていく</u>としてバージョンが進むようになっています(変更点を記録していくのが本来の姿)。なので**ローカルでの確認が大事なのです**。11tyはでき上がったサイトをブラウザでローカルにいながらにして確認できますから、このシステムと相性が良いわけです。

> gitとそのバージョンについて
> よくExcelなどで、「03-06修正」→「03-06修正2」→「最終修正」→「final」→「final_v2」…とどれが本当の最終かわからなくなって、「誰が作ったこれ、アホかと」なることってありますよね。
> gitは変更があった時に、何をいつどう修正したか、その理由はなにか(Commitの変更内容・ディスクリプション)でわかるように変更管理(バージョン)として記録していくものです。

ForkはGitの全機能が使えると言うらしいのでもっと高度に使用できると思いますが、11tyの開発作業としてやることは初期設定が済んだら、どれをcommitしてpushするかというだけです。

### デプロイ先を決める

11tyのサイトが、ローカルで完成テスト済みとなったら、どこかにアップロードして公開します。
どこで公開するかで色々と変わります。

<div class="table-container">

| サービス名                                   | ビルド自動化(git連携)  | 独自ドメイン | デフォルトのURLパターン                                                                                                                     |
| -------------------------------------------- | :--------------------: | :----------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Pages                             | ◎（GitHub/GitLabなど） |      ◎       | https://<プロジェクト名>.pages.dev                                                                                                          |
| Netlify                                      |           ◎            |      ◎       | https://<サイト名>.netlify.app                                                                                                              |
| Vercel                                       |           ◎            |      ◎       | https://<プロジェクト名>-<チーム/ユーザーslug>.vercel.app                                                                                   |
| GitHub Pages                                 |      △(要Action)       |      ○       | https://<ユーザー名>.github.io （ユーザー/組織サイトの場合）<br/>https://<ユーザー名>.github.io/<リポジトリ名> （プロジェクトサイトの場合） |
| Render                                       |           ◎            |      ◎       | https://<サイト名>-<ランダム文字列>.onrender.com                                                                                            |
| DigitalOcean App Platform                    |           ◎            |      ◎       | https://<アプリ名>-<ランダム>.ondigitalocean.app                                                                                            |
| AWS S3 + CloudFront                          |    ×（自分で設定）     |      ◎       | 自分で決めたCloudFrontディストリビューションのドメイン（例: `d123abc.cloudfront.net`）                                                      |
| レンタルサーバー<br/>（Xserver, ConoHaなど） | ×（手動アップロード）  |      ◎       | それぞれのページで要確認                                                                                                                    |

</div>

デフォルトのURLパターンを見ると、GitHubのリポジトリ名（とユーザー名）をどう決めるかは、デプロイ先のURLの見た目や管理のしやすさ、将来的な拡張に直結する大事なポイントになります。特に静的サイト（Eleventyなど）でGit連携デプロイする場合、リポジトリ名がURLの一部になるケースがほとんどです。最悪独自ドメインを取得して設定すればよいですが。

基本的には、

- 全て小文字
- 単語の区切りはハイフン`-`で(アンダースコア`_`は避ける)
- 短くわかりやすいもの
- その他、避けるもの： キャメルケース(camelCase)、スペース、大文字、バージョン番号は入れないように気をつける

例えば、my-blogとリポジトリにつけるとすると、

- Cloudflare Pages → `https://my-blog.pages.dev`
- Netlify → `https://my-blog.netlify.app`
- Vercel → `https://my-blog-yourusername.vercel.app`
- GitHub Pages（プロジェクトサイト） → `https://yourusername.github.io/my-blog/`

リポジトリ名は後から変更可能ですが、URLが変わるとリダイレクト設定が必要になるので、最初に「これで一生使うかも」くらいの気持ちで決めるようにします。デプロイするまでは変更しても大丈夫ですけども。

### おまけ - exampleフォルダ

![11ty-project screenshot](../img/11ty-project-ss.avif)
{class="md:float-end md:w-[30%] md:pl-[1rem]"}

自分で公式ガイドなどを見て1から作っていくのを目的としていますが、何も無いと何から手を付けてよいかわからないとか、どうするのか公式の何を見たら良いのかというのもわからないと思うので、確認も兼ねて最小構成のファイルをダウンロードして、実際に作業を途中まで行ったものを`exapmle`としてGithubに置いてあります。

`example`の中にある`src/`を、本来の`src/`と置き換えるというような感じで使用します。

ページネーションや諸々は自身で設定して行く必要があります。敢えて設置テストをして外してあります。この時に発覚した問題点も修正しました。それが完璧かはわかりませんが。
各記事には事細かにではありませんが説明を書いてあります。ページネーションはどうやって作るか、どこを変更するかなどです。それらで少しずつでも仕組みがわかってもらえると良いなという感じです。

ローカルで作って保存してもすぐ公開されるわけではないので、たくさん失敗しても何も問題はありません。
`src/`の中身だけをいじるのであれば、エラーが出てるとしてもcssの末尾の`;`を忘れているとか、テンプレートのどこかに記載ミスがあるとかそういうことかと思います。何かを変更・保存してブラウザで確認すれば変更点が反映されるということは今どこを変更したかもわかっているはずなので、修正も楽になるのではないでしょうか？

## まとめ

Githubにpushするまでの話はだいたい同じような道を通るので説明できますが、公開先はそれぞれが変わりますし必要なものとかも変わっていくと思います。
昔であれば「自分がGithubにリポジトリを置いて、Netlifyで公開しているのでこの通りやればできます」としか説明できなかった事でも、そこから先、あるいは環境作りから公開先の相談までAIで可能です。

これをきっかけにViteが面倒であれば、通常の11tyのスターターキットなどからでも選ぶことができます。英語のものがほとんどですが、[11ty bundle.dev](https://11tybundle.dev/starters/)などからデモサイトを見てデザインからでも選べます。使いやすさなどはわからないでしょうが比較的新しいものから選ぶ方が良いです。新しすぎると色々別の問題が出ることがあるかも知れませんが。
学習するのと利用するのとでは多分アプローチも違いますから、それらは各自で選択してもらうのが良いかと。

これを機に11tyの存在も知ってもらって利用する人が増えるといいなと思っています。

調べてみると、今どきはAstro、Hugoの使用率がかなり高いです。11tyはその中でもやや利用者離れが進んでいるような感じありますが、少数派のいぶし銀のような存在です。
作者([Zach Leatherman](https://www.zachleat.com/))は[Font Awesome](https://fontawesome.com/)の社員です。2024年以前からFont Awesomeのデベロッパーで、2026年3月には、EleventyがBuild Awesomeというブランド名にリブランディングされFont Awesomeの傘下でさらに開発が進められています。

リブランディングされて、企業傘下で開発しているということは、それまでの個人でやるよりも開発に集中できるわけなので更に洗練されていく可能性はあります。しかしこういったものは企業が絡むと途端に駄目になるケースもあり、そうならないように願うばかりです。

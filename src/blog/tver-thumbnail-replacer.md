---
title: TVerの動画プレイヤーサムネイルを軽くする
description: どの人にも役に立つかと言うとそうでもなく、テザリング環境やネット回線量を減らすために
date: 2025-06-05
update: 2025-06-05
category:
  - blog
tags:
  - 拡張機能
images:
  - ../img/tver_small.jpg
  - ../img/tver_small.webp
  - ../img/tver_small.avif
  - ../img/tver_medium.jpg
  - ../img/tver_medium.webp
  - ../img/tver_medium.avif
  - ../img/tver_large.jpg
  - ../img/tver_large.webp
  - ../img/tver_large.avif
  - ../img/tver_xlarge.jpg
  - ../img/tver_xlarge.webp
  - ../img/tver_xlarge.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## どんな人向けのものか

ネット回線が遅い人がTVerを利用しようとはしないかも知れませんが、TVerには**後で見る**という機能もあり、動画をその場で見なくても一旦休憩時間にチェックして後で見るに登録しておき帰宅してから家の回線で視聴するという使い方や、動機は同じですがテザリングでノートPCを外に持ち出しているけども動画見るには通信量が、とか、そもそも低速になったんで外では見れないけども、会社に戻ってから休憩時間にちょっと見るとか、やはり帰宅してから見るようにという感じで、つまりはネットの速度が遅いにも関わらず<u>TVerは見ているブラウザのユーザーエージェントで判断しているのか、動画プレーヤーの背景のサムネイルを高解像度のもので表示してやがるんです</u>。

これはいけません。全然ダメです。もしカテゴリごとに全体をチェックしようものなら高解像度のサムネイルはその時のトータルで20MBぐらいは消費するように思います。場合によって少なくなったりもっと多くなったりすることもあるかもしれません。

これがもし毎日あったとしたら、あぁ恐ろしい。

サムネイルはどんなものかがわかればそれでよく、必ずしも高画質である必要はありません。もしこれらを一挙両得したいなら最初からwebpやAVIFでサムネを作ればいいやんと。軽くて高画質ができるやんと。

けどもそうしないのがTVerであり、おそらくは若いデザイナーだろうと思うのです。これらはまた後で書くとして、どういうものかを書いていきます。

## TVer Thumbnail Replacer

大仰な名称がついてますが、大したものではありません。簡単に言うと、

```html
<img src="https://google.com/images/xlarge/xxxx.jpg" />
```

と仮のアドレスですが、こういうのがあった時、TVerでは、動画リスト(各動画の一覧リスト)ではxlargeではなくsmallと言うディレクトリの画像を使用しています。これは低解像で、動画リストでのサムネイルには丁度よいのでしょうが、動画プレーヤー(本編を再生するプレーヤー)の背景、サムネイルとしては解像度が低くなります。
small画像のそもそもの解像度も低いでしょうし、画像サイズも小さいものを大きなコンテナに入れるともちろんギザギザが目立つようになりますが、**何の画像かわからないほど低画質なものではありません**。

これを使えばいいやんと。動画ページは普通は動画リストから来るわけなので「今見てきた動画リストにあるんだから、動画プレーヤーでもあるはず」と、であればアドレスの一部を書き換えたらいいやんというものです。

以下、Firefoxの拡張機能として作ってあります。Firefox用ですが、特別(専用的な)特定のものがないのでChromeでもそのまま動くかも知れません。まだ試してませんが。

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "TVer Thumbnail Replacer",
  "version": "1.0",
  "description": "Replace xlarge thumbnails with small on TVer episode pages.",
  "permissions": ["scripting"],
  "host_permissions": ["https://tver.jp/episodes/*"],
  "content_scripts": [
    {
      "matches": ["https://tver.jp/episodes/*"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "48": "icon.png"
  }
}
```

### content.js

```js
// 画像のsrcを置換する関数
function handleImageSrc(imgElement) {
  if (imgElement.dataset.processed === "true") return; // 再処理防止

  const src = imgElement.getAttribute("src");
  if (src && src.includes("/xlarge/")) {
    const newSrc = src.replace("/xlarge/", "/small/");
    imgElement.setAttribute("src", newSrc);
    imgElement.dataset.processed = "true"; // 処理済みフラグ
    //console.log(`Replaced image src: ${src} -> ${newSrc}`);
  }
}

// MutationObserverの設定
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // 一発で対象imgを探す（親または子孫）
        const img = node.matches('[class*="PlayerThumbnail_wrapper__"] > img')
          ? node
          : node.querySelector?.('[class*="PlayerThumbnail_wrapper__"] > img');

        if (img) handleImageSrc(img);
      });
    } else if (
      mutation.type === "attributes" &&
      mutation.attributeName === "src"
    ) {
      const img = mutation.target;
      if (img.matches('[class*="PlayerThumbnail_wrapper__"] > img')) {
        handleImageSrc(img);
      }
    }
  }
});

// ページ全体を監視（サムネイルがいつ現れるか不明なため）
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src"],
});

// ページ初期ロードで既にある画像もチェック
const existingImg = document.querySelector(
  '[class*="PlayerThumbnail_wrapper__"] > img'
);
if (existingImg) {
  handleImageSrc(existingImg);
}
```

### 一部コード解説

コードの一部にあまり見慣れないものがあるかと思いますので、それを一応説明しておこうかと思います。

```js
node.querySelector?.('[class*="PlayerThumbnail_wrapper__"] > img');
```

という所に`Selector?.(`と「?.」と書かれている部分があります。これは[オプショナルチェーン(MDN)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Optional_chaining)演算子と呼ばれ[ES2020(とほほの WWW 入門)](https://www.tohoho-web.com/ex/es2020.html)以降で導入された構文です。

MDNのリンクにもありますが、チェーン演算子(`a.b //ドット`)と似ているものの、参照するものがなかった場合に、エラーを返さず、短絡され`undefined`が返るようになっています。

> →更に色々と解説しているサイト[JavaScriptのモダンな書き方-ES2020のオプショナルチェーン、null合体演算子、動的import、globalThis等を解説-ICS MEDIA](https://ics.media/entry/200128/)

該当部分のコード`node.querySelector?.('[class*="PlayerThumbnail_wrapper__"] > img')`で言うと、

```js
if (node.querySelector) {
  return node.querySelector('[class*="PlayerThumbnail_wrapper__"] > img');
} else {
  return undefined;
}
```

今までならこのように書く必要がありました。

- `node`が **`querySelector`メソッドを持っていれば実行する**
- 持っていなければ **エラーを出さずに `undefined` を返す**

というような意味になります。

この部分は、`img`を探している処理です。`querySelector?.`とあるように、探している`img`がquerySelectorを持っている、あるいはquerySelectorで探せるものであればそれはElementノード(要素)ですが、`<span>abc</span>`のような場合に、abcはtextノード(テキスト)なので<u>querySelectorを持ってない</u>ことになります。

`mutation.addedNodes`をforEachでループさせるのは、配列のようなNodeListなので、何かの要素の中にimgがある場合もあり、

- `node`自体がその`img`の可能性もある
- `node`の中にその`img`がいる可能性もある

ということから、`querySelector`を持ってるかでElementノードを判別し、結果的に`[class*="PlayerThumbnail_wrapper__"] > img`と<u>対象のimg要素の`querySelector`</u>がマッチしていたらそれを返し、マッチしなければ`undefined`でスルーするという感じになります。

マッチするimg要素を探しつつ、マッチしたらそのまま返し、親の要素が探しているのと同じものであるかも調べているということです。img要素本体のチェックと本体の親のチェックもしているという感じです。

---

## これらをどのようにするのか？

どこか任意の場所にフォルダを作って、そこに`manifest.json`と`content.js`を入れてフォルダには何かわかるようなタイトルを付けておいてください。

Firefoxブラウザを閉じてしまうと再度登録し直しになりますが、閉じない限りはずっと読み込まれたまんまになります。登録の方法は、Firefoxのアドレス欄に

```html
about:debugging#/setup
```

と入れます。で、表示された画面から、メニューにこのFirefoxと言うのがあると思うので、それを選ぶと、**一時的な拡張機能**に、`一時的なアドオンを読み込む…`というのがあるので、<u>そのボタンからこの**manifest.json を選択する**と拡張機能が動作するようになります</u>。

ここまでが準備となり、この後[TVer](https://tver.jp/)を開くと機能するようになりますが、

- すでにタブでTVerを開いていた場合は、再読み込み(ページリロード)をすることで拡張機能が有効になります
- 新たに開いた場合は何もしなくても機能します

manifest.jsonの`matches`にあるように、

```json
  "content_scripts": [
    {
      "matches": ["https://tver.jp/episodes/*"],
      "js": ["content.js"]
    }
  ],
```

`https://tver.jp/episodes/*`、つまり動画プレーヤーのあるページだけで機能します。なんせそのページの動画プレーヤーのサムネイルを変更するので当然ではあるのですが。

やってることはアドレスの内の`xlarge`を`small`にするだけですが、画像を読み込む前にローディングスピナーがあり、何かしらの処理が完了するとそのスピナーがサムネイルに読み変わるような流れになっているため[MutationObserver-MDN](https://developer.mozilla.org/ja/docs/Web/API/MutationObserver)で変化を監視して、imgタグ(Element ノード・要素)が読み込まれたら即座に変えるようにしています。

## これらを実際に試してみた結果

TVerでは、動画ページでサムネイルが表示される前にローディングスピナーが出たりします。それがなぜにあるのかがわかりませんでしたが、ブラウザのステータスバーを見てるとGoogleのtagなんちゃらマネージャーにアクセスしているようでした。

これらはアナリティクスとか、もしくは広告などにも使われているのでしょうか、それらを動画ページのサムネイルが表示される前にやっていて、これが案外遅いので、マジモンの低速回線時に試したらわかると思いますが、サムネイルの表示が遅いのはこいつのせいだと言い切れると思います。

更に、動画プレーヤーのサムネイルが通常はxlargeの高解像度のもので読み込まれるため、低速回線の時はそれが読み込まれるのに引っ張られて、概要欄や概要人の中にある出演者リストのアイコン(モノはsmallサイズの画像)なども読み込みが遅れます。おそらくは`async`などで非同期で読み込んでいると思いますが、非同期とは思えないぐらいに帯域を削られます。

通常な光回線では体感できないと思いますが、4k動画を見ている時にXなどのSNSで調べ物をしようとしたらなかなか表示しない、あるいは検索ができないぐらいの回線速度をイメージしてもらえれはほぼ同じ感じかと思います。
いうて今どきはそんなぐらい屁ではないほどに速い回線があるので一概には言えませんが、それらを想像してみて下さい。

一般的なスマホのテザリングで低速回線というと1MB/sぐらいかそれ以下になると思います。30KB/sぐらいだと1Mの画像を表示するのにも数～数十秒かかったりもします。

Youtubeなどでもそうですが、サムネイルがjpgでサイズを落とすためには何の画像かわからないと言うぐらいまで画質(解像度)を落とさないとパッと表示されないため、Youtubeの動画リストのページでも低速回線だと読み込みがなかなかされないとか、**インターネットに接続されていません**などと言われることもあるでしょう。

### ここで冒頭に書いた若手デザイナーの件について

これらは若手デザイナーが生まれた時には既に光回線、少なくともADSL回線があって今ほどではないにしろ高速通信ができている時代からのスタートなのでしょうが無いのです。それがデフォルトなので低速回線のことなど考えるも及ばないということはままありまして、まず**低速回線でテストしない**と言うのが挙げられます。

ChromeにしろFirefoxにしろデベロッパーツールにはそれら低速回線の時にどうなるかをシュミレートする機能があります。なので誰でもがチェックできるはずなのにそれはしないのです。<u>なぜなら高速回線がデフォルトなので</u>。

しかし世の中には低速回線の人もいるんだぜ！と主張したい所ですがそれだけではなく、高速回線であっても画像は**最適化**あるいは**軽量化**すればそれだけ<u>ネット使用量、いうなればギガの消費が少なくて済む</u>わけです。

そうすれば高速に表示されてかつ、使用量も少なくて済むとメリットしか無いのです。けどこう言うと、画質を落とせばきれいな画像で見れないからダメだ！と言うアホウ共がいると思います。しかし違うんだと。
君等がjpegにこだわってるからいつまでもjpgで画像を作っておかなければいけなくなるのであって、今でも綺麗なおねいさんの画像があれば「動画でくれ」とかはまだわかるものの、「gif」でくれという奴がいるわけです。gifと言っても動いてる所をアニメーションgifにしろということですけども。

**これはいけません**。gifなど何もメリットはなくデメリットしか無いのです。

画像をアニメーションさせるにはいくつかそのフォーマットがありますが、こちらのサイトでよく言うAVIFやWebPもアニメーションはサポートしています。しかしほとんどの人がアニメーション画像を求める際には「gifでくれ」と言うのです。

<u>知らないというのは恐ろしい</u>もので、AVIFやWebPにすれば画像サイズ自体が軽減され、かつ画質はjpgと変わらないのです。なぜしないのか？

その答えは、AVIFやWebPを表示・編集したりするアプリが身近にないからです。きっとそうだと思います。
もちろん世の中にはそれらに対応したビューワー、エディターはたくさんあります。しかしAVIFやWebPがデフォルトにならないのでそれら対応しているものでも未だにjpgやgifが使われています。

jpgでも最適化(オプティマイズ)すれば画質を落とさずファイルサイズだけを下げることもできます。しかしjpgというのは<u>すでに圧縮された画像</u>ですから大きくサイズを下げることができない場合もあるのです。

jpgやgifというのは、今や誰もが表示できる、あるいは編集できるフォーマットですのでAVIFやWebPのフォールバック(表示できない環境の人のための代替え)として最終手段としては良いですが、今や**AVIFやWebPは全てのブラウザが対応している**ぐらいですから少なからずwebの世界においてはこれら新しいフォーマットがスタンダードになるべきですが、古い体質が、あるいは保守的な層がそうはさせてはくれないのです。

話を戻し、YoutubeやTVer、そういった皆が見るサイトは使う人が快適に見れるような配慮が必要です。しかし、動画を見るということはそれなりの回線があって然るべきであるという事ももちろんわかりますから、それらをよく使う人は高速回線を持っていると言う思考もわかります。

しかし、冒頭に書いたように、その場で動画を見る訳では無いが休み時間にそれらサイトの情報をチェックして家に帰ってから見ようと言う人はいるんじゃないでしょうか？そのために**お気に入り**、あるいは**後で見る**への登録がそれぞれにもあると思います。

であるなら、低速回線でも動画部分以外は軽くして然るべきだとは思いませんか？

### 分かりやすいように比較画像でチェック

ドラマ ドラゴン桜(1期)が 6/5から始まってまして、その1話のサムネイルでの比較です。TVerでは、small、medium、large、xlargeと4種類のサイズがあるようです。

#### 画像サイズ

|        | Width(px) | Height(px) |
| -----: | :-------: | :--------: |
|  Small |    420    |    270     |
| Medium |    640    |    360     |
|  large |    960    |    540     |
| Xlarge |   1280    |    720     |

#### 各フォーマットのファイルサイズ

これらは[nomacs](https://nomacs.org/)で元々のオリジナルjpg画像を`バッチ処理`にて<u>各フォーマットに変換</u>したものです。WebPは画質選択できましたがAVIFはできませんでした。<u>個々に変換すればできると思います</u>((別名で保存などから拡張子をavifに変えて保存からオプション画面に移りそこで画質が選べたように記憶しています))。

|                 | small  | medium | large  | xlarge  |
| --------------- | :----: | :----: | :----: | :-----: |
| jpg(デフォルト) | 105KB  | 172KB  | 336KB  |  519KB  |
| WebP(中画質)    | 34.7KB | 50.0KB | 85.3KB |  122KB  |
| AVIF            | 26.9KB | 41.2KB | 58.1KB | 48.0 KB |

AVIFのxlargeがなぜかlargeよりファイルサイズが小さいと言うことで、おかしいと<u>2回試しましたがやはり同じでした</u>。これらは変換するアプリが何であるのかでも変わるのかも知れませんし、何かが影響していると思いますが、何かまではわかりません。

しかしポイントはそこではなく、元のjpgに対してこの**ファイルサイズ**ということにまず注目して下さい。その上で実際の画像を見てみて下さい。
全て別タブ(ウィンドウ)でそのものが表示されます。少なからず、下記のように縮小化してあるのではその違いはわからないでしょう？
別ウィンドウで開いて見比べてみて下さい。ね？違いがわからないでしょう？だったらなぜに重いjpgである必要があるのかという事です。

##### small

<div class="flex flex-flow">
    <div class="md:max-w-[33.3%]">
        <span>jpg</span>
        <a href="../img/tver_small.jpg" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_small.jpg" alt="TVer thumb jpg small" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>webp</span>
        <a href="../img/tver_small.webp" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_small.webp" alt="TVer thumb webp small" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>avif</span>
        <a href="../img/tver_small.avif" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_small.avif" alt="TVer thumb avif small" />
        </a>
    </div>
</div>

##### medium

<div class="flex flex-flow">
    <div class="md:max-w-[33.3%]">
        <span>jpg</span>
        <a href="../img/tver_medium.jpg" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_medium.jpg" alt="TVer thumb jpg medium" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>webp</span>
        <a href="../img/tver_medium.webp" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_medium.webp" alt="TVer thumb webp medium" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>avif</span>
        <a href="../img/tver_medium.avif" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_medium.avif" alt="TVer thumb avif medium" />
        </a>
    </div>
</div>

##### large

<div class="flex flex-flow">
    <div class="md:max-w-[33.3%]">
        <span>jpg</span>
        <a href="../img/tver_large.jpg" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_large.jpg" alt="TVer thumb jpg large" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>webp</span>
        <a href="../img/tver_large.webp" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_large.webp" alt="TVer thumb webp large" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>avif</span>
        <a href="../img/tver_large.avif" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_large.avif" alt="TVer thumb avif large" />
        </a>
    </div>
</div>

##### xlarge

<div class="flex flex-flow">
    <div class="md:max-w-[33.3%]">
        <span>jpg</span>
        <a href="../img/tver_xlarge.jpg" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_xlarge.jpg" alt="TVer thumb jpg xlarge" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>webp</span>
        <a href="../img/tver_xlarge.webp" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_xlarge.webp" alt="TVer thumb webp xlarge" />
        </a>
    </div>
    <div class="md:max-w-[33.3%]">
        <span>avif</span>
        <a href="../img/tver_xlarge.avif" target="_blank" title="別ウィンドウで開きます">
            <img src="../img/tver_xlarge.avif" alt="TVer thumb avif xlarge" />
        </a>
    </div>
</div>

### まとめ

jpgの、誰でも見れるようにとその対応の多さを言うのも、AVIFやWebPが現行の全てのブラウザが対応しているのでその理由は薄く、古いブラウザのためにと言い分けをしても古いブラウザってIEとかモバイルSafariですよと。
IEを今でも使い続けなければいけないのは役所や企業で、その機能でしか仕事ができない所だけであり、仕事中にYoutubeやTVerを見るわけもなく、またそういう企業や役所でこれらサイトを見るのもどうだとも言えます。であれば無視して構わないブラウザの事を言っているのでその理由も薄いわけです。
何を保守的なことを言ってるんだと。

例えばChromeは対応しているけども、Firefoxではまだ未対応という段階であれば使用を躊躇するのはわかります。しかし**現行ブラウザは全て対応している**のです。
アプリで使用する場合はそれらがweb基準かはわかりませんが、モバイル版のChromeでもFirefoxでもできるということはライブラリもあるだろうと思うのでアプリでも対応できるはずですから、AVIFやWebPを使用できない現在ある最大の問題点は、ローカルでの閲覧と編集が全てそれら新しいフォーマットに対応していないということであるとも言えると思います。

GoogleやYoutube、そしてTVerなどの多くの人が利用するサイトにおいて、これらがもうMicrosoftのサポートも終わったIEとか、ほぼどうでもいいモバイルSafariだけを気にして新しいフォーマットを使用しないのはいけない事だと僕は思うわけです。君等大手サイトが率先して対応していかないとそれら新しいフォーマットは全然普及しないじゃないかと。

これらはそれらサイトを利用する人に多大なメリットをもたらす可能性があります。重箱の隅を突っつくようなデメリットもあるにはあるでしょうが、

1. サイトの表示が速くなる
2. ネットトラフィックが軽減できる
   - サーバー負荷が下がる
   - サーバー使用料金も下がる
   - 電気代も安くなるかも
   - 待ち時間が短くなる(1もこれが該当)
3. ギガ消費も軽減できる
   - より多く利用できるようになる

ファイルサイズが軽減できるということはこう言うことです。

アフィリエイトブログで、そうでなくても画像の読み込みに時間がかかるサイトが多くあります。今やそれらしか残っていないと言っても過言でないぐらいですが、そういうサイトが重いので、より高速な回線を高額を出費して利用するしかないのはインターネットと大きな枠組みで見ても利用者が得をしているとは言い切れないとも思うのです。
なので、ファイルサイズはできるだけ最適化するか新しいフォーマットでそもそものファイルサイズを軽減し、見た目に同じ画質なら提供している側にとってもメリットはあるのではないかと。
画質はきれいなのにサイトが軽いって夢のような環境じゃないでしょうか？
言うて、TVerジャンキーでしか、この拡張機能を利用するメリットは大きくはないんですけどね。

ただひとつ、面倒くさいから金払うよとか、金払えば快適になるんだろ？という思考停止はもう止めようと。既に**快適になる方法は存在している**のです。金を払って得られている快適さは実は無駄でしか無く、それこそAppleに新しいiPhoneが出るたびお布施する信者と同じことなのです。

拡張機能で何とかしなくても<u>提供する側が設定できるようにする</u>とか<u>自動で快適になるようにすればよいだけのこと</u>なのです。

### 追記

grokにXがAVIFやWebPに対応しない理由は何かと聞いた所、イーロン・マスクの体制になってから規模を縮小し効率化に努めている点があり、以前にWebPなどの対応はできないのかという質問があった所、協議中で状況が変わっていないということで、おそらくは新フォーマットの有用性はわかっているものの、それらを実装して問題がでたりすることを避けているとか、最適化するのに(クローラー、処理系諸々の開発等の)予算が下りないとかがあるのだろうと思われるというようなことを言っていました。
ファイルサイズが減れば、ネット通信量もサーバー使用量も削減できるけれども、開発する資金等を考えるとすぐに対応するには至らずペンディングと言う感じです。

---
title: 階層のない平打したHTMLで、見出しとその本文を任意のタグで囲むJavascript関数
date: 2024-03-12
category:
  - blog
tags:
  - JavaScript
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---


### 階層のない平打したHTMLで、見出しとその本文を任意のタグで囲むJavascript関数

はい、意味がわからないタイトルになりました。何がしたいかと言うと、今記事を書いているこういった形式のものでもっと短めのもの、例えばドラマや映画などでは、

- タイトル
- 概要
- キャスト
- 放送(公開)日

こういったものが書かれると思いますが、Markdownのようなもので書いた場合にエディターによっては、`<div>`や何かしらのタグでひとかたまりとして囲んでおけるわけですが、たいていは次のように、

```html
<h3>コードブルー</h3>
<blockquote>その概要</blockquote>
<ul>
    <li>山下智久</li>
    <li>新垣結衣</li>
    <li>戸田恵梨香</li>
</ul>
<p>2010年 放送</p>
```

ただの平書きのhtmlが連続して書かれると思います。ひとまずこれらを書いておいて、あとから`<div class="drama"></div>`で囲もうとした場合に、jQueryでは、兄弟要素を調べてキーワードとしては、`nextUntil`、`addBack`、`wrapAll`などでどこからどこまでを囲むのは比較的簡単に行えました。

しかしこれがJavascriptでは案外難しく、例えばAIのGemini、Copilotは全然ダメだけども[Codeium](https://codeium.com/)などでも適した答えがなかなかでないのが現実です。
一般的にもcssで判定できるものであればまだしも、上記のようなhtmlで、例えばリストの代わりに`table`があったり、画像が別で挿入されていたりしていたらどうでしょうか？
またおそらくですが、AIに対して正しく質問すれば、正しい答えが返ってくるだろうとは思いつつもその質問自体が難しく、どのように聞けば該当の答えが導けるのか、問う方にもそこそこの技量が必要になるのです。

見出しから次の見出しの間を`<section>`で囲みたい

と質問した場合、`section`が区間とか、区分、部分という意味なので、伝わりにくいのかもしれませんが、上手く伝えられません。そこで例をあげて、

```html
<h2></h2>
<p></p>...
<h3></h3>
<p></p>...
```

を、

```html
<section>
    <h2></h2>
    <p></p>...
</section>
<section>
    <h3></h3>
    <p></p>...
</section>
```

としたいと具体例を出しても、この意味は理解しつつも、`<h2>`だけラップしたりという結果になったりします。そんなもんはcssで選択できるやんとどれだけ突っ込んだかわかりません。

一方で[stack overflow](https://stackoverflow.com/)などで見ると、兄弟要素の選択の仕方や追加などはたくさんあるのですが、jQueryでいう`wrap`などの情報はあるにはあってもあまりたくさんは見つからず、おそらくjQueryでできるならjQueryを使えばいいじゃないと言う考えなのでしょうが、そのjQueryを読み込む時間さえも削りたいと言うかJSのネイティブな状態で動けば速いやんと言うのもあり、また勉強も兼ねてjQueryで正しく動作しているコードをJavascriptに変換するならどうなるかと言うサンプルをAIにやってもらったりするのも勉強になりますが、これが正しく動作しなかったりがあります。

どのように書けばどのように動作するかをたくさん知ることが勉強になると思います。

よくネットで見かけるJavascriptの解説サイトに書いてあるような事は、概ね[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript)に書いてあります。MDNを更に噛み砕いて説明されている所もたくさんあります。が、そのどれもに<u>今、自分が欲しい情報があるとは限りません</u>。

あるメソッドはどういうふうに書くんだっけ？とか、
どんな値が返ってくるんだっけ？とか、
どういうものでどのように使うかを知っていていても忘れたものを細かく検索するのは良いですが、今、自分の欲しい処理を実行するためのサンプルはなかなか見つかりません。

きっと英語圏だけではなく他の外国語のサイトも調べたらもっと多くの有用な情報が見つかると思います。しかし、英語すら満足でない場合は他の外国語などはサイトの模様にしか見えなく、コード自体を読んで使えるかどうかを検証してようやくという感じになります。

もし、ブラウザがHTMLタグの自動補完をしないのであれば、次の見出しの手前に`</section>`を入れて対象の手前に`<section>`を入れたらできそうですが、自動補完機能が邪魔をします。htmlを入れずとも何か独自の文字を挿入して`replace`してはどうだろうかとかと思ったりもします。

人間であれば、すぐに赤ペンで「ここから」、「ここまで」と印を入れて範囲を見つけることができますがスクリプトでは手続きが必要になります。もっとSFチックに「[]」このような見えないカッコが対象の範囲を分節を読み飛ばしながら該当箇所でそれぞれのタグに変換されるというのも面白いですが逆にそういう処理を作り出すのが難しかったり。

結局タグをTraversing(横断)しているというのも、やはりそこに落ち着くのかと思ったりするわけです。もっと良い方法もありそうですが。

### という長い前置きを踏まえて、実際の関数を

```js
/**
 * 指定した親要素内の見出しタグとその次の要素群を指定したタグで囲む
 *
 * @param {HTMLElement} parentElement 親要素
 * @param {string} headingSelector 見出しタグのセレクター (例: 'h2, h3, h4')
 * @param {string} wrapperTagName 囲むタグ名 (例: 'div')
 * @param {string} wrapperClassName 囲むタグのクラス名 (例: 'section')
 */
function wrapHeadingsAndContent(parentElement, headingSelector, wrapperTagName, wrapperClassName) {
    const headers = parentElement.querySelectorAll(headingSelector);

    headers.forEach(header => {
        const headerId = header.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
        const nextUntil = [];
        let nextElement = header.nextElementSibling;

        while (nextElement && !nextElement.matches(headingSelector)) {
            nextUntil.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        const wrapper = document.createElement(wrapperTagName);
        wrapper.id = headerId;
        wrapper.classList.add(wrapperClassName);
        nextUntil.forEach(element => wrapper.appendChild(element));
        wrapper.insertAdjacentElement('afterend', header);
    });
}
```

これが本体で、使い方は以下のようにして使います。

```js
// article要素内の見出しタグ(h2, h3, h4)とその次の要素群をdivタグで囲む
const article = document.querySelector('article');
wrapHeadingsAndContent(article, 'h2, h3, h4', 'div', 'section');

// body要素内の見出しタグ(h1, h2)とその次の要素群をsectionタグで囲む
const body = document.querySelector('body');
wrapHeadingsAndContent(body, 'h1, h2', 'section', 'content');
```

引数部分がちょっとアレですが、つまりは次のような感じです。

```js
wrapHeadingsAndContent(対象の親になる要素, 対象要素, ラップするタグ, ラップするタグのクラス名
```

関数内の名称は`heading`とかとついていますが見出しに限っているわけではありません。これらを用いて、上記使用方法の`article`の方は、

```html
<div class="section">
    <h2>コードブルー</h2>
    <blockquote>その概要</blockquote>
    <p>山下智久、新垣結衣、戸田恵梨香...</p>
    <p>2010年放送</p>
</div>
```

このようになります。上の例の下の使用法のものであれば、`<section class="content"></section>`の中にコードブルーの内容が入るという感じです。

### その関数の解説

#### 必ず、対象になるターゲット要素の親要素を指定する必要があります

動作の内容を簡単に言うと、リスト構造で、`<li>`だけ書いておいてこの関数で`<ul class="xxx"></ul>`で囲むというような働きをするわけです。

`<main>`タグの中にある`<h3>`から続くその内容ごとに任意のラップタグで囲みたい場合などに使用できますが、必ず`<main>`を、あるいはそれに該当する要素を指定する必要があるということです。ページ内の全てということになるとページタイトルなども囲ってしまう可能性があるためターゲットを限定するためです。

#### 対象要素のID

もし、上記コードブルーの`<h2>`タグに`<h2 class="コードブルー">`とあった場合は、そのラップタグにも同様のIDが付いて、何も付いていない場合は指定したクラス、例でいうと`section`がクラス名として使用されます。

```html
<wrapper id="コードブルーか、heading-123456789" class="指定したクラス">
```

というようなもので囲まれるという感じです。

#### 処理の流れ

1. `nextUntil`と言う空の配列を用意します
2. `header.nextElementSibling`で対象の次の要素を見つけます
3. ターゲット要素の次の要素群があるか、ターゲット要素と違う間はループします   
   - これら条件の間、`nextUntil`に見つけた要素を入れていきます   
   - 更に見つけたターゲットの次の要素のその次の要素を対象に同じことを繰り返します
4. ラップする要素を用意します  
   - ラップする要素にIDとクラスを付け加えます
5. `nextUntil`に入っている次の要素をループしてラップ要素に収納していきます
6. ラップする要素をヘッダの前に挿入します

1～4までの処理の流れはまぁまぁ思いつく部分で、ラップする要素をターゲットの手前に入れるというのも想像できると思いますが、3のループの中で次の要素、更に次の要素をとしていくところや、5の用意したラップ要素の中に見つけた要素を収納していくと言う部分などはじっくり考えたら、そらそうだとなりますが、どうしたら実現できるのだろうとだいぶ考える所でしょうか？

少なくともGeminiやCopilotでは近いところまでは実現できても正しく処理できないのはこう言う部分かと思います。

### 試してみたが何も出力がない、あるいはヘッダだけ残って他の要素が消えてしまった という場合

このような場合にまず確認してほしいことは、

```js
function wrapHeadingsAndContent(

// 中略

    const wrapper = document.createElement(wrapperTagName);
    wrapper.id = headerId;
    wrapper.classList.add(wrapperClassName);
    nextUntil.forEach(element => wrapper.appendChild(element));
console.log(nextUntil); //<--これ
    wrapper.insertAdjacentElement('afterend', header);
```

このようにconsole.logを入れて、ヘッダ以外の要素が`nextUntil`に入っているかどうかを確認してください。

ここに要素が入っているのにもかかわらず出力がないというのは、`wrapper.insertAdjacentElement('afterend', header);`ここが原因である可能性大です。

`wrapper`は、関数の引数部分で任意のセレクタ(div、section...諸々)が入る要素です。この中に`nextUntil.forEach(...`で中身を挿入しているので、`wrapper`自体はできているけれどもそれを挿入するのに問題が発生していると言うことです。

`insertAdjacentElement('afterend'`の`afterend`は、要素の後に挿入しますが親要素がない場合は無効になってしまいます。そのため場合によっては次のように書き換えるとokになる場合もあるかと。

`header.parentNode.insertBefore(wrapper, header.nextSibling);`

これは、`header`の親要素から見て、`header`の次に`wrapper`を挿入するということになります。

`insertAdjacentElement('afterend'`と同じことですが`header`の親要素を基準にするので(おそらく)必ずその要素が見つかるかと思います。これらはいずれも`header`の次に任意のタグで囲んだ`wrapper`を挿入して、その中には元々`header`の次に平書きされていた他の要素が入っています。もし`wrapper`が`section`であれば、

```html
<h3>何かしらの見出し</h3>
<section>その内容のpやdiv等</section>
```

という形になります。このような形になってしまえば、sectionの中に元々の内容が入っているわけですから、各`header`を`section`の中に入れればよいわけで、修正した関数としては、

```js
/**
 * 指定した親要素内の見出しタグとその次の要素群を指定したタグで囲む
 *
 * @param {HTMLElement} parentElement 親要素
 * @param {string} headingSelector 見出しタグのセレクター (例: 'h2, h3, h4')
 * @param {string} wrapperTagName 囲むタグ名 (例: 'div')
 * @param {string} wrapperClassName 囲むタグのクラス名 (例: 'section')
 */
function wrapHeadingsAndContent(parentElement, headingSelector, wrapperTagName, wrapperClassName) {
    const headers = parentElement.querySelectorAll(headingSelector);

    headers.forEach(header => {
        const headerId = header.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
        const nextUntil = [];
        let nextElement = header.nextElementSibling;

        while (nextElement && !nextElement.matches(headingSelector)) {
            nextUntil.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        const wrapper = document.createElement(wrapperTagName);
        wrapper.id = headerId;
        wrapper.classList.add(wrapperClassName);
        nextUntil.forEach(element => wrapper.appendChild(element));
        //wrapper.insertAdjacentElement('afterend', header);
        header.parentNode.insertBefore(wrapper, header.nextSibling);
        wrapper.insertBefore(header, wrapper.firstChild);
    });
}
```

このような形になります。

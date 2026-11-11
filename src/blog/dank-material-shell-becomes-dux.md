---
title: Dank Material Shellがバージョン2.0となり名称がDux Shellに変更されました
description: プロジェクト全体も「Dank Linux」から Dux Labs へと改称されています。v2.0からわずか2週間足らずでv2.1になりました。
date: 2026-10-21
update: 2026-11-11
category:
  - blog
tags:
  - Arch系
  - Linux
  - DankMaterialShell
images:
  - ../img/dms-setup-mango.avif
  - ../img/edit-shortcut_thunar.avif
  - ../img/edit-shortcut_firefox.avif
  - ../img/add-app_bind-conf.avif
  - ../img/control_panel-dux.avif
  - ../img/control-center-dark.avif
  - ../img/keyboard-dux.avif
  - ../img/wallpaper_color-dux.avif
  - ../img/font_motion-dux.avif
  - ../img/power_sleep.avif
  - ../img/time_weather-dux.avif
  - ../img/settings-dark.avif
  - ../img/dash-dark.avif
  - ../img/dfiles.avif
  - ../img/system_software_update-dux.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## v2.0が出たと思ったらすぐにv2.1が出てました

[DMS 2.1 Stormborn](https://duxlabs.dev/blog/v2-1-release)

Arch系(CachyOSもそうですが)は既にv2.1に変わって時間が経っています。公式によると、v2.1のコードネームは**Stormborn**でした。

DMSコマンドは変わらないと以前書きましたが、これはDMS(**D**ux **M**odular **S**hell)へと改名、正式名称になりました。
シェルのインターフェース密度も調整できるようになり、Settings > Interface style から、

- Spacious(広々)
- Comfortable(快適・デフォルト)
- Compact(コンパクト)
- Dence(高密度)

を選択できます。DMSのクラシックスタイルも追加され、アイコンとグループ化されたカードにへ変更できるようになりました。

V2.0で既に書きましたが、メディアプレーヤーと歌詞機能が刷新されています。システムモニターも全面的に刷新され、ディスクのSMART値確認や、バグ報告用のMarkdownレポート生成機能などが追加されています。

ビデオ壁紙がサポートされるようにもなっており、`mp4`、`webm`、`mkv`などの動画を壁紙として設定できるようになりました。ロック中や画面オフの時は自動で一時停止します。

新しいOSD(オンスクリーンディスプレイ)が導入され、キーボードレイアウトの切り替え、Num Lockの状態変化、fcitx5等のIME切り替え時にOSDが表示されるようになりました。

### Arch系以外のリポジトリの移行手順について

Dank Material Shell → Dux Labへのリブランドに伴い**Arch系以外のディストリビューション**(Fedora、Debian、Ubuntu、openSUSE、Void Linuxなど)ではリポジトリを新しい`duxlabs`のものに<u>変更する作業が必要</u>になります。
すでに旧リポジトリ（avengemedia や danklinux）を追加してインストールしている環境では、以下のコマンドを実行することで自動的に新しい dux リポジトリへ移行できます。

```bash
dms migrate dux
```

大まかにはこれらが変更点です。

#### MangoWMの注意点

以前、この記事のまとめにも書きましたが、MangoWMの設定ファイルで従来からの記述が新しい記述にも対応しました。新しいDux-shellが配布されね間にHyprland本体も更新がありましたが、これらコンポジターの設定の不備があると起動直後に画面上部などにそれら問題点を表示するウィンドウが出ます。
Duxのアップデートによる対応でそれら警告表示が出なくなっているようです。

しかしMangoWMでは一部まだWARNが出ている設定があり、設定が重複しているのが問題のようです。
maangoの新しい記述にDuxは対応しましたが、一部の設定での競合が残っているという内容でしたが、その行を見てみた所、bind.conf上の<u>記述的としては競合しておらず</u>もしかすると他のconfファイルのどこかに競合している箇所があるのかも知れません。
またそれらWARNが出ていても操作できないわけではありません。

WARNの1つ目はwndowのサイズをリサイズする箇所で、`SUPER (+ SHIFT) + -`と`Super (+ SHIFT) + =`が割り当てられています（カッコはSHIFTが組み合わさっているのと組み合わさっていないものと言うこと）。
`-`(マイナス)はまだしも、`=`(イコール)は日本語配列のキーボードではそれ単体では押せないので、コメントアウトしても良いと考えています。
あるいは、別のキーを割り当てるべきとも思います。

confファイルなどを初期化するには、

```bash
dms setup

# setup後
dms restart
```

手順的には上記のとおりです。`dms setup`をするとコンポジターに何を使うか、ターミナルは何を選ぶかなどの選択肢が出ます。

![dms-setup-mango](../img/dms-setup-mango.avif)

<span class="f-img" data-target="../img/dms-setup-mango.avif">`dms setup`</span>の最後辺りに、「Start from the DMS stock bind」を選べる選択肢がでてきます。これは自身の変更した設定を残すのではなく<u>DMSが持っているストックを適用する</u>ということができます。これがいわゆる初期化と思っています。自身がそれまで使っていたファイルはバックアップするかどうかも選択肢が出たと記憶しています。その場合古い設定はバックアップされて新しいconf（設定）が作られます。

それらを行ってもこれら競合が出るため私の調査と想像では、

- それぞれの記述に間違いはない
- confファイルを分けて管理しているが、bind.conf自体には重複している記述はない
- mongoは分割されているconfファイルをそれぞれ読みんで全体的に見ている

これらのことから、まだどこかに競合（あるいはそれらに関係する問題）が潜んでいる可能性はあります。
前述した説明から、`=`(イコール)はそれ単体で押せないので、それらを含むbind.confの記述をコメントアウトしたら（先頭に`# `と入れる）、ひとまずWARNは消えるということが確認できています。変更して保存で即反映。

本来は別キーを割り当てるのが良いのでしょうが<u>新たに自身では割り当てず</u>ひとまずの応急処置として考え、公式の設定が直るのを待つのが良いと思います。
これらを割り当てない場合、それら機能が働かないだけです。確認した所、Windowリサイズとサークルレイアウトでのギャップ調整みたいなのでほぼ問題なく使用できるはずです。
これら機能を使用する人は何かしらの手段を考えないといけませんが、そんなには使用しない機能なので優先度は低いと感じています。ひとまずMangoWMを使用する人に対しては公式の修正を待つ段階かと考えられますが、これはかなり早い段階で修正されるだろうと期待はしています。

設定を初期化すると自身が行ったバインドの追加もなくなります。v2.0以前からあったと思いますが、Duxでは`Super + ,`で設定を開き Input > Keyboard shortcutsから新しいバインドを登録できます。

<div class="grid grid-cols-1 py-4 md:grid-cols-2 auto-rows-auto">

![edit-shortcut_thunar](../img/edit-shortcut_thunar.avif)
{class="block"}

![edit-shortcut_firefox](../img/edit-shortcut_firefox.avif)
{class="block !mt-0"}

</div>

最初の画像が<span class="f-img" data-target="../img/edit-shortcut_thunar.avif">thunar</span>で、あとの方が<span class="f-img" data-target="../img/edit-shortcut_firefox.avif">Firefox</span>のバインド(キーボードショートカット)をDMSの設定(GUI)から行った画面です。

キーの部分でフォースを入れて<u>実際に登録したいキーを押す</u>と画像のように入力されます。これらは元々DMSに入っているアプリではないのでコマンドで登録します。コマンドを登録すると言っても単にアプリを開くだけなので何を開くかを書くだけです。
内部的には、この画面はMangoWMを使用しているものからなので、

![add-app_bind-conf](../img/add-app_bind-conf.avif)

この画像のように<span class="f-img" data-target="../img/add-app_bind-conf.avif">独自バインド</span>が`~/.config/mango/dms/bind.conf`に自動的に追加されます。

バインドに組み合わせるアルファベットは既に使用されているものもあり、装飾キー(`Ctrl`、`Shift`、`alt`等)の組み合わせ次第ですが、たくさんは登録できないかも知れません。
もしバインドに登録できなかったりしたとしてもアプリに関してで言えば、DMSでは`Super + Space`でアプリ一覧は表示され、選択回数が多ければ上の方に表示されていくようになるので必ずしも登録する必要はありません。
ブラウザとファイルエクスプローラーは頻繁に使用するアプリなので、特に登録しておくと便利です。

私はThunar(Xfce)を使用していますが、dolphin(Plasma)の人もいるでしょうしnautilus(GNOMEのfile)の人もいるかも知れません。この辺りは使用するものを入力して下さい。
v2.0ではDuxがファイルマネージャー([Dux Files](https://duxlabs.dev/docs/dfiles/))もリリースしているので、新規インストールスクリプトで入れた人はそれらが最初から入っているのかも知れませんが、そうでない場合は公式ドキュメントを参考に導入して使用する手もあります。

#### Fedora Atomic系統のサポート開始

またDux installerが、Fedora Atomicもサポートするようになったようです。

> duxinstall now supports immutable Fedora: Silverblue, Kinoite, Sericea, Onyx, Bazzite, Bluefin, Aurora, Zirconium, and other rpm-ostree or bootc images based on Fedora.
> duxinstallは、イミュータブルなFedora（Silverblue、Kinoite、Sericea、Onyx、Bazzite、Bluefin、Aurora、Zirconiumなど、Fedoraをベースとしたrpm-ostreeやbootcイメージ）に対応しました。

これら詳細は[公式ドキュメント](https://duxlabs.dev/docs/dms/installation#fedora-atomic--bootc-images)を参考して下さい。かいつまんで書くと、これらFedora Atomic系のディストリビューションでは`dnf install`ができないので、それらに関して手順があるようです。

---

## v2.0に伴い、DMSからDux Shell(コードネーム：Heisenberg)になりました

### 名前変更について

> コードネーム：Heisenberg(ハイゼンベルグ)
> 前バージョン(v1.6+)が「Wolverine」だったことから、何かの映画繋がりでしょうか？物理学者にもハイゼンベルグと言う人がいます。「不確定性原理」を提唱した人ですが、これまでとは組織名も変わりあらゆるものが新しくなった「予測不能で、すべてが劇的に変化する」みたいな意味合いから常に変化し、確定しない量子的な進化を、大規模な再設計の象徴としてなぞらえた可能性もあります。

エコシステム全体の名称がより親しみやすく整理されました。なお、コマンドやバイナリ名（dms など）はそのまま変更ありません。

|変更前|変更後|
|------|------|
|Dank Linux|Dux Labs|
|DankMaterialShell|Dux Shell|
|DankGreeter|Dux Greeter|
|DankSearch|Dux Search|
|DankGOP|Dux GOP|
|DankCalendar|Dux Calendar|
|DankLinux repository|Dux Labs repository|
|(新機能)|Dux Files|

**Dux**となったのは、Linuxのペンギン<u>Tux</u>へのオマージュであります。短く、主要なソフトウェアと名前が被らず、頭文字が「D」(漫画のそう言うことではなく)のままなのでバイナリ名を変更せずに済みDankよりも親しみやすい響きであることから選ばれました。

### CachyOSでv2.0+にアップデートされたdms-shell配信開始

> 11/5追記
> Githubに問題点を報告していたdux-shellが、11/5にCachyOSで配信されているのを確認しました。バージョンは<u>v2.1</u>になっていました。
> まとめでも書きましたが、シェル上(設定GUI)からソフトウェアアップデートをしてみて、しばらく使用してみても問題点は改善されているようには見えなかったわけですが、パッケージ配信されたものではバージョンが上がっているので、問題点が改善されているかどうかを注視していく運びになります。

> 10/28追記
> `dms-shell`から`dux-shell`と名称が変わって配布開始されていました。これまで`dms-shell`としてインストールしていたものは`dux-shell`に変更となるでしょうし、Fedoraであれば`sudo dnf install dms`が`sudo dnf install dux`に変わるのだろうと予想します。現在の公式ドキュメントではそれらの記載はありません。あくまで現時点での私の想像です。
> もしかすると以前のままで使用できるのかも知れませんが紛らわしいのでそれはないだろうと。

2026/10/25に`dms-shell`が配信されていました。(旧DMSをインストール済みの場合は)システムアップデートで入るようになっています。
例えばHyprlandを使用している状態で行っても自動更新ではないので、一旦ログアウトして再ログインした時にv2.0+に更新されます。

だいたい起動した時の状態、バックグラウンドでいくつかのデーモンなどが起動はしている状態ですが、しばらくデスクトップの表示のまま起動させて、そのアイドリングの状態でメモリ使用量を見ると<u>1.2GB</u>程度でした。
もっと軽量なディストリビューションはあると思いますし、最近のPlasmaやGNOMEもこんなぐらいなので特別少ないこともなく((Plasmaのシステム上から導入しているので当然と言えば当然で、それでも使用量にほぼ増加がないことからDux shell自体は動作がかなり軽量であると言えます))、多くの機能が改善されたりしたけれどもめちゃくちゃメモリを消費するわけでもありません。
Windowsからみたら圧倒的に少ないメモリ消費量なので、同じメモリを搭載しているPCであれば3GBぐらいは、より使用できると考えられます。

設定は`~/.config/hypr/hyprland.lua`を編集してもできますが、`SUPER + ,`あるいは画面右上の「Wi-Fi・音量アイコン」あたりをクリックすると簡易設定(コントロールセンター)が出るので、そこから<u>ギアのアイコン</u>をクリックしても表示できる<u>設定(GUI)</u>を開いて、色々と設定していきます。ほとんどが設定(GUI)画面からできるようになっています。

<div class="grid grid-cols-1 py-4 md:grid-cols-2 auto-rows-auto">

![control_panel-dux](../img/control_panel-dux.avif)
{class="block"}

![control-center-dark](../img/control-center-dark.avif)
{class="block !mt-0"}

</div>

上記<span class="f-img" data-target="../img/control_panel-dux.avif">最初の画像</span>が私が実際に使用しているもののスクリーンショットで、<span class="f-img" data-target="../img/control-center-dark.avif">後の方</span>が公式にあった同じものです。同じものでも設定次第でこれぐらい変わると言う例でもあり、<u>私の方はほとんど触っていません</u>。
おそらく後者は、コントロールセンターを編集する項目がどこかにあって、それらの画面だろうと思います(どこにあるのかは調べてないのでわかりませんが、システムとかウィジェットとかそれら関連項目だろうと想像します)。

設定(GUI)画面が開いて最初にするのは、左側メニュー項目の真ん中ちょっと下にある**Input**部分でしょうか。その中にKeyboard<span class="f-img" data-target="../img/keyboard-dux.avif">Keyboard</span>の項目があるのでsetupから、layout部分に<u>jp</u>と入力します。

![keyboard-dux](../img/keyboard-dux.avif)

同様にして、`Mouse&touchpad`でほとんどいじる所はありませんが、**Focus follows mouse**はチェックしておくと、マウスカーソルがあるウィンドウにフォーカスが移るので操作しやすくなると思います。
通常のディストリビューションやWindowsなどではウィンドウをクリックしてアクティブにさせるみたいなことが、<u>マウスカーソルがウィンドウに乗ってさえいればアクティブになる</u>ということです。
スタックしないので((通常ウィンドウはウィンドウが重ならない。フロートする設定のウィンドウは重なる))、マウスが乗るあるいは`SUPER + 矢印`でウィンドウを移動すればアクティブになります。

また`touchpad`では、Natural scroll にデフォルトでチェックが入っていたと思いますが、ノートPCでタッチパッドのスクロールがなんか反対だなと違和感を覚えたらここのチェックを外してみてください。

これらは好みもあるのでこうするべきという答えはありません。色々といじって最適な設定を探していくというので良いと思います。

#### Wallpaper&color 外観の色を決定する壁紙

![wallpaper&color-dux](../img/wallpaper_color-dux.avif)

もちろん、<span class="f-img" data-target="../img/wallpaper_color-dux.avif">壁紙</span>を設定しなくても色は設定できるのですが、<u>壁紙の構成色から色を抽出する機能</u>があるので、デスクトップの一体感的な色使いとなることからこれは使ってみると良いと思います。
だいたい壁紙から色が抽出されると言うこと以外は、どこにでもある壁紙の設定です。まだ項目が英語で書かれている部分が多いですがおおよそ分かると思います。

ここでは、アイコンテーマも設定できるようになっています。
アイコンテーマは[gnome-look.org](https://www.gnome-look.org/browse?cat=132&ord=latest)や、名称がわかっていればGithubなどから入手できます。その際に自身が使用するディストリビューション用のファイルをダウンロードしてください。
更に公式のパッケージマネージャーからダウンロードできるものはこれらを使用すると導入削除がとても簡単なので最も良いですが、自分が必要としているアイコンテーマが公式で配布されているとは限りませんので注意が必要です。

例えば[kora](https://www.gnome-look.org/p/1256209)であれば、Productタブを開くとFilesタブに入っているファイルの説明が書いてあります。Filesタブから`kora-2-0-5.tar.gz`をダウンロードして解凍する必要があります。
解凍はディストリビューションに入っているアプリなどを使用して解凍もできますが、ダウンロードフォルダで右クリックしてターミナルを起動して

```bash
tar -xvf kora-2-0-5.tar.gz
```

とすると解凍されたフォルダが出現します。

- 自分(現在のユーザー)だけで使用する場合は、`~/.local/share/icons/`(または`~/.icons/`)
   - `~/.local/share/`の中に`icons/`フォルダがない場合は作成します。
- システム全体(全ユーザー)で共有する場合は、`/usr/share/icons/`

いずれかの`icons/`にkoraの解凍されたフォルダごとコピー(移動)します。システム全体で使う場合は管理者権限が必要です。

- ユーザーファイルの場合
   - ユーザーファイルの領域なのでWindows等と同じように`~/.local/share/`まで進んで`icons/`がないなら右クリックから作成できます。ターミナルからやるのであれば`mkdir -p ~/.local/share/icons/`でできます。
   - ファイルマネージャーで`~/.local/share/icons/`までと、ダウンロードフォルダをタブで開いておけば簡単にコピーでも移動でもできます。面倒な人は、
      ```bash
      mkdir -p ~/.local/share/icons/ && tar -xvf kora-2-0-5.tar.gz -C ~/.local/share/icons/
      ```
      でフォルダを作って、解凍してから移動までが1ライナーでも可能です。
- システムで適用する場合
   - `sudo tar -xvf kora-2-0-5.tar.gz -C /usr/share/icons/`で解凍してコピーまでできます。
   - こちらはほぼ100%`icons/`ディレクトリはありますので上記で行けると思います。

移動させた後は、各種設定ツールなどにそれらが出現しますので選択するだけです。

#### Fonts&Motion

![font&motion-dux](../img/font_motion-dux.avif)

<span class="f-img" data-target="../img/font_motion-dux.avif">フォントの設定</span>もここでできるようになっています。
CachyOSではNotoシリーズのフォントが入っているので新たに何も導入しなくても日本語表示は問題ないですが、フォント一つで見栄えはかなり変わるのでかなり重要な項目であると言えばそうです。
個人的にはメインフォントには、BIZ UDPゴシック、等幅フォントにはBizin Gothic NFを使用しています。これも各々に好みがあるでしょうから好きなものを導入すればよいかと思います。

フォントの導入はログイン画面でPlasmaやGNOME環境を選択してログインし、それらのGUIで導入するのが良いかと思います。Plasmaは設定でフォントをインストールする項目がありますし、GNOMEはフォントをインストールするアプリが最初から入っていたと思います。

CachyOS Plasma環境なら[CachyOSのPlasma環境の設定はどうなってるんだろうか](/blog/cachyos-plasma-settings/)から「フォントの設定→自身でフォントを導入する場合」でも触れています。フォントの導入は隠し要素ではありませんが内容のついでに記載しています。
これらは自身でターミナルからできても面倒くさいので、GUIでやったらいいんじゃない？という内容です。

このFonts&Motionでは、v1.6+から導入されたバネ的なアニメーションの動作設定ができるようになっています。
Hyprlandでは感じにくい部分かもしれませんが、NiriであったりMangoWMなどではより強く感じることができるかも知れません。

だいたいの設定項目にはデフォルトから変更されると🔄とは違いますが、こういうアイコンが表示されてクリックすることでデフォルトに戻せるようになっています。

#### 電源とバッテリー管理 Power&battery

ここの項目もLinuxだけではなくWindowsでもよくあるような項目なので特に難しい部分はないと思います。

この項目の中に`PowerMenu`というのがあります。通常は画面右上の簡易設定パネルで操作したり、あるいは`SUPER + X`でそれらメニューを表示します。表示スタイルでグリッドに並べて表示することもできます。

![power&battery](../img/power_sleep.avif)

しかしここで一番設定を考えたいのは、<span class="f-img" data-target="../img/power_sleep.avif">Pwer&Menu</span>の下にある`Confirmation`で<u>Hold to confirm</u>です。これらは例えばログアウトする際、その項目を設定秒間押しっぱなしにすると実行されるようになっています。
誤操作を防ぐためなんだろうと思いますが、すぐに慣れるのでホールドするのが面倒くさく感じるようにもなります。私はチェックを外しておいてもよいのではないかと思います。

#### 日付と時間と地域 Date,time&region

トップバーなどに表示される<span class="f-img" data-target="../img/time_weather-dux.avif">時間などの形式</span>を設定します。ここでも英語と日本語ではその表示の仕方が異なるのでそれらを日本語に馴染みある形式に直します。

![Time&Weather-dux](../img/time_weather-dux.avif)

Format部分に、

```bar
M/dd(ddd)
```

とすると、`10/25(日)`のような形式になります。これらは下にそのアルファベットがどういう働きをするかの例があるのでそれらを参考にお好みに変更してください。

「天気」では、`Location search`に自身の住んでいる所などを入力すると、その場所の天気・気温などがトップバーあるいは、トップバーのセンターをクックすることで表示されるコントロールパネルなどにも表示されるようになります。

### 主な変更点と新機能

#### 新しいデザイン（Material 3 Expressive）

- 設定画面(Settings)、コントロールセンター、Dash、共有ウィジェットなどがMaterial 3 Expressiveデザインにアップデートされました。
- 設定画面が整理され、バーのウィジェットオプションやDash専用ページが独立するなど関連する設定にアクセスしやすくなっています。

![settings](../img/settings-dark.avif)

#### Dashプラグイン

- Dashが内蔵タブ以外にも拡張可能になりました。新しいタブや概要カードを追加できるようになります。
- 概要、メディアプレーヤー、天気、壁紙などの内蔵ページも再設計され、新デフォルトメディアプレーヤーの名称は<u>Bento</u>になりました。

![dash plugin](../img/dash-dark.avif)

#### カスタマイズ可能なロック画面

- ロック画面がウィジェットベースになり、時計、日付、通知、ステータス、電源コントロールの配置、サイズ変更、スタイル調整が自由に行えるようになりました。
- 設定 > セキュリティ > ロック画面 から専用エディターでプレビューしながら編集できます

#### Dux LyricalEngine（同期歌詞機能）

- メディアプレーヤーにワード単位・音節単位での高度な同期歌詞機能が追加されました。
- 複数の歌詞プロバイダー（Better Lyrics、Unison、LyricsPlus、KuGou、LRCLIB、YouTube Music、ローカル歌詞）に対応しており、設定 > サウンドとメディア > メディアプレーヤーから優先順位を設定できます。


#### Dux Files（新しいファイルマネージャー）

- バージョン2.0に合わせて、Dux Labsによる新しいスタンドアローンファイルマネージャー<u>Dux Files</u>が登場しました。
- 軽量なGo言語のバックエンドとQuickshellのフロントエンドで構成されており、Duxなしでも単体で動作します（Duxと併用した場合はテーマも統一されます）。
- 主な機能
   - タブ表示および左右分割ビュー（D&D対応）
   - リスト、グリッド、カラムビュー（フォルダごとに表示・ソート状態を記憶）
   - スペースキーによるプレビュー：選択したファイルのプレビューや詳細を表示
   - アーカイブ対応：追加ツール無しで zip、tar、7z、rarの解凍や、zip/tar への圧縮が可能
   - 昇格（管理者権限でのやり直し）機能付きのファイル操作、高度な検索機能など

![Dux Files](../img/dfiles.avif)

#### コンポジット（ウィンドウマネージャー）のサポート強化

- 従来のHyprland、MangoWCに加え、新たに[Aqueous](https://github.com/Seafoam-Labs/Aqueous)のサポートが追加されました
  - [公式Wiki](https://www.seafoam-labs.org/aqueous/overview/) 


### 新規インストールスクリプト、アップデート、従来のコマンドについて

基本的には従来通り新しい dms-shell が配布されたらアップデートされるはずですが、新規インストールスクリプトはプロジェクトの変更に伴い変更されています。

```bash
curl -fsSL https://install.duxlabs.dev | sh
```

`dms`コマンドは変更されておらずそのまま使用できるとのことです。

Arch Linux系統のディストリビューション, Fedora系統のディストリビューション, Ubuntu, Debian, PikaOS, openSUSE, Gentooなどがサポートされています。

各公式リポジトリでのパッケージインストールは[duxドキュメント - Installation](https://duxlabs.dev/docs/dms/installation)を参考してください。
パッケージでインストールしても結局セットアップを行わないといけないので上記インストールスクリプトで入れれば良いのではないかと思います。
アップデートは各パッケージマネージャからシステムを更新すればできます。

セットアップでどういう項目の選択があるかは、[duxドキュメント - What Gets Installed](https://duxlabs.dev/docs/duxinstall#what-gets-installed)にあります。

1. コンポジターの選択
2. ターミナルの選択

をするぐらいかと。

コンポジターの選択では、[Hyprland](https://hypr.land/)や[Niri](https://github.com/niri-wm/niri)、[MangoWM](https://mangowm.github.io/)などどれを入れるか迷ったらHyprlandで良いんじゃなかろうかと思います。
ターミナルの選択では、[Ghostty](https://ghostty.org/)、[Kitty](https://sw.kovidgoyal.net/kitty/)、[Alacritty](https://alacritty.org/) などが選択できますが、Ghosttyでいいと思います。

Dux(旧DMS)はまだディストリビューションではないので、PlasmaかGNOMEあたりを最初に入れておいてその環境に導入する形となります。私は現在、[CachyOS](https://cachyos.org/)のPlasmaでDuxを入れています。CachyOSの部分がディストリビューションでPlasmaやGNOMEの部分がデスクトップ環境となります。

最初に何を入れるかは本当に好みによる部分も大きいわけですが、分かる人や慣れてる人はArch系、全くの初心者は[Fedora Workstation(GNOME)](https://fedoraproject.org/ja/workstation/)か[Fedora KDE Plasma Desktop](https://fedoraproject.org/ja/kde/)あたりから始めると良いと思います。
これらFedoraはそのデスクトップ環境専用になっていますので導入が簡単です。

一方CachyOSなどはインストールの際にデスクトップ環境を選ぶ必要があります。複数のデスクトップ環境を入れて切り替えて使用することも可能ですが、デスクトップ環境はだいたい入っているアプリが違うだけとかで基本的な部分は同じようなものなので複数入れるのは無駄になりかねません。できるだけシンプルに保つのが良いです。

## まとめ

以前書いていたMangoWMの新しい記述には対応されていました。

> 11/11追記 ──
> v2.1でこれら10/25の段階で出ていた問題点が修正されました。ただし一部WARNが出ています。

~~また、v1.6+の段階で日本語入力に不備があるという旨を現在報告中です([PR #3817](https://github.com/duxlabs-dev/dux-shell/issues/3817))。
これらがどうなっているのかは実際に`dms-shell`が配布されて、試してみてからでしかわかりません。~~ もちろんインストールスクリプトを使用したら新しくはなると思いますが配布されたものでどうなるかを試したいので。

実際、パッチを当てて直すというよりは、DMS(現Dux)はマルチランゲージ対応でもあるので、それなら一からキー入力周りを刷新してほしいとすら思っていました。
しかし、メジャーバージョンアップなので、そのあたりにも手が加わっている可能性は捨てきれません。実際には試してみないとわからないのですが、問題を残したままメジャーバージョンアップされている可能性もあります。

v1.5+～1.6+の間は操作に問題が頻発することもありましたが、v2.0+では今の所、正常動作をしているように見れます。それらを確認するため現在スリープ運用で20時間程度経過中です。
このまましばらく継続してみて問題がでないかを経過観察中です。直ったと思ったら再発することもあるので大手を振ってオススメできる段階かと言えばそこまでには至ってないと思いますが、ほぼ問題なかろうと想像はしています。

### fixされたというコメントがありました

> 10/29追記 ──
> Dux(旧DMS)チームからコメントがありました。
> *Fixed by [4f0e2c6](https://github.com/duxlabs-dev/dux-shell/commit/4f0e2c6fd4b4e186e786a4d482ce0cd9762838c2) (fix(workspaces): resolve slot list binding regression). Reopen if it still happens on the latest release.* [PR #3817-comment](https://github.com/duxlabs-dev/dux-shell/issues/3817#issuecomment-6483069695)
> *コミット [4f0e2c6](https://github.com/duxlabs-dev/dux-shell/commit/4f0e2c6fd4b4e186e786a4d482ce0cd9762838c2) (ワークスペースのスロットリストのバインディング回帰バグの修正) にてこの問題を修正しました。最新リリースでまだ発生する場合は再オープンしてください。*

比較的早めにパッケージの配布はあるかと思いますが、他の修正等をまとめてから新しいパッケージがリリースされると思うので、今日明日のリリースになるというわけではありません。パッケージが配布されたらまたレポートしたいと思います。

#### Dux shellのメニューからソフトウェアアップデート

![System&software_update](../img/system_software_update-dux.avif)

パッケージが配布されてから試そうと思いましたが、時々キーが反応しない場合が頻発している中で待っていられないなと思ったので、Dux shellのメニューにあるシステムからアップデートを試してみました。
通常Linuxのパッケージはブラウザなどもそうですが、たとえソフト的にアップデート機能が搭載されていても、更新パッケージをパッケージマネジャーからの適用によってバージョンアップさせていくというのが定番の作法です。
そのプログラムが必要としている依存関係の不整合などが、ローカルとリモートで起こったりなどがあるため、このパッケージにはこのライブラリが必要などと正しく設定されたものを導入するのが本来の姿です。

Dux shellはドットファイルなので、システムと、ユーザーが導入後カスタマイズしたり設定したデータは分離されており、Hyprlandなどのコンポジターも分離されています。なのでシェル上からのアップデートはあまり通常のソフトなどの状況から考えると影響が出ないとも思います。
特にCachyOSなどArch系やFedora等であれば配布パッケージのリリースサイクルも早くそれらを追えると思いますが、QuickshellやQT/QML、Go言語等の環境、Waylandの更新やHyprlandもそうでしょうが、アップデートが頻繁にあるのでUbuntu等では対応しきれない場合があるため、それらディストリビューションを使用している人たちのためにシェル上からアップデートできる機能なのかなぁとも思っています。

なんにせよ、Dux(シェル上)からのアップデートを現時点(2026/11/1)で試した所で、昨日だったかに更新されたばかりのHyprlandの更新には対応されていませんでした。
手動でhyprland.luaの設定(最大値が4になったかが設定では5になっている等)を一部修正する必要がありました。これらは配布パッケージがリリースされた時には対応されているのかも知れません。

まだシステムアップデートをシェル上からしてみて時間があまり経っていないので、正確なことはわかりませんし問題は特に見当たりませんが、もうしばらく注視する必要はありそうです。

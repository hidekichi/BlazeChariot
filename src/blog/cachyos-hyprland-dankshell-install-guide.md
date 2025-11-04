---
title: 追加検証！CachyOSのHyprland環境にDANK Shellをぶち込んでいきなり使い勝手を良くする
description: 前回、CachyOS Cosmic環境をインストールする際に色々確かめるためにHyprlandも入れていました。ただそれだけでは基本部分だけで便利ではなかったので便利にするためにDANK Shellを入れてしまおうと言う内容です
date: 2025-11-02T07:23:01.608Z
update: 2025-11-01T08:37:16.581Z
category:
    - blog
tags:
    - Arch系
    - CachyOS
    - Hyprland
    - linux
    - DankShell
images:
    - ../img/cachyos_desktop.avif
    - ../img/cachyos_dgop_terminal.avif
    - ../img/cachyos_localsend_thunar.avif
    - ../img/cachyos-dankshell_dankdash.avif
    - ../img/cachyos-dankshell_system-monitor.avif
    - ../img/cachyos-dankshell_settings.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## CachyOSのHyprland環境について

CachyOSのHyprlandは特別便利なわけではなく、基本的なウィンドウ操作などが設定されているだけで、後は**自身でなんとかする必要がありました**。
しかし、Hyprlandを設定するだけで便利になるのではなく各種ツールとその設定をして初めて便利になるわけで、それらをどうするかというのがとても高い壁です。

海外では、自身のカスタマイズした設定を公開・配布してそれらをそれぞれが適用してLinuxを飾るというRice(あるいはRiceng)という文化があり、それらは単にカスタマイズしただけというものもありますが、高度に設定されたものもたくさんあります。
そのひとつがDankMaterialShellです。

### DankShellについて

![CachyOS-DankShell hypeland desktop](../img/cachyos_desktop.avif)

[DankMaterialShell](https://danklinux.com/)は、quickshell と Go言語で作られています。Go言語と聞くと以前紹介した[ArchRiot](https://archriot.org/)を思い出します。自動で必要なものが全て導入できるという意味ではとても似ています。quickshellはend-4の[illogical-impulse](https://ii.clsty.link/en/)で私は初めて触れました。他にも同じような構成のものはたくさんありますが、日本語のローカライズと完成度、導入の簡単さと設定の細かさなどを考えると、最新鋭かつ最も優れたHyprland環境の一つであるだろうと思われるのがDankMaterialShellです。

全て導入・設定済みと言うと[Omarchy](https://omarchy.org/)を思い出しますが、導入されるものが多すぎてそこまではいらない、必要なものは後で自分で入れるという意味からするとOmarchyはやりすぎな感じもあり、色々加味して考えてもDankMaterialShellはその手の業界のトップレベルにあると思われます。

例えば、日本語のローカライズはできているものとできていないRice環境もあり、パッと見た感じ特別おかしな日本語もなく読めばほとんど分かる日本語訳がされています。これは文字数などがレイアウトの関係で限られているUIの環境でそこに合うように訳せるというだけでも素晴らしいとも言えます。
それらが設定できるそれぞれの項目にかなり細かく用意されていて、一部まだ英語の部分もありますがそれはごく{僅|わず}かで、ほぼ日本語で設定はできます。ただこの設定というのは、**用意されているDankShell部分の設定だけでHyprlandの設定は一部別で行わないといけません**(例えば日本語キーボードにするとか、fcitx5を読み込ませる等)。

一部のRice環境では、パッケージの問題などで独自パッケージを展開する[Manjaro](https://manjaro.org/)や[CachyOS](https://cachyos.org/)よりも素のArchLinuxあるいはそれに近い[EndeavourOS](https://endeavouros.com/)に適用するように求めるものもあります。しかしDankMaterialShellは、**Arch, ArchARM, Archcraft, CachyOS, EndeavourOS, Manjaro**をサポートしています。
更に、Arch系だけではなく[Fedora](https://www.fedoraproject.org/ja/)、[Ubuntu](https://jp.ubuntu.com/)、[Debian](https://www.debian.org/)、[openSUSE Tumbleweed](https://get.opensuse.org/tumbleweed/?type=desktop)もサポートしているようです。

### 機能

- ランチャー
  - アプリ、ファイル検索、ウェブ検索、絵文字検索、計算機、拡張機能プラグイン
- システムトレイ
- 通知とグルーピングサポート
  - グルーピングとは似た通知を1つにまとめてくれる機能です
- ネットワーク管理
- VPN管理
- ブルートゥース
- オーディオ管理
  - Pipewireです
- 電源管理
- ロックスクリーン
- プロセスとシステムモニタリング
- テーマ管理
  - ライト&ダーク、自動カラー、壁紙からアクセントカラー抽出とカスタマイズ
- マルチモニター管理
- ガンマコントロール
  - ナイトモードと色温度カスタマイズ
- 壁紙管理とアニメーション
  - 別モニターの壁紙やウィンドウのアニメーションの種類や速度も調整できます
- クリップボード履歴管理
- システムサウンド
  - 通知やボリューム調整、変更など
- Mprisメディアコントロール
  - シェル側からオーディオなどを操作できたり、視覚効果など
- プラグイン
  - 想像できるほぼ全ての機能を可能にするためのウィジェットやプラグインが利用可能

![CachyOS-DankShell Dgop Terminal](../img/cachyos_dgop_terminal.avif)

画像はプロセスとシステムモニタリングするdgopが動作している所にターミナル(Ghostty)を開いた所です。これ以外にもどんなプロセスが動作しているか、メモリの使用量、あるいはCPUの負荷などを表示するものもあります。トップバー中央の日付の所がそれらにすぐにアクセスできます。

このトップバーセンターのパネル(DANK DASH)には天気の表示もでき、日本の各市町村の名称((どこまで細かくかは不明だけどもかなり狭い範囲も行けそう日本なら各市までは行けると思います))の天気情報を設定でき、それを時計の右側に表示して置けますし、パネル内でも見ることができます。もちろん時計のフォーマットや並びをいくつかの候補からも選べますし、サンプルを参考にカスタマイズすることもできます。

<div class="grid grid-cols-1 md:grid-cols-2 auto-rows-auto">

![CachyOS DankShell DankDash](../img/cachyos-dankshell_dankdash.avif)
{class="block"}

![CachyOS TopBar SystemMonitor](../img/cachyos-dankshell_system-monitor.avif)
{class="block !mt-0"}

</div>

左側((スマホなどの幅が狭い画面では最初の))画像左下のグラフがおおよそのCPU仕様率、温度、メモリ使用率かと。この他にトップバー右側にはシステムモニターがあって、ここからはもっと詳細に見ることができます。

右側でメモリが1.9GBと表示されていますが、裏で色々と動作さているのでこれぐらいになっています。だいたい1.2～1.5GB前後かと思います。Windows11が4GBは超えてくると思うので、どれだけ軽量であるかがわかると思います。

DankShellは、プラグインで機能を拡張できます。それらもターミナルで導入するのではなくDankShellの設定画面から導入・設定ができるので難しく考える必要はありません。予めプラグインを入れるディレクトリを制作する必要がありますが、それもDankShell上から行えます。


### アーキテクチャ

Wikiには、次のような記載があります。

> DankMaterialShell uses a client-server architecture where a Go backend (dms) manages system integrations and spawns the Quickshell-based UI as a child process. Communication happens over Unix sockets using REQ/REP and PUB/SUB patterns.

REQ/REP と PUB/SUB は、ZeroMQ(ØMQ) というメッセージングライブラリが提供する2つの通信パターンです。
DankMaterialShellでは、これらをUnixソケット(同じマシン内の高速通信路)で使って、Goバックエンド <-> Quickshellを繋いでいます。

REQ/REP と PUB/SUBをなぜ組み合わせるのかは、
- REQ/REPだけ → 命令は確実だけど、リアルタイム通知が遅い
- PUB/SUBだけ → 通知は速いけど、命令の「成功した？」がわからない

そのため、2つを併用することでより完璧にしているわけです。命令はREQ/REP、通知はPUB/SUBなど。つまりごく簡単に言うと**必要なものを、必要な瞬間に、超高速で届ける**という考えなわけです。そういう仕組みを実現しています。

`Super + T`((configのキーバインドをこう設定すればですが))でターミナルが開きます。(あくまで体感ですが)これを0.05秒で起動できるといったことであったり、バッテリーの残量が変わった瞬間に表示も変えるとか、キーを押した瞬間になどで即表示するというような反応速度の向上のための技術と言えます。

## DankMaterialShellを導入

導入はとても簡単です。CachyOSにHyprlandを適用してあるとして、ターミナルを起動して次のコマンドを実行します。

```bash
curl -fsSL https://install.danklinux.com | sh
```

後は画面に従うだけなので、特別難しい所は何もありません。途中で各インストールに必要な<u>管理人パスワードを1度だけ求められる</u>のと、`niri`と`Hyprland`を選択する部分があります。ここは**Hyprlandを選択します**。

> niri（ニリ）は、「スクロールで無限に広がるデスクトップ」を実現する超軽量Waylandコンポジターです。Hyprlandより軽量かも知れません。無限横スクロールでとても滑らかに表示されるということです

後は全自動です。待つだけでOKですが、<u>自分は既にCosmic環境である程度のセットアップをしていたので特別やることはないと言うだけで、実際はその後で色々とやらないといけないことはあります</u>。しかし、ただそのままただ待てばよいだけであるというのに変わりはありません。通信環境とPCパワーにもよると思いますがおおよそ、10～15分ぐらいで完成します。

### インストール後にすること

インストールが終わったら、まず**再ログイン**します。これでDankMaterialShellが適用されたデスクトップが表示されるはずです。しかし、このままだと<u>ディスプレイが200%で表示されている状態</u>なので、まず一番最初に**モニター設定**をする必要があります。
`Super + Space`でランチャーを起動させ、何かしらのファイルマネージャーを起動し`~/.config/hypr`を開きます。するとその中に`hyprland.conf`があるのでそれを開きます。開いたらすぐに`MONITOR CONFIG`があるので、

```bash
monitor = eDP-2m 2560x1600@239.998993, 2560x0, 1, vrr, 1
```
とある部分の先頭に`# `と半角で#スペースとして**コメントアウト**しその下に、これが正しいかどうかはわかりませんが、機能するコマンドとして、

```bash
momitor = , preferred, auto 1
```

と追記します。これで`Ctrl + S`で保存すれば、すぐにディスプレイの解像度が戻るはずです。

次に、`INPUT CONFIG`というセクションが下の方にあるはずなので、そこの、

```bash
input {
    kb_layout = en
}
```
とある部分を`en`から`jp`に変更して下さい。まず**ここまでが絶対しないといけない設定**です。

この`INPUT CONFIG`のセクションの上に`START UP APPS`と言うセクションがあります。他のIMEは知りませんが、fcitx5を導入・設定していた場合、このセクションの最後に、

```bash
exec-once = fcitx5
```
と追記します。これで次回起動時にfcitxが有効になるのでfcitx5-config等で設定した入力モードの切り替えで日本語が入力できるようになります。同時にトップバーの右側・左隅にfcitx5-mozcのアイコンがでているはずです。

> `~/`は、ユーザーディレクトリの `/home/ユーザー名`を省略しています。書くのに省略しているというのもありますが、このままでも実際に適用される公式なものです。`$HOME/`や `$XDG_CONFIG_HOME`などもあります。
> `$XDG_CONFIG_HOME`は`~/.config`と同じことです。ユーザー名はそれぞれ異なりますが、`$XDG_CONFIG_HOME`であればそのシステムの`/.config`ディレクトリを選択することができます。

<details>
<summary>fcitx5の導入方法</summary>
<div>

ターミナルから、
```bash
sudo pacman -S fcitx5-im fcitx5-mozc
```
として導入します。デフォルトは、選択肢の全部がインストールされるので、たいていはこのままで大丈夫だろうと思います。ランチャーから`fcitx5-configtool`を起動させて、Mozcと日本語キーボードを設定し、入力モードの切り替えをどのキーでするのか、かな入力、ローマ字入力のいずれを使用するのかなどを設定します。
詳細は別のサイトか何かしらで調べてみて下さい。GUIの設定で全部できます。

</div>
</details>

![CachyOS-DankShell localsend Thunar](../img/cachyos_localsend_thunar.avif)

画像は、LocalSendを起動させ、ファイルマネージャのThunarを起動させたものです。このように、各ウィンドウが半透明になったりしています。アクセントカラーは独自に選択もできますし、前述したかも知れませんが壁紙の色から抽出したり、カスタマイズして色を選択することもできます。

Cosmicデスクトップでは、選択しているウィンドウにボーダーが入っていました。これはHyprlandの設定できます。そのボーダーの色などは、アクセントカラーと同様に壁紙から色を抽出してに合わせることも指定することもできます。


### アプリを起動するキーバインドを設定する

DankShellの設定からドックを設定すれば、場所は色々選べますがデフォルトでは画面下部中央に表示されて、よく使うアプリを登録しておけばアプリは素早く起動させられますが、いくつかキーバインドを付け加えるといちいちドックやランチャーから起動しなくても良くなるので便利です。

例えば、`~/.config/hypr/hyprland.conf`のどこでも良いと思いますが、`START UP APPS`セクションの最後に変更した所をわかるようにして、

```bash
bind = $mod, B, exec, firefox
```

と書くと、`Super + B`でFirefoxが起動するようになります。

他に使用されているキーが重複しているとそれらがほぼ同時に展開されるので、なるべく重複しないようにするか、**重複しているキーが`A`キーだとすると**、

```bash
unbind = $mod, A
bind = $mod, A, exec, thunar
```
このように、まず重複しているキー`A`のバインドを解除して、新たに`Ctrl + A`でthunarを起動するようにできます。
これは<u>`A`キーが重複していたらの場合で書きました</u>が、こうできるというだけです。Thunarはファイルマネージャーなので`F`キーが空いていたら一番良いのですが、<u>フルスクリーン表示が`F`キーに当てられている</u>ので個人的には`E`に設定しています。 

### スクリーンショットを撮るには

<div class="w-auto md:float-right md:w-1/3">
<a href="../img/cachyos-dankshell_settings.avif" target="_blank">

![CachyOS 設定](../img/cachyos-dankshell_settings.avif){class="object-contain"}

</a>
</div>

いくつか方法があるようですが、まず設定画面のプラグインで、3rdPartyのプラグイン[Grimblast](https://plugins.danklinux.com/grimblast.html)を導入します。これは**設定画面上ですべて完了できます**。

1. `プラグインタブ → ブラウズ` で該当のプラグインを探す
2. `インストール`で導入するとすぐ下にリストアップされるのでタイトル横の`∨`((上下に切り替わる三角の記号))でオプション表示
3. プラグインのオプションからスクリーンショットの保存場所を`~/画像`に変更。`~/画像/screenshot`なども任意の場所可能
4. もちろん、プラグインタイトル右側の**スイッチもON**にしておく

これらを設定して、トップバーの右側にスクリーンショットのアイコン表示もできるように設定するには、

1. `Dank Bar → 右セクション`の下にある`ウィジェットを追加`から`Grimblast`を追加する
2. 表示位置は、セクションの一番上が**左**になるのでタイトル左側にある`︙︙`をつかんで移動させます(場所は別に移動させなくても好き好きでOK)

これでトップバーのアイコンからスクリーンショットが可能になります。

しかしこれだけではパネルのように何か別のものをクリックしたりで選択すると閉じてしまうようなウィンドウがスクリーンショットできないため、トップバーのスクリーンショット機能ではできないことがあるため、ダイレクトにスクリーンショットが動作するように**キーバインドの設定を変更します**。

`~/.config/hypr/hyprland.conf`の下の方にスクリーンショットのセクションがあります。どのように設定するかは色々考えられますが、

- `Print`キーだけで画面全体、
- `Ctrl + Print`キーでエリア

をスクリーンショットできるようにしたいとする場合、

```bash
bind = , Print, exec, grimblast copy area
bind = CTRL, Print, exec, grimblast copy screen
```
となっている部分の先頭に`# `と入れて、コメントアウトして

```bash
# bind = , Print, exec, grimblast copy area
# bind = CTRL, Print, exec, grimblast copy screen
bind = , Print, exec, grimblast save screen
bind = CTRL, Print, exec, grimblast save area
```

と書き換えます。

こうすることで`Print`キーで画面全体のスクリーンショットが**プラグインで設定したディレクトリに保存**されます。`CTRL + Print`キーで任意のエリアを選択できるような画面になって任意の箇所をスクリーンショットできるようになります。
これもコメントアウトではなく、`unbind`しても良いと思いますが、何をどうするかあるいは何をどうしたかをわかりやすいと思う方法で書くのが良いかと思います。

## まとめ と 動画

他にも色々とできる事がありますが、機能が多彩なので全部を紹介するのは大変ということから主な所を書いてみました。
CachyOSのデフォルトのHyprland環境からすると劇的に普段遣いできるレベルまで機能向上ができ、かつインストールも簡単で、インストール後にやることもたいして多くないDankMaterialShellは素晴らしいと思います。

CachyOSを1からインストールするやり方を解説しているサイトは他にたくさんあるでしょうからそれらを参考に導入してもらって、Hyprlandを入れたけどもどうやって使えば良いんだろうと困った方はこれを期に再度このDankShellと合わせて使用してみてはどうでしょうか？

動画もまだ多くはないですが、機能説明などをしている動画がいくつかあったのでその中から2つを貼っておきました。まずはどういうものかを見てから試しても良いですし、記事の最初に公式サイトにリンクしているのもあるので、英語ではありますがどういうものかは画像などからわかると思うので確認してみても良いと思います。

<div class="ytgrid grid grid-cols-1 md:grid-cols-2 auto-rows-auto">

{ytp::https://youtu.be/EuMAyiDAgbw::DankMaterialShell Hyprland Quickshell Config is Cool and clean and Has a Dock}
{ytp::https://youtu.be/iqYiCpDY54E::THIS IS NEW ARCH LINUX HYPRLAND SETUP (Ft. DANK Material Shell)}

</div>
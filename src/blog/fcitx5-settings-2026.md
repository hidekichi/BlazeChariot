---
title: fcitx5の公式から見る2026年の設定事情
description: X11からWaylandへの過渡期ということもあり、設定が色々ややこしくなってきているようです
date: 2026-02-05
update: 2026-02-12
category:
  - blog
tags:
  - Arch系
  - 日本語入力
  - Linux
images:
  - ../img/etc_xdg_autostart_fcitx5.avif
  - ../img/input_panel_flatpak_extension_manager_1.avif
  - ../img/input_panel_flatpak_extension_manager_2.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

> この記事の内容について
> なるべく古いアプリなども考慮に入れた設定も提示したいですが(書くのも検証するのも)、**面倒だと言うのもあり**、きっと古いアプリにあわせた設定を書かずとも、<u>他で新しく同等以上の機能を持ったアプリが出てるだろう</u>と思うので((なかったらAIにでも聞いて下さい))、それを使用したらいいやんと、2026年2月現在のfcitx5公式wikiの内容に沿って記事を書いた次第です

## Fcitx5

fcitx5は、Linuxで日本語を入力するためのもの、つまりはインプットメソッドフレームワークです。フレームワークなので、エンジンである`fcitx5-mozc`をインストールすることで、Google日本語入力のオープンソース版を利用可能になります。
従来のfcitx4から設計が刷新され、Wayland環境に標準対応しています。

### GTKとQT

`fcitx5-im`グループをインストールすることで、`fcitx5`、`fcitx5-gtk`、`fcitx5-qt`、`fcitx5-configtool`などがインストールできます。<u>基本的には全てインストールしておけば良い</u>と思います。
GTK/QT環境に特化したいとか、最小構成にしたい時にはそれぞれ個別に必要なものをインストールすればよいかと思います。


インストールできるエンジンは、Mozc以外にも種類があり、fcitx5-skk、fcitx5-kkc、fcitx5-anthyなどがありますが、WindowsやMacと同じような感覚で入力するのであれば基本的には<u>Mozc一択</u>です。skkなどでは、独特な入力方式であり習得に時間がかかります。

> GTKとは
> GIMP toolkitの略で元々はGIMPを作るために開発されたライブラリです。C言語で書かれており、Gnomeデスクトップの土台となっています。ライセンスが完全に自由なためオープンソースの世界で広く普及しました。
> 代表的なアプリとしては、Firefox, LibreOffice, GIMP

> QTとは
> 読み方は「キュート」と読みますが、「キューティー」という人も多いと思います。C++で書かれており、KDE Plasmaデスクトップの土台となっています。非常に強力でLinuxだけではなくWindows、Mac、Android、iOS、更にはカーナビなどの組み込み機器まで、同じコードで動かせるマルチプラットフォーム性能が極めて高いのが特徴です。
> 代表的なアプリとしては、VLC, OBS Studio, VirtualBox

GTKとQTの話になったのは、これらは見た目（ボタン、メニュー、ウィンドウなど）を作るためのGUIライブラリではありますが、fcitx5-gtkしか導入していない場合に、VLCで動画を見ようとした時に日本語入力ができなくなることがあるからです。

> GUIライブラリ
> GUIライブラリあるいはツールキットなどと呼ばれ、ボタン、スライダー、チェックボックス、テキストボックスなどの「部品（ウィジェット）」を提供し、それらを配置して画面を作るためのプログラム集です。
> フレームワークとしての側面もあり、単に「見た目の部品」だけでなく、イベント処理（ボタンが押された時の動作）や、今回のような「文字入力の受け渡し（インプットメソッドとの通信）」などの複雑な仕組みも一括して管理しています

WaylandはGTKやQTなどの特定のツールキットに依存しなくても共通のプロトコルで入力をやり取りするという理想があります。しかしWaylandがまだ発展途上でもあり、文字は入力できても表示されない((Windowsでもたまにフォーカスがおかしくなって別の小さなウィンドウが出る事ありますが同様のことが起こったり))といった挙動の乱れが起こることがあるわけです。
モジュール(fcitx5-gtk/qt)を使用すると、各ツールキットがfcitx5と直接通信するため変換中の文字がアプリ内にきれいに収まるようになります。そのため、現在ではまだモジュール(fcitx5-gtk/qt)を使用する必要があるのです。なので最小構成ではなく全部入りで導入する事が、どんなアプリを使うかを気にせずに使えるという理由になります。

**理想は「モジュールなし」** ですが、<u>現実の快適さを取るなら</u> **「モジュールを入れておく」** のが<u>現時点での</u> **ベストプラクティス** です。

Arch Linux系で`pacman`を使用できる場合では、ターミナルから、
```bash
sudo pacman -S fcitx5-im fcitx5-mozc
```
でインストールできるようになります。上記の`GTKとQT`を理解していれば、インストール時に何を選択したら良いかがわかるようになるのではないでしょうか？
仮にPamacや他のディストリビューションでGUIなパッケージ操作ができたとしても、インストール時には選択肢が表示されると思います。それらで迷わないように。

<div class="p-4 my-8 border-solid border-2 border-sky-800">

### fcitx5-imについて{class="!mt-[16px]"}

これはArch Linux固有のパッケージのようで、[Fedora Package](https://packages.fedoraproject.org/search?query=fcitx5)などを念の為検索してみても発見できませんでした。よって<u>Arch Linux以外では面倒ですが</u>個別に必要なものを入れる必要があります。必要なものとしては上記にもありますが、`fcitx5 fcitx5-gtk fcitx5-qt fcitx5-configtool`が必要になります。
また、ubuntuなどでは、`fcitx5-frontend-gtk3`、`fcitx5-frontend-qt5`などと名称が異なっていたりしますので、以下にインストール内容をまとめておきます。

<details>
<summary>各ディストリビューションのfcitx5のインストール方法</summary>
<div>

#### Ubuntu / Debian / Mint 系（apt使用）{class="!mt-[16px]"}
```bash
sudo apt install fcitx5 fcitx5-frontend-gtk3 fcitx5-frontend-qt5 fcitx5-configtool fcitx5-mozc
```

#### Fedora / RHEL / CentOS Stream 系（dnf使用）
```bash
sudo dnf install fcitx5 fcitx5-gtk fcitx5-qt fcitx5-configtool fcitx5-mozc
```

#### openSUSE / Tumbleweed / Leap 系（zypper使用）
```bash
sudo zypper install fcitx5 fcitx5-gtk3 fcitx5-qt5 fcitx5-configtool fcitx5-mozc
```

- これらに合わせて日本語を使うので日本語のフォントも導入するべきです。例えばfonts-noto-cjkとか
  - ただしfonts-noto-cjkは中国語・韓国語など使用しないフォントも入っているのでfonts-noto-jpやotf-ipafontなど推奨
- 古いGTK2アプリを使う可能性があるなら`fcitx5-frontend-gtk2`を追加(Ubuntuなど)
- ディストロごとにパッケージ名が微妙に違う場合があるので、検索して確認してください
  - Ubuntuでは`fcitx5-frontend-gtk3`だが、Fedoraでは`fcitx5-gtk`になるなどがあります

</div>
</details>

<div class="block border-4 rounded-md bg-sky-800/50 text-zinc-50 border-green-400 p-4 mt-[--padding-xl]">

これらはfcitx5-imというグループがArch Linux固有のものであると気づいたため他のディストリビューションではどうかという内容を書いています。

</div>

</div>

IBusなどが使用できる場合、それを使用しても日本語入力は可能ですが、どのディストリビューションでも一貫して同じやり方で設定などができるfcitx5を使用するのが良いのではないかと思います。
以下の記事の中にも書いていますが、IBusと強く統合されているデスクトップ環境の場合に、fcitx5を使用するということは工夫が必要な場合もあります。しかしながらX11からWaylandに移行しつつある現在では、なるべくならWaylandに対応した環境で設定を覚えるのが良いのではないかとこの記事を書いています。

ibus-typerというものが開発中で、IBusをよりモダンなRust言語で書き直そうとする動きや、新しい入力プロトコルへの模索がありますが、fcitx5のシェアを脅かすほどの完成度に至った後継プロジェクトはまだありません。それぐらいfcitx5は2026年2月現在、頭一つ抜けているのです。

## Fcitx5公式ではどう書いてあるのか

公式wiki: [https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland)

2026年の主流では**環境変数を最小限にし、Waylandプロトコルに任せる**という方向に進化しています。

これまでは、
```ini
# skip-copy
# システム全体に適用する場合: /etc/environmentに、
# あるいはユーザーディレクトリの場合: ~/.xprofile等に

XMODIFIERS=@im=fcitx
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
```
このような記述が必要でした。以前のように「とりあえず`/etc/environment`に3行書く」というやり方は、<u>Wayland環境ではむしろ推奨されないケースが増えています</u>。

### text-input プロトコルの活用

Wayland環境では、アプリとIMEの通信に `text-input-v3` などのプロトコルが使われます。これにより、<u>環境変数を設定しなくても日本語が打てるアプリが増えています</u>。

ここから、環境変数を設定せず、アプリが直接Wayland経由で使用できると言うのが理想ですが、まだ完全にwaylandに移行しているわけではないので、不完全なアプリ(古いGTK2や特定のElectronアプリ)のために、補助的な設定が必要になっています。

<div class="table-container">

|変数名|推奨値|理由・注意点|
|-----|-----|-----|
|XMODIFIERS|@im=fcitx|必須。 XWaylandアプリ（X11用のアプリをWaylandで動かす際）に必要。|
|GTK_IM_MODULE|(設定しない)|最新の推奨。 設定するとWaylandネイティブなGtkアプリで位置ずれや点滅の原因になる。<br/>ただし、Gtk2などの古いアプリで打てない場合は個別設定する。|
|QT_IM_MODULE|(設定しない)|最新の推奨。 Qt5/6は自動的にWaylandプロトコル（text-input）を優先するため。|

</div>

上記のように「環境変数を書かない」のが基本になりつつあります。 **設定しなくても動くなら、それが最も安定します**。
Qt6.7以降では、フォールバックを記述して、

```ini
QT_IM_MODULES="wayland;fcitx"
```

このような記述をするのが増えています。<u>Qt6.7以降で導入された環境変数</u>で、Waylandネイティブ入力を優先して、フォールバックとしてfcitx5(やIBus)を指定するもので、公式では上記例のように書かれています。これはセミコロン(`;`)区切りのリストを正しく扱うためです。

Ibusもフォールバックする場合は、

```ini
QT_IM_MODULES="wayland;fcitx;ibus"
```
という事です。

主に非KDEではこのように書いて、<u>KDEでは書かないのがベスト</u>とされています。
また`fcitx5`ではなく`fcitx`である所も注意です。

ここで、クォート(`"`)で囲むか囲まないかの違いがでてきます。例えば、Hyprlandで環境変数を書く場合は、

```bash
env = QT_IM_MODULES,wayland;fcitx
```

このように書きます。この場合は、<u>クォート(`"`)では囲みません</u>。

一方、（`~/.bashrc`, `~/.profile`など）では、

```bash
export QT_IM_MODULES="wayland;fcitx"
```

このように<u>クォート(`"`)が必須になります</u>。bash/zshではセミコロンがコマンド区切りとして解釈されるため、クォートなしだとエラーになります。

システム全体の`/etc/environment`では、

```bash
QT_IM_MODULES=wayland;fcitx
```
のようにクォートを書きません。systemd/pam_envの仕様でクォートは不要です（むしろ剥がされる）。

これらのように**設定場所に応じて使い分ける必要がある** ということです。こういった所がややこしいわけです。

## デスクトップ環境ごとの事情

### GNOME(Wayland)

GnomeはIBusとの統合が非常に強力なため、fcitx5を使用する場合は少し工夫が必要です。

- 環境変数は基本的に不要
- 必須な事項として、`gnome-shell-extension-kimpanel`をインストールすること。これがないと入力候補ウィンドウが変な場所に表示されたり、表示されなかったりします。公式Wikiでは<u>GNOME特有の追加ポイントとして「Fcitx5のIBus frontendが必要」（GNOMEがIBus DBusプロトコルを使っているため）と明記</u>されています
- `/etc/xdg/autostart/`にある`org.fcitx.Fcitx5.desktop`が機能していればOK
  - `org.fcitx.Fcitx5.desktop`はfcitx5をインストールすると自動で作成される
  - 存在していれば基本的には問題ないが、IBusが優先されてfcitx5をブロックし、fcitx5が起動しない場合もあるようです。
    - この場合はGnome TweaksのStartup Applicationsでfcitx5を手動追加
    - あるいは`~/.config/autostart/`に`org.fcitx.Fcitx5.desktop`を`/etc/xdg/autostart/`からコピー

![autostart内のfcitx5.desktop](../img/etc_xdg_autostart_fcitx5.avif)

> Linuxディストリビューションでよく見るXDGとは
> X Desktop Groupの略で、現在はfreedesktop.orgと言う組織が管理しています。GNOME、KDE、XFCE、LXDEなど様々なデスクトップ環境が共通のルールで動作するようにするための仕様（specification）をたくさん作っています。「X」はクロスと言う意味で、「どのデスクトップ環境を使っていても、同じように動くようにしよう」という目的の規格群です。
> このため、Linuxの各ディストリビューションのユーザーディレクトリ等の構造は似通っており、上記の自動起動にしても同じ規格で動作するようになっています。違うものは例えばHyprlandが`exec-once`であったり、KDE PlasmaではXDGに準拠していますが、`~/.config/autostart-scripts/`という独自規格をサポートしています。

#### gnome-shell-extension-kimpanelについて

これのインストールの流れですが、
- Gnomeのアプリ一覧(あるいはアプリ一覧画面で「extension」検索｜`Windows/⌘ キー + A`)から見つかる「拡張機能」アプリを開く
  - これはGnomeの拡張機能自体を、[extensions.gnome.org](https://extensions.gnome.org/)から探し、webから導入。

このようにするのが従来かつ現行の拡張機能の導入方法ですが、拡張機能の導入だけをするのに毎回それだと結構手間でもあるので、

1) Flatpakにある[Extension Manager](https://flathub.org/ja/apps/com.mattjakeman.ExtensionManager)を導入
2) Extension Managerから該当の拡張機能を導入する

という手順の方が今後拡張機能を探すのも何かと便利になります。

<div>

![ExtensionManagerでkimpanelを検索](../img/input_panel_flatpak_extension_manager_1.avif)![ExtensionManagerでkimpanelを導入](../img/input_panel_flatpak_extension_manager_2.avif)
{class="grid grid-cols-1 md:grid-cols-2 auto-rows-auto"}

</div>

上記画像のような感じで導入できるExtension Managerのインストール方法は、

1. Flatpakでインストール(初めて導入する場合、既に導入済みなら不要)
    ```bash
    flatpak install flathub com.mattjakeman.ExtensionManager
    ```
    - Ubuntu/Fedoraなどではgnome-shell-extension-managerパッケージもあるが、Flatpak版の方が最新で安定しやすい
    - 「ソフトウェアの追加と削除」アプリからでも可能。Gnome純正の同アプリでExtension Managerを検索したらインストールはFlatpakになっていますのでGUIで導入できます

2. Extension Managerを起動 → `Browse(検索)タブ`で「**kimpanel**((おそらく KDE Input Method Panelだろうかと))」または「**Input Method Panel**」を検索(上記最初の画像)
3. インストール → 有効化(上記最後の画像)
4. Gnomeのログアウト → ログイン

- Flatpak版Fcitx5を使っている場合、IME自体をFlatpakで入れているとIMモジュールがホストに届かないので、fcitx5はネイティブインストール((パッケージマネージャーあるいはそれらGUI版から導入する事))推奨。Kimpanelはシェル拡張なので影響なし

これらの方法は<u>古いバージョンのGnomeだとエラーが出る可能性</u>があります。2026年2月現行版のGnomeだと問題ありません(実証済み。画像参考)。

#### Gnomeのまとめ

インストールの方法なども書いたので{煩雑|はんざつ}になってしまいましたが、簡単にまとめると、
- **設定不要**（XWaylandアプリで稀に必要になる場合を除き、グローバルに設定しないのが公式推奨）
- 拡張機能で、`kimpanel`を探して入れる
- (ほぼ大丈夫だが、自動起動が効いているか念のため確認）

と言うだけのことです。実質、fcitx5をインストールして、**拡張機能で`kimpanel`を入れれば良い**と言う話です。他は必要に迫ったらという感じです。

### KDE Plasma(6.0以降)

KDEはfcitx5と<u>最も相性が良い環境</u>です。Wayland-onlyの宣言もしており、X11は廃止していくことが現実味を帯びてきていますが、X11のアプリが動かなくなるということはなく、`XWayland`という互換レイヤーがバックグラウンドで動作し、古いアプリの描画をWayland上で肩代わりします。

- システム設定の「仮想キーボード」項目から「Fcitx5」を選択するだけ

これだけでKWin(コンポジタ)が適切にfcitx5をハンドリングして、環境変数を手動で書かなくてもほぼすべてのアプリで動作するようになります。

デフォルトデスクトップ環境にKDE Plasmaが多く採用されているのはこういう所にあるのかも知れません。

### Hyprland / Sway

- `hyprland.conf`などで`exec-once = fcitx5 -d`を実行。ログインしたらfcitx5が実行されるようにする設定
- 同様に、環境変数で`env = XMODIFIERS, @im=fcitx`は書いておくと無難です。他の変数は特定のアプリ(VSCodeなど)で文字入力ができない場合にのみ追加します

---

ここから見てもこれまでのX11ように環境変数を書くなどというような方法よりはずっと簡単になっているので、Wayland対応のデスクトップ環境を利用するのが得策ではあります。
しかし、まだ問題点もあり、特定のアプリでは追加設定が必要になることがあります。

### 特定のアプリへの対策

- Chromium / Chrome / Electron (VSCode, Discord等)をWaylandで動かす場合、フラグが必要なことがあります。

  ```bash
  --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime
  ```

  ※ 最近のバージョンでは --wayland-text-input-version=3 を指定するとより安定します。

- Flatpak アプリでは、ホストのIME設定が見えないことがあるため、[Flatseal](https://flathub.org/en/apps/com.github.tchx84.Flatseal) などのツールで環境変数を個別に許可する必要があります。
ただしこれも基本と同様に、必要に迫ったらと言う感じです。

#### フラグの設定方法

Chromium / Electronアプリのフラグの設定方法は、起動コマンドに引数(フラグ)を追加するのが基本ですが、手動で毎回打つのは現実的ではありません。
Arch Linuxなどの一部のディストロでは`~/.config/`ディレクトリ以下にフラグ用のファイルを置くだけでランチャーからの起動時にも自動適用される仕組みがあります。

- VSCode(OSS版)の場合
   `~/.config/electron-flags.conf`あるいは、`electron-バージョン番号-flags.conf`があれば、そのファイルの中身を、

   ```ini
   --enable-features=UseOzonePlatform
   --ozone-platform=wayland
   --enable-wayland-ime
   ```

   と記入します。

もし、メニューやドックからアイコンをクリックして起動する場合は、システムのショートカットファイルを自分の設定で上書きするという方法もあります。
1. `/usr/share/applications/discord.desktop`などを`~/.local/share/applications/`にコピーします。これで使用しているユーザーの環境でだけ設定変更することができます
2. コピーしたファイルをテキストエディターなどで開き、`Exec=`の行を書き換えます
   - 修正前は、`Exec=/usr/bin/discord`
   - 修正後は、`Exec=/usr/bin/discord --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime`

- Hyprlandなどでは、

  キーバインドの設定(`~/.config/hypr/`以下の`bind.conf`)で、

  ```ini
  # ターミナルからVSCodeを起動する場合のバインド例
  bind = $mainMod, C, exec, code --enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime
  ```

  のように書けば同じ事になります。

  `$mainMod`は大抵の場合`SUPER(Windowsキー/Macでは⌘キー)`で、続く`C`は任意のキーの組み合わせです。つまり上記の例で言うと、`SUPER(Windowsキー/⌘キー) + C`のキーの組み合わせで`code`が起動する際、`code`に続くフラグがオプションとして起動します。

上記のような方法があります。優先順位としては、KDEユーザーであれば何もしなくても大抵は大丈夫で、Hyprlandなどではキーバインドや`~/.config/`以下に設定ファイルを書いたりして、それらでどうしようもない場合は、`.desktop`ファイルの`Exec`行を書き換える。というような優先順序だろうと思います。

## まとめ

ほとんどのLinuxディストリビューションは、英語が主言語として配布されているため、非ラテン言語系の地域の人は大抵それぞれの母国語が入力できる環境が必要になります。

特に日本人は英語で書かれている簡単な単語は読めるものの、本意が掴めない場合が多いので違った解釈をしてしまい、結果、正しく修正できなかったり自分の環境には合わない内容を適用してしまったりがあります。
近頃のディストリビューションは、ローカライズしてあることが多く日本語は読めるので一応使えるけれども、ほとんどのアプリで入力することが多いので日本語が打てないことだけが不便なわけです。
しかし英語圏の人々からしたらすでに英語での入力はできるので、その他の言語でどうかというのは報告がない限り気にもしないところだろうと思います。

IBusが強力に統合されているディストリビューション（特にGNOMEを採用しているUbuntu、Fedora、RHEL系）では、fcitx5を導入するかどうかはとても悩ましい問題です。今回はfcitx5での説明を書きましたが、「IBusが簡単に使えるのであれば」、「それで問題がないのであれば」fcitx5を使用しなくてもいいんじゃないかとも思います。

ただし、それら(Gnome)以外の環境ではIBusの方が設定が煩雑になることもあり、fcitx5を勧めているのは「どのディストリビューションでも」、「操作も」、「アプリ設定も」、同じとも言えるので一貫した方法で様々な環境に対応できると考えるとメリットはあると思います。

今はまだX11もWaylandも混在しているような環境でもある上に、色んなデスクトップ環境がありすぎてどれが正解かを模索している状況でもあると感じています。

つい最近ですが、
- [Linuxゲーム開発者が協力してゲームエコシステム全体を改善する「Open Gaming Collective」を結成 - GIGAZINE](https://gigazine.net/news/20260201-linux-gaming/)
- [OpenGamingCollective - Github](https://github.com/OpenGamingCollective)

というニュースがありました。

これはゲームの話だろ？と思われるかも知れませんが、ゲームというのは動作して当然の商品です。キャラクターが動くだけではなく、ローカライズされた言語での表示、チャットがあるタイトルなら日本語が入力できなければなりません。

こういう事から、現在はバラバラで設定も多少難しくもあるLinux環境ですが、たとえゲームであれども**軸**ができるとそれに合わせて作ることができるようになるため、将来的にはIMEのアプリを入れるだけでバックグラウンドで設定は全てしてくれて、何も考えずに日本語入力ができる、あるいは変換精度や入力方法だけがより洗練されたものも選択できるような世界になるのではないかと予想されます。

特にゲームでは日本語入力がLinuxの弱点であるということが表面化します。それらがゲームから日本語の簡単設定・入力の方法が一般化しないといけません。Windowsで言えばDirectX(Direct Input、 XInput、 Text Services Frameworkなど)のようなものが必要になるということです。
Google日本語入力、Microsoft IMEが入っていれば入力はできますよね。細かな設定は必要でしょうが、インストールするだけで入力できる。こういうことが必要になると思うのです。

Linuxに限らず、プレイステーションとセガサターンがでたことでスーファミが消えていったように、XBOXが出たと思ったらWiiだSwitchだと色んなものが台頭し消えていくのです。何が覇権をとるのか、三国志のように関係ない国が統一してしまうことだってありえます。Linuxの現在も似たようなものです。
ただし、Windowsに一本化するというのはいけません。WindowsもMacもLinuxもあっても良いが、基本になる規格は統一すべきという話です。あれがいい、これがいいと色々と素晴らしいアイデアや技術を出し合って形にし、基本はこうしようと「**規格を統一する**」これが大事です。
それらをそれぞれが使用できるようにする。できた商品で儲ければいいじゃないと。規格を乱立させるのはいかんよと。USBだライトニングだとそれぞれが主張するのは全然ダメと言うことです。

作った人が自分所のが勝っているといいたいのはわからなくもないですけども。

これまでのLinuxでは、Gtk、Qt、Electron、X11がといろんな環境が受け口になっていました。今、LinuxはWaylandに移行する過渡期です。これがWaylandに集約していき、それらをうまく使う仕組みの制定がなされれば、それを基準にアプリが作られたりアップデートされて今以上に便利になるはずです。

それまでは今しばらく耐えて下さい。ずっと耐え続けないといけないかも知れません。きっと良い方向に向かう未来があると希望して。
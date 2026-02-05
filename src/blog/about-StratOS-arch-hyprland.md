---
title: Arch + HyprlandのディストリビューションStratOSが話題に
description: ベースディストリビューションにRice環境を適用する事が多いHyprlandで、最初から設定済みの新しいディストリビューションが話題になっています
date: 2026-02-03
update: 2026-02-05
category:
  - blog
tags:
  - Arch系
  - Hyprland
  - Linux
images:
  - ../img/stratoshero.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## StratOS(ストラトス)とは

![StratOS](../img/stratoshero.avif)

公式サイト： [https://stratos-linux.org/](https://stratos-linux.org/)
ISOダウンロードサイズ： 約2.1〜2.3GB

StratOSは、2025年後半〜2026年初頭に注目を集め始めた新しいArch Linuxベースのディストリビューションです。
まさに「Arch + Hyprland」の代表格として話題になっており、特にHyprlandエディションが「今まで見た中で最もかっこいい」「衝撃を受けた」とレビューで絶賛されています。

特筆すべき注目点は、[Bedrock Linux](https://bedrocklinux.org/)の技術（{stratum|ストラータ} / 階層、あるいは塊）を組み込んでいて、Ubuntu / Fedora / Debian などのパッケージやリポジトリを簡単に混ぜて使え、実質的に「一つのシステムでpacman + apt + dnf + Flatpakなどが共存」できるのが最大の売りで、典型的なLinuxディストリビューションの枠に縛られることなく、ユーザーが自由に作業方法を決定できるシステムを提供しています。

これらを実現するためにStratOSには、Bedrock Linuxもプリインストールされており、既存の[Arch Linux](https://archlinux.org/)ベース上で他のディストリビューションのコンポーネント（「stratum / ストラータ(ム)」）をサポートできます。`brl fetch`(**b**ed **r**ock **l**inux)コマンドを使用して、[Ubuntu](https://jp.ubuntu.com/)、[Fedora](https://www.fedoraproject.org/ja/)、[Kali](https://www.kali.org/)、[Gentoo](https://www.gentoo.org/)、[Void](https://voidlinux.org/)などの他のディストリビューションのストラータを取得できます。

> stratum(ストラータ、あるいはストラータム)とは
> 一般的な意味としては階層という事ですが、levelやlayerと言うよりは、一つのディストリビューション（またはその一部）のファイル群をまとめた独立したユニットで、他のstratumと混ぜつつ干渉を最小限に抑える仕組みなのが伝わりづらい。そのため、「Fedoraのストラータをfetchした」などと、もうその単語そのもので理解するほうが良いとも言える。
> 意味合い的には「Fedoraのファイル群をまとめた独立したユニットをfetchした」と言う事。

例としてFrdoraの`dnf`を使用する場合、
```bash
sudo brl fetch fedora
```

stratumを取得したら、安全のためにアップグレードを実行します。
```bash
sudo dnf upgrade
```

その後で目的のパッケージを導入します。ここまでの流れから、
```bash
sudo brl fetch fedora && sudo dnf upgrade
```

と`&&`で繋げば、1行で書けるとも言えると思います。`&&`は前半コマンドが成功したら後半も実行します。前半失敗だと後半は実行されません。
これはArchで言う、
```bash
sudo pacman -Syu
```
の後、目的のパッケージを入れるのと手順は同じ事です。Archのシンプルで簡潔と言うのが強調される部分ですが、{Alias|エイリアス}を書けば省略して書けるのでどっちでも同じようなことです。
例えば、`update_dnf`と使用するコマンド自体を決めておき`sudo brl fetch fedora && sudo dnf upgrade`が実行されるように、デフォルトのシェルが何かはわかりませんが、bashであれば`.bashrc`にエイリアスを作ります。

こうしておけば(実際は、予め作ったコマンドのエイリアスになりますが)、
```bash
# skip-copy
update_dnf(例)
↓
(おそらくパスワード入力)
↓
sudo dnf install firefox
```
などとして簡単に書けるわけです。しかし、ここでもわかりますがArchの`pacman`にもfirefoxはありますから、dnfで入れる必要があるだろうか？となるはずです。あわせてArchはローリングリリースなのでUbuntuやFedoraよりバージョンが新しい可能性もあり…という点で、<u>Arch以外にしかないものを入れるのであれば便利だ</u>と言えると思うわけです。
[pacman](https://wiki.archlinux.jp/index.php/Pacman) + [AUR](https://aur.archlinux.org/) + [Flatpak](https://flatpak.org/)(あるいは、[Snap](https://snapcraft.io/)や[AppImage](https://appimage.org/))では足りないという状況があるのかはわかりませんけども、アプリを作っている人がUbuntuにしかリリースしていないという状況などがあれば便利だと言えると思います。

書くのがやや面倒なStratOSではありますが、コマンド一発で Ubuntu / Fedora / その他 の使用できる全てのストラータを更新・取得するわけではなく必要に応じて各ストラータを最新にします。その方が軽量・シンプルだからだと思います。
パッケージ導入はどのディストリビューションでも当然の手順なので変則的なものではありません。

Archであれば、
```bash
# skip-copy
sudo pacman -Syu
↓
(パスワード入力)
↓
sudo pacman -S firefox
```
ですから。同じですよね。エイリアスを作っていない場合は記述が多いので面倒ですが、UbuntuやFedoraを使っている人は普段からやっていることですし、シェルが`fish`や`zsh`なら補完もできるわけで多少マシとなるでしょう。

### 配布されているエディション

配布されているエディションとしては、[Hyprland](https://hypr.land/)、[GNOME](https://www.gnome.org/)、[Niri](https://github.com/YaLTeR/niri)が提供されていて、HyprlandやNiriのようなWaylandコンポジター(ウィンドウマネージャー)の操作に不安があると言う人に対してもGnomeでカバーするなどがされています。

### 独自ツールやカスタム要素として

- Rockers： 他ディストロのパッケージやFlatpakを簡単に扱えるラッパー
- StratVIM： Neovimのフォーク
- Stratmacs： Emacs設定のカスタム版
- grab： シンプルなfetchツール
- Maneki-Neko： ウェルカムアプリ（招き猫）

#### プリインストールアプリ

- [Ghostty](https://ghostty.org/)： ターミナル
- [Conky](https://wiki.archlinux.jp/index.php/Conky)： システム情報表示
- [Emacs](https://www.gnu.org/software/emacs/)： テキストエディター
- [Kvantum Manager](https://store.kde.org/p/1005410)： 「Kvantum」のテーマを選択するためのGUI
- [Neovim](https://neovim.io/)： Vimベースのテキストエディター
- [Thunar](https://docs.xfce.org/xfce/thunar/start)： ファイルマネージャー(Xfceのファイルマネージャ)
- [Zen Browser](https://zen-browser.app/ja/)： Webブラウザ

[公式wiki](https://stratos-linux.org/intro/)では特に明言はありませんが、ZDNetではZen Browserがプリインストールされていると書いてあります。しかしDistoWarchではChromium系と記載があります。バージョンアップなどして変更があった可能性があります。また単にインストール時に選べると言うだけの可能性もあります。

> Zen Browserとは
> Firefoxをフォークしたブラウザで美しいデザイン、プライバシー重視、機能満載のWebブラウザです。必要なければタブを非表示したり分割表示もできます。Zen Modsというプラグイン・テーマがありブラウザをカスタマイズできます。
> {ytp::https://youtu.be/TBZZUGB_bCw::Firefox系ブラウザの『Zen browser』を徹底解説！機能・使い方など詳しくご紹介します【Arc・Sidekickの代替におすすめ】 }

### その他

インストールは、多くのディストリビューションで採用されているCalamares（グラフィカルインストーラー）で、特に難しいところはないです。swap領域を作るかswapファイルを作るかが選択できますが、2026年の情報ではswapファイルを作るのが推奨・デフォルトになっています。
理由としてはディスク操作せずともファイルなのでサイズ変更が容易というのが言われています。Linux kernel 5.x以降（特に6.x系）では、swapファイルが連続確保されていればパーティションと実測性能差はほぼゼロと言われています。SSD/NVMe環境では特に差を感じないとされています。
一方、スリープではなくハイバネート(休止状態)を確実に使いたい人で、暗号化ルート(LUKS)を使用している場合はswap領域を作るほうがレジューム設定がシンプルに設定できるので良いとも言われています。swap領域(パーティション)を作るのは環境によりけりです。

#### パッケージ管理

ArchLinuxがベースになっているのでパッケージ管理は`Pacman + AUR`が基本で、Bedrockによって他のパッケージマネージャも使用することができます。例えばArchの最新パッケージが欲しいけど設定などが<u>わからない・面倒だ</u>と言う人には良いかも知れません。
「UbuntuのパッケージもFedoraのパッケージも両方使いたい」という人には最高だ！と思いがちですが、たいていArchは多くのパッケージがあり、Ubuntu・Fedoraにしかないパッケージはたくさんあるものの、それぞれに重複しており、Ubuntu・Fedoraのパッケージが必要になることはあまりありません。<u>Flatpakなどがあるため</u>Archのリポジトリにはなくても問題ないことが多いです。

しかし、逆にUbuntu・Fedoraユーザーにとっては、半年ごと数年ごとのリリースなので更新の早いArchのパッケージが必要になることはあるでしょう。特にHyprlandのような開発が活発で更新頻度が高いものでは、ローリングリリースのArchでないとそれぞれに必要なパッケージが間に合わないということになるわけです。

またHyprlandを綺麗に使いたいけど自分でゼロからdotfilesを{揃|そろ}えられない、揃えるのは嫌と**コマンド嫌いが過ぎる人**にも良いかと思います。もちろんのこと英語が基本になっているので、日本語環境(主に入力で必要なIME)を導入するためのコマンドは必須ではないものの、<u>どこかしら・何かしらで</u>は使用することになるだろうと思うので(どうせなら触れていく方が良いに決まってますが)、結果的に面倒なことになってもGUIしか無理という人には良いかも知れません。

まだ新しいプロジェクトなので、Bedrockの複数stratumをフル活用する人は少数派かもしれませんが、Hyprlandエディションだけでも十分「使える・美しい」と評判になっています。

## ファイルシステムやブートローダーなどはどうなっているか

DistroWatchのページで明確に「Journaled File Systems: ext4」と記載されており`ext4`であることから、今どきのAtomic/Immutableなシステムではなく、またロールバックする仕組みもないようなので、これまでのArchに準ずる一般的なシステムです。

Archベース + Calamaresインストーラーを使っているほとんどの現代ディストロ（EndeavourOS、Garudaなど）と同様の仕様かと思われますが、設定さえすればロールバックは可能であるはずです。

## 個人的に思うこと

ZDNetのJack Wallenが、「数十年Linuxを使用しているがこれまで見た中で最もクール」と絶賛しているわけですが、インストールすれば即使えることを主に、ダークテーマであったりを言っていると想像できるものの、[Omarchy](https://omarchy.org/)や[Archriot](https://archriot.org/)、[AxOS](https://www.axos-project.com/)などを知らないなんてことがあり得るだろうかと疑問にも思え、ディストリビューションとしてISOを配布しているわけではないものの[DankMaterialShell](https://danklinux.com/)や[illogical-impulse(end4)](https://ii.clsty.link/en/)、[ML4W](https://www.ml4w.com/)より洗練されているとも見えないわけです。

<div class="border-2 border-sky-300/80 text-base my-[16pt]">
  <div class="block text-s p-4">関連記事</div>

- [新しいArchLinuxの形 - Archriot](/blog/archriot/)
- [AxOSとHyprlandについて](/blog/about-axos-and-hyperland/)
- [公式で無いなら個人でやればいいじゃない？ EndeavourOS+Gnome+hyprland](/blog/installing-hyperland-on-endeavoros_gnome/)
- [追加検証！CachyOSのHyprland環境にDANK Shellをぶち込んでいきなり使い勝手を良くする](/blog/cachyos-hyprland-dankshell-install-guide/)

</div>

日本語を使用するためには日本語のフォントも必要になり、広く使われているのはNotoフォントであろうと思いますが、それらを使用して雰囲気が変わった場合に同じ事が言えるか問題もあると思うわけです。DankMaterialShell、illogical-impulseは日本語と言語を選ぶだけで訳されたメニューが表示されます。
現在実際に私が使用しているDankMaterialShellで言えばフォントも設定できます。日本語入力だけはfcitx5など別で導入する必要があるものの日本語を表示する環境ができている上に、所在地の天候・気温も表示でき、illogical-impulseではAIを使用するベースも搭載しています。

壁紙で使用されている色からテーマのアクセントカラーを抽出したり、設定画面でタスクバー・ドックの位置などのカスタマイズなどもできるわけで、それらを使用してきていると、ZDNetで絶賛されているのは、インストール直後から<u>美しく、設定されたHyprlandを使用できるだけ</u>とも言えます。もちろんStratOSでカスタマイズができないわけではないでしょうが、「これまで見た中で最もクール」は言い過ぎだとも思えるわけです。

「他に凄いのはありますがお手頃に美しいHyprland環境をすぐ利用できる」程度だろうと思うのです。そこがHyprlandを触ったことがない、設定が面倒という人にとっては刺さる部分なのでしょうけども。

他にも次のように書いていました、

「自分でも信じられないが、筆者はこのバージョンのStratOSを見て、Hyprlandをデフォルトのデスクトップ環境にしてもいいかもしれないと思った。」

使ってないんかい、と私は絶望したわけです。Hyprlandが良いと言い切れるわけではないものの、何十年もLinux使用してきてまだスタック型のディストリビューションを使用してるとしたら、よっぽど使い勝手が良いディストリビューションなんだろうけども、そんなものがどこにあるのか教えて欲しいとすら思うのです。
SwayやNiriなど考えられるポイントはあるけれども、ディストリビューションではそんな凄いものは見たこともないし、聞いたこともなく、UbuntuやMintと言うならWindowsでいいやんと思うわけで。

**Linuxを使うのはWindowsより優れているところがあるからだろう**と。

決してWindowsが良いわけでもなく、Linuxが全部をカバーできるわけでもないが、それでもLinuxにしかない便利さがあるとしたら、タイル表示ができるHyprlandやNiri等の反応速度の速さ、リソース消費の少なさだろうと思うわけです。

昨今のメモリやパーツの高騰で、1台でなんでもできるPCを安く入手するのが難しくなり、少し前に使用していた古いPCがあれば、メモリ消費が少ないLinuxディストリビューションでHyprlandのような軽量・高速なウィンドウマネージャーを使用して、WindowsとLinuxを使い分けることで肥大化しているWindowsのメモリ消費を抑えて効率的に使用することこそが今やるべき姿なのではなかろうかと。

例えば、絵を描く、ゲームをするのはWindowsで続けて行い、となりでLinuxノートなどを置き、ブラウザによる調べ物や動画閲覧などを行うとかであれば、調べ物や動画閲覧で消費されてたメモリはLinuxノートが代替するわけですから、その分Windowsからは削減できるわけで、足りないメモリ分を少しでも補えるだろうと。
Linuxノートに既に8GB以上(推奨12GB(8GB +　4GB)以上)搭載しているのであれば、それで日常使いは間に合うだろうから、Windowsの方に高騰しているDDR5メモリを増設しなくてもいいだろうと思うわけです。現状で耐えられはしないか？と。

簡単に言えばコンビニに行くのに高級ベンツに乗っていく必要はなく、乗り物であればセカンドカーにあたる軽自動車やスクーター、自転車感覚のLinuxを使えばいいやんと言うことです。徒歩で行くよりはずっと楽なはずと。そうして使い分ける環境ができたら、何でベンツなんか乗ってたんだろうと思うようにもなるはずです。

## まとめ

新しいプロジェクトであるため、温かい目で見守る必要はあるでしょうが、StratOSは、

- Archの最新パッケージが欲しいけど、普通のArchはインストール・設定が面倒
- Hyprlandを綺麗に使いたいけど自分でゼロからdotfilesを揃えるのは嫌
- Archだけでなく、UbuntuのパッケージもFedoraのパッケージも両方使いたい

そう言う人に対しては選択候補になる、まだ数少ないHyprlandのディストリビューションとは言えると思います。
先進的なディストリビューションのようにデフォルトで搭載された機能としてシステムを壊さないような仕組みはなく、「システムを破壊すること無く、ロールバックも容易に**可能ではない** 」ため、自身でそれら機能を導入する必要があり、Windowsから移行するには簡単にはオススメできません。

何かしらのディストリビューションでLinuxに慣れて、ArchLinuxにも慣れて、Hyprlandがどういうものかもおぼろげながら理解できる人には良いかも知れません。
車で言うとMTで頻繁に運転する人がATに買い替えて楽できると言う感じです。ATしか乗ったことがない人が、MTがどういう感じなのか想像してもらったら良いかも知れません。例えるとMTの免許を取りに行く面倒くささもあるとも言えます。
もっと言えば、ある程度車には乗ってきたが、30{半|なか}ばにしてバイクの免許を取るような感じでもあろうと思います。

それぐらいの環境の変化、新しいことにチャレンジしたい人にとっては良いかも知れません。

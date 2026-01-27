---
title: Windowsで使われるソフトはLinuxにあるか
description: Linuxにはソフトやドライバーがないと思っている人が多いので、代替のものがあるかを調べました。あと古い知識しかなくイメージが停滞している人が多いので現状の確認のための内容も含めてあります。
date: 2025-12-03T05:42:29.949Z
update: 2026-01-27
category:
  - blog
tags:
  - linux
  - ソフトウェア
images:
  - ../img/benz_midget.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## Linuxでソフトは本当に無いのか

Linuxはサーバー用だろ？と言うことでWindowsのようなソフトは無いと思っている人もいるだろうと思います。あるいはいわゆるコンソールの黒い画面でコマンド入力が基本なんだろ？と思っている人も多いと聞きます。

そういう今でも20年ぐらい前の時代に住み続けている化石のような人や、プリンターや周辺機器のドライバーがないと言う人もいるでしょう。
2025年現在、主要メーカー(ブラザー、キヤノン、EPSON)等の9割以上がLinuxドライバーを標準提供していることを知らない人が、自分の環境だけでドライバーがないと声デカに発言していて、それを信じてしまっている人のなんと多いことか。

会社で使えないと言う人もいます。しかし実際には、東京証券取引所、日銀、JR東日本の基幹システム、国税庁の電子申告システムなど超重要なところは全部Linux。Windowsは「個人のデスクトップだけ」と言うと言い過ぎですが、自社で専用のシステムを持てない場合にWindowsの有料汎用ソフトを導入すると言うのは確かにあります。責任の所在をメーカーに押し付けるためというのもあるかも知れません。
自分の会社はWindowsに限らずMacOSでもLinuxでも問題はないが、取引先がWindowsしか使ってないのでEXCELでくれというような、まだEXCEL？と言う環境が無くならないのもしょうがありません。

Windowsの環境でExcelはそれぐらいになんでもできる便利なソフトであるわけです。しかしMicrosoftはやりすぎました。

### Windows PCの問題点

新しいOSを入れるためにPCの買い替え、セキュリティサポートが終わるんで新しくしないといけないが、Windows11ならOSを動かすためにPCも比較的新しいものが必要となります。しかし、10年以上前のPCでもLinuxは動きますからPCの購入費用を先送りにもできます。
例えば5年で買い替えというスパンであればあと5年引き伸ばすということができるということです。今までの費用が1/2で済むということでもあります。

例えばMicrosoftアカウント強制と言うのもあります。Linuxなら元々ローカルアカウントです。広告を入れる等のためにMicrosoftに使用状況を渡す必要はありません。テレメトリー等といいますがWindowsはOS、ソフト共にそう言うのが多いです。

#### Windows updateとか更新に関してはどうでしょうか？

普段から通知もなしで勝手にダウンロードして導入までやってるのに、まだ別でWindows updateが入って、更新だけしたらシャットダウンしてほしいのに再起動したり、これは修正されたと言いますがなぜ更新にそんなに時間がかかるのでしょうか？なぜこちらの都合で更新したりができないのでしょうか？

昔は自分たちでファイルをダウンロードして適用していました。今でも可能ですが、手動よりも自動でインストールが推奨されています。自動になったとは言えもっとうまい方法はなかったのかとも思います。
もちろん更新ファイルに何の問題もなく速度的にも普通のネット環境であれば、作業の邪魔になるわけでもなくそれはそれで良いのかもと思います。しかし更新するたびに何かしら問題があると自動更新はかえって問題になります。そういった時に<u>手動で更新するオプションはあって然るべき</u>だとも思うわけです。

問題が解消されたら適用が普通といえば普通です。しかしどこで問題が起こるかは各環境による所もありますから、問題が起こればロールバックを起動前にできるようにするべきです。<u>これらも仕組みとしてはあるのです</u>が、復元ポイントに戻ってもまた更新が当たりループしてしまうとか、10日以内ならまだしもそれ以前に戻すのは難しいとか、そもそもブートでループしてしまうとか回避のため更新一時停止や手動ブロックが必要で、初心者には面倒とも言えます。

それ以前に細かなバグを含めて多すぎます。そこで最近のLinuxではまだ一部と言えますが、immutable(不変)/atomic更新と言う仕組みが採用されていて、更新をコンテナ化やスナップショットで安全に適用し、問題があれば簡単にロールバックするように設計されています。

これらは[Fedora Atomic](https://www.fedoraproject.org/ja/atomic-desktops/)系、あるいはBtrfsというファイルシステムとSnapper/Timeshiftでロールバックを容易にするとか、[Vanilla OS](https://vanillaos.org/)ではABRootでAに更新を試して問題がなければ適用、Aに問題があればBで現状維持するというような方法がとられているものもあります。

<div class="ytgrid grid grid-cols-1 pb-8 md:grid-cols-2 auto-rows-auto">

{ytp::https://youtu.be/Z4DfFCD15wU::Fedora Atomic Desktops}
{ytp::https://youtu.be/GEQl6HPn2ic::Vanilla OS: The Immutable Linux Distro That Won’t Let You Break It!}

</div>

また新しい[Pop!\_OS](https://system76.com/pop/)では`/home`(ユーザーファイル/設定の一部)を保持し、Recovery Partitionという専用パーティションがあり、そこからRefresh Install（リフレッシュインストール）を実行できます。これはつまり**システムだけをクリーンインストールできる**ということですが、ユーザーファイルは保持しているので予めバックアップを用意する必要がないとも取れます。しかし、実際には思いがけずトラブルに会った際に被害を最小限にするための機能と理解する方が良さそうです。

FedoraとPop!\_OSであればFedoraの方が先進的な技術です。以前の記事でも書きましたが、Fedora Atomicはいうなればファミコンのようなものです。システムとカセットとそれぞれにROMがあり、カセット側で裏技をしておかしくなってもリセットすればまたどちらも問題なく起動するような感じです。

<div class="ytgrid grid grid-cols-1 md:grid-cols-2 auto-rows-auto">

{ytp::https://youtu.be/IyXzjnd6q3g::Pop!_OS Features: Productivity For All}
{ytp::https://youtu.be/GAp0_N1nzg0::POP OS 24.04 は驚異的 (COSMIC DESKTOP 提供)}

</div>
<span class="inline-block pb-8 text-sm leading-4">※ 最初の動画はPop!_OSの全体的な機能を紹介した公式の動画です。新しいデスクトップ環境Cosmicはepoch1となり安定版になりました。</span>

Windowsでもリカバリーパーティションはありますよね？しかしWindowsのシステム設計が伝統的に**mutable（可変）** で、アプリやドライバがシステムファイルを直接書き換える前提で作られています。
更新は累積型で、部分適用が多く、完全アトミックにするにはOS全体のイメージ管理（OSTreeのような）を導入する必要があり、互換性（既存アプリ、ドライバ、レジストリ）が崩れるリスクが大きいと言えます。

MicrosoftはWindows Subsystem for Linux(WSL)やコンテナ（Docker）で似た技術を使っていますが、デスクトップOS本体には適用せず。2025年もatomic/immutableの兆候はありません。しかし技術者はLinuxなどの手法は知っているはずです。これができないのは現行システムでの改変がとても困難で、その改変でOS自体が不安定になることを避けているのだろうと思います。
次期Windowsにはそれらが搭載されるかも知れませんがこれはまだまだ先のように思います

Linuxでは更新で5分かかることは珍しく、通常は数秒から数分です。Windowsのように自動で適用もできますし、(受けられる機能があれば)通知だけが来て自分で更新するということもできます。

現状を知らないがゆえに声のでかい人の古い情報に騙されてしまいます。

### Windowsしか知らない人がLinuxに持ってるイメージ

Windowsは現代を走っている車、Linuxはミゼットなどの三輪車あるいは昭和の車のようなイメージがあってそれを払拭できていないのではないかとも思います。

<div class="table-container">

| 昔のイメージ                | 2025年の現実                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| Windows ＝ 最新のベンツ     | →今や「重厚長大で燃費が悪く、税金（ライセンス料）が高い旧型高級車」 |
| Linux ＝ 三輪自動車ミゼット | →F1マシン＋テスラ＋宇宙ロケットを全部足して割ったような最先端マシン |

</div>

![benz_midget](../img/benz_midget.avif)

Windowsは確かに<u>一般人が乗るセダン</u>としては優秀ですが世界最速の車・最先端の自動運転車・宇宙に行ってる車は、全部Linux((Tesla、Boston Dynamics、NASAのローバー、JAXAはやぶさ2))です。つまりLinuxは**公道を走ってるように見えないだけで、実はもうF1マシン＋宇宙船レベル**なのです。
つまり持っているイメージの差が誤解となっているということです。今どき三輪が走ってはおらず根本から間違っている状態です。

WindowsはNTカーネルで1993年生まれだと聞きます。もちろん更新されてはいますが32年前の設計の家に最新エアコン・太陽光パネル・スマートホームを後付けしまくった家と言えます。なのでWindowsはDockerを動かしたいとしてもWSL2でLinuxカーネルを動かすとか、次世代Xboxの開発キットもLinuxベースとWindows自身では無理が出てきているのでLinuxの手を借りている状態です。
Xboxについてはポータブルゲーム機とか対応させるのにとか色々とあるんだろうと思いますが。

Linuxもたいてい古くからカーネルがありますが、古い家は毎年**柱も基礎も全部取り替えてる**ので、今はほぼ新築で必要な場所に自由に窓を開けたり、壁をぶち抜いたりできるイメージです。2019年ごろからRust統合が始まり、現在でもまだ進行中ではあるものの着実に進んでいるのです。

> 2025年12月上旬、Linux Kernel Maintainers Summitで、LinuxのカーネルのRust統合ついて議論され「実験的（experimental）」ステータスを外すことが合意されました。
> Rustは新ドライバやサブシステムで積極的に使われるようになり、将来的に一部の領域（例: グラフィックスドライバ）でC言語の新規コードを制限する動きも出てきそうです。ただし、カーネル全体をRustで書き換えるわけではなく、Cが主流のままです。

## Windowsで良く使われているソフトをAIに聞いてみる

<div class="table-container">
<style>
    tr:nth-child(even) {
        background-color: rgba(31, 45, 59, 0.32);
    }
    td:nth-of-type(2) {color: rgb(175, 177, 179);}
    td:nth-of-type(n+2) {color: rgb(175, 177, 179);}
    td:nth-of-type(n+3) {color: rgb(122, 125, 128);}
</style>

| ジャンル                     | 1位                          | 2位                  | 3位                        |
| ---------------------------- | ---------------------------- | -------------------- | -------------------------- |
| ウェブブラウザ               | Google Chrome                | Microsoft Edge       | Firefox                    |
| 動画再生                     | MPC-HC + LAV Filters<br/>MPV | VLC media player     | PotPlayer                  |
| 動画編集(プロ・セミプロ)     | DaVinci Resolve(無料版)      | Adobe Premiere Pro   | CapCut(TikTok系)           |
| 動画編集(ホビー・YouTube)    | CapCut                       | DaVinci Resolve      | Shotcut<br/>Kdenlive       |
| 画像編集(プロ)               | Adobe Photoshop              | Affinity Photo V2    | CLIP STUDIO PAINT          |
| 画像編集(ホビー)             | GIMP                         | Paint\.NET           | Photopea(Web)              |
| 3Dモデリング                 | Blender(無料)                | Maya<br/>3ds Max     | Cinema 4D                  |
| 音声編集・DAW                | Audacity(無料)               | Adobe Audition       | REAPER                     |
| ゲーム録画・配信             | OBS Studio(無料)             | Streamlabs Desktop   | NVIDIA ShadowPlay          |
| ファイル解凍                 | 7-Zip(無料)                  | WinRAR(有料)         | Bandizip                   |
| Office系                     | Microsoft Office 2021/365    | LibreOffice          | WPS Office(無料)           |
| PDF編集・閲覧                | Adobe Acrobat Reader/Pro     | Edge(ビルトイン)     | Foxit PDF Editor           |
| テキストエディタ・コード     | Visual Studio Code           | Notepad++            | Sublime Text               |
| 仮想環境・開発               | Windows Terminal + WSL2      | Docker Desktop       | Git for Windows            |
| セキュリティ(アンチウイルス) | Windows Defender(標準)       | ESET<br/>Bitdefender | ノートン                   |
| バックアップ・同期           | Google Drive<br/>OneDrive    | Dropbox              | MegaSync                   |
| クリップボード管理           | Ditto(無料)                  | ClipClip             | PowerToys FancyZonesと併用 |
| スクリーンショット           | ShareX(無料)                 | Snipping Tool        | Flameshot                  |

</div>

### ウェブブラウザ

Google Chrome、Microsoft Edge、Firefoxはもちろんの事、BraveやVivaldiもLinuxにはあります。基本的にはどのディストリビューションでもFirefoxがデフォルトですが、最近はBraveのディストリビューションとかもあります。インストールする際あるいはインストールした後に公式でChrome、Baraveなどはインストールできるようになっています。
EdgeやVivaldi、その他のWebブラウザは公式に提供しているディストリビューションと無いものがありますが導入自体はどれでもできるようになっています。

Windowsで一般的に使われるもの以外にもたくさん派生したブラウザはあってそれらはもちろん、Qt WebEngineベース、electron ベースのブラウザなども使えます。詳細は[Arch Wiki](https://wiki.archlinux.jp/index.php/%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E4%B8%80%E8%A6%A7/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88#.E3.82.A6.E3.82.A7.E3.83.96.E3.83.96.E3.83.A9.E3.82.A6.E3.82.B6)のWebブラウザを参照してみて下さい。

<div class="ytgrid grid grid-cols-1 md:grid-cols-2 auto-rows-auto">

{ytp::https://youtu.be/AX5wIu-E_cc::Zen Browser on Arch Linux | The ULTIMATE Privacy Browser?! }
{ytp::https://youtu.be/652-ZUD_v5Y::The Best (And Worst) Browsers for Linux}

</div>

> [EdgeだとかBraveだとかで迷ってるならこれで行こう！Heliumが全て解決](/blog/helium/)と言う記事を書きました

### 動画再生

MPC-HC(MPC-BE)はWindowsで良く使われている動画プレーヤーです。これらはWindowsにしかないかもしれませんが[MPV](https://mpv.io/)はWindows、Linuxいずれにもあって、他にも[VLC](https://www.videolan.org/vlc/index.ja.html)などがよく使われているように思います。
細かく設定すればMPVが最強とも言えますが、設定できない人にとってはVLCが簡単かと思います。

Linuxだけかと思いますが、[Celluloid](https://celluloid-player.github.io/)なども良く使われます。各ディストリビューションにはメディアプレーヤーとして独自のプレーヤーが付属していたりしますが再生だけをするのであればMPVのフロントエンドであるCelluloidが最もお手軽かと思います。

MPVやCelluloidはウィンドウの枠がないのでタイル型のウィンドウマネージャにも馴染みますし、設定は細かくできるものの何もしないと不便なだけ((コマ送りや動画のD&D、クリックで停止・再会やTitle、シークバーの位置等の設定などがないとか))で再生自体はたいていの形式ができるのではないかと思います。VLCでもそのようなスキンや設定すればよいのかも知れませんが結構手間ではないかと。スキンであればいいんですけどね。

{ytp::https://youtu.be/w-g04TLp0tg::MPV - A Lightweight Powerful Video Player for Linux}

### 動画編集

[DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve/)はLinuxにもあります。Adobeのソフトはありませんが、[Kdenlive](https://kdenlive.org/)はLinuxに最適化されているのでWindowsで使うよりも安定して使えます。
Windowsにもありますが、編集するだけなら[Olive](https://www.olivevideoeditor.org/)も良いかと思います。

After Effectsの代替としては[Natron](https://natrongithub.github.io/)というものがあります。

{ytp::https://youtu.be/ZNu_mx3ojs8::Natron Tutorial for Beginners | Learn the Basics in Less Than 30 Minutes}

### 画像編集

これも動画編集と同じくAdobeのソフトはありませんが、[GIMP](https://www.gimp.org/)や[Krita](https://krita.org/ja/)はLinuxにもあります、というかLinuxのソフトです。

Illustratorのようなベクターグラフィックは[Inkscape](https://inkscape.org/ja/)が有名です。これもWindows、Linux共にあります。

先日Affinityがペイント、ベクターを統合して無料で登場したことを受け、現在はWindowsだけのソフトですがいずれLinuxにも登場するかも知れません。WindowsでもPhotoshop離れが進んでいて、業務で使用する場合はAdobeのソフトを使う人が多いでしょうが、個人向けとしてはAffinityかGIMPを使用する人が多いように思います。

### 3Dモデリング

[Blender](https://www.blender.org/)はLinuxにもあります。[FreeCAD](https://www.freecad.org/index.php?lang=ja)もあるのでたいていの3DモデリングはLinuxでも可能です。[Onshape](https://www.onshape.com/ja/)と言う業務に耐えられるものもあります。これはクラウドベースの3D CADソフトであるためOS関係なくブラウザで利用することができます。

{ytp::https://youtu.be/1A3lpf-eusQ::New crazy blender 5.0 features & updates}

### 音声編集・DAW

[Audacity](https://www.audacityteam.org/)、[Reaper](https://www.reaper.fm/)はLinuxにもあります。

LinuxネイティブなDAWとしては[Ardour](https://ardour.org/)が最も機能が充実しているでしょうか。[Bitwig Studio](https://www.bitwig.com/)、[Waveform Free](https://www.tracktion.com/products/waveform-free)などWindowsよりもむしろLinuxの方がソフトとしては充実している分野かもしれません。これらはプロフェッショナルな現場でも使用されたりしています。

### ゲーム録画・配信

[OBS Studio](https://obsproject.com/ja)はLinuxにもあります。ほとんどこれ一択な感じでもありますが、Linuxでは[SimpleScreenRecorder](https://simplescreenrecorder.com/)や[vokoscreenNG](https://linuxecke.volkoh.de/vokoscreen/vokoscreen.html)なども考えられると思います。ゲームを配信するならOBS Studio、もっとシンプルに配信するならSimpleScreenRecorder、vokoscreenNGを利用してもできると言う感じです

### ファイル解凍

[7-Zip](https://7-zip.opensource.jp/download.html)はLinuxにもあります。Linuxでは特定のソフトを使うというよりはディストリビューションのデスクトップ環境の一部として提供されていることが多く、有名なものとしてはGnomeの[File Roller](https://gitlab.gnome.org/GNOME/file-roller)、KDEでは[ARK](https://apps.kde.org/ark/)などがあります。Linuxの場合、GUIで操作するよりはCLIで操作することも多く、ターミナルのシェルにもよりますがFishであればファイル名やパスを補完してくれるのでより手軽にCLI環境で圧縮解凍が可能です。これらには特別なソフトが必要というよりは必要なものを予めシステムに導入しておく、あるいは始めからディストリビューション・デスクトップ環境に組み込まれていると言う感じです。

例えば`tar`というものがありますが、これはアーカイブツールで、圧縮機能ではなく複数のファイルを1つにまとめるアーカイバです。そのため別途`gzip/gunzip`と併せて使われて、`*.tar.gz`のような形式で使われます。
基本的にはオプションを付けるだけです。`-c`はクリエイト、`-z`はgzipで圧縮、`-v`は処理中のファイル表示(省略可)、`-f`は出力ファイル指定というような内容です。

```bash
# skip-copy
tar -czvf ファイル名.tar.gz 対象ファイルやディレクトリ #圧縮
tar -xzvf ファイル名.tar.gz #解凍
```

と長いので面倒ですが、tar.gzはファイル属性（パーミッション、所有者、シンボリックリンクなど）を完全に保持したい場合に利用されます。画像ファイル3つとかならzipの方が簡単です。

```bash
zip images.zip a.jpg b.jpg c.jpg
```

圧縮解凍に関してはGUIでやる方が随分と楽なのでユーティリティを使用するか、ファイルマネージャのプラグインなどでできるものもあります。あるいはデフォルトで装備されているものもあるかも知れません。それらならファイルを選んで右クリックから操作できるので深く考えなくても圧縮解凍できるのが良いですね。

### Office系

windowsといえばMicrosoft Officeですが、こればかりは同じものがなくOffice系としてはその代替ソフトの[LibreOffice](https://ja.libreoffice.org/)や[OnlyOffice](https://www.onlyoffice.com/ja)などが使われます。完全ではなく一部使えない機能がありますが互換性が高いのは中国製の[WPS Office](https://www.wps.com/ja-JP/)でしょうか。
[Microsoft 365](https://www.microsoft.com/ja-jp/microsoft-365)のWeb版をブラウザで使う（Linux完全対応、無料プランあり）。高度機能が必要ならこれが一番現実的です。
どうしてもローカルで完結したいとなるとソフトを選ばざるを得ません。

日本人がExcelに依存しすぎな面もあり、Wordの代替ソフトは何でも良いですがExcel完全互換はありません。特にVBAマクロがそのまま動くというものはありません。
表計算自体は高い互換性がありますが、Excelが抱える互換性の問題は「表計算ソフトなのに、データベースの役割も果たし、さらにプログラミング機能(VBA)まで詰め込まれている」という点に起因しています。

日本だけではなく世界的にもExcelに依存している所は多いです。これはしばらくは変わらないと思いますが最近ではAIを用いて見積書や各種データの自動化するソフトやクラウドサービスが急速に普及していて従来のExcel中心のワークフローから、これらのAIサービスへと移行する動きは確実に出てきています。
なので現在、無理やりWindowsに合わせる必要は全くないので、Linuxでどうのと言うよりは今の所はWindowsでやればいいやんと言う形になるかと思います。

### PDF編集・閲覧

PDFはブラウザで見れますが、KDEの[Okular](https://okular.kde.org/ja/)で簡単な書き込みも可能です。他のLinuxのソフトとしては[Master PDF Editor](https://code-industry.net/masterpdfeditor/)ではAdobe Acrobat Proに近い操作も可能です。

### テキストエディタ・コード

[Visual Studio Code](https://code.visualstudio.com/)はLinuxにもあります。[Sublime Text](https://www.sublimetext.com/)や最近では[Zed](https://zed.dev/)などLinuxでは多くのコードエディタが存在します。

純粋にテキストだけを編集する場合は、これもディストリビューションやデスクトップ環境によって独自に提供されていたりします。例えばGnomeであればテキストエディター(旧名Nautilus)と言うのもあり、他にも[gedit](https://gedit-text-editor.org/)というのもあります。

Linuxではターミナルから直接テキストファイルを開くためにnanoや[micro](https://micro-editor.github.io/)などターミナルベースのテキストエディターもあります

### 仮想環境・開発

これはWindowsでLinuxの仮想環境を作るというような目的なので、Linuxそのものが対象になります。ターミナル エミュレーターとしてはGhosttyがイチオシですが、Kittyなどもかなり良いと思います。軽快でシンプルかつ設定がどうかという判断です。

### セキュリティ(アンチウイルス)

Windowsほどウィルスに感染することはありませんが、OS問わず多くの場合が人為的なものが感染源ですから、もし感染した場合にどうするかと言う点からしてもアンチウイルスソフトもあります。[ClamAV](https://www.clamav.net/)、[Comodo Antivirus for Linux](https://www.comodo.com/home/internet-security/antivirus-for-linux.php)、などがあります。

firewallを設定するのが最初の一歩とも言えますが、Firewallと連携して侵入検知システムを作ることもできます。[Fail2Ban](https://github.com/fail2ban/fail2ban)では、SSHログインの試行失敗、いわゆるブルートフォースアタックなどをログから検知し一定回数失敗したIPアドレスからのアクセスを自動的に一時ブロックします。
他にもnort / [Suricata](https://suricata.io/)を用いてネットワーク侵入検知システム(NIDS)を作ることもできます。ネットワークトラフィックを監視し、既知の攻撃パターンや異常な通信を検知・警告します。主に企業ネットワークの境界や重要なサーバーの前段に設置されます。

Rootkit HunterやChkrootkitでは、システムをスキャンし、ルートキット(不正アクセスを隠蔽するプログラム)や悪意のあるツールがインストールされていないか、ファイルのチェックサムが改ざんされていないかなどをチェックすることができます。

これらが本当に必要かどうかが問題でもありますが、必要であれば構築もできます。

## ソフトを入手する方法、名称を知る方法

一般的には各ディストリビューションが公式に提供しているパッケージを入手します。入手するにはその<u>パッケージの名称が必要</u>になります。
Arch系のディストリビューションでは`pacman`を使用します。Firefoxで言うと、`sudo pacman -S firefox`とターミナルで入力するとインターネットを介して公式のリポジトリに接続して必要なライブラリなどもダウンロードしインストールされます。

よく依存関係が壊れるなどと聞くかと思いますが、それはそのソフトに必要なライブラリ等が本来のものと違うとか、何かを削除した時に一部を一緒に削除してしまい必要なものが無くなってしまった、あるいは許容されているバージョンと違うということを意味しています。

これらインストール方法は各ディストリビューションが採用するパッケージマネージャによりますが基本は同じです。例えば、
- fedoraなら `sudo dnf install firefox`
- ubuntuなら `sudo apt install firefox`

のような感じです。ubuntuはsnapが推奨されているので`sudo snap install firefox`かも知れません。
これらはそれぞれに調べる必要がありますが、ディストリビューションによってはGUIで提供されています。

これらとは別に[Flatpak](https://flatpak.org/)([flathub](https://flathub.org/ja))や[snap](https://snapcraft.io/)、[appimage](https://appimage.org/)、各ソフトベンダーが配布しているGithubなどがあります。
例えばFlatpakであれば各ディストリビューション毎に[セットアップの方法](https://flathub.org/ja/setup)が記載されていますので参照して下さい。

名称などを調べるには、ディストリビューションのソフトウェアセンターもあります。GNOME Software([Gnome Circle](https://apps.gnome.org/ja/#circle))や、KDEなら[Dicover](https://apps.kde.org/discover/)もあります。
Webサイトですが[AlternativeTo](https://alternativeto.net/)で調べることもできます。こちらは、何かしらのソフトの代替はどういったものがあるかを調べられます。Githubの[Awesome Linux Software](https://github.com/luong-komorebi/Awesome-Linux-Software)でカテゴリ別になったリストからも調べれます。

「窓の杜」のように調べられる[SOFTPEDIA](https://linux.softpedia.com/)もありますが、ローカルにダウンロードしてインストールと手間なのであまりオススメはしません。名前を知るには良いかと思います。
他にも[Reddit](https://www.reddit.com/)のr/linux, r/linux4noobs, r/UnixPorn などで「WindowsのXXのLinux代替は？」と検索/質問すると、すぐに複数のソフト名が挙がります。

AIに聞くのも一つの方法です。

### GUIで入手する

わかっていれば圧倒的にターミナルでやったほうが手撮り早いですが、やたらターミナルを嫌う人がいるのも事実です。そう言う人達にはGUIでインストールする方法もあります。

#### ディストリビューション標準の「アプリストア」

<style>
    tr:nth-child(even) {
        background-color: initial;
    }
    td:nth-of-type(2) {color: unset;}
    td:nth-of-type(n+2) {color: unset;}
    td:nth-of-type(n+3) {color: unset;}
</style>

|デスクトップ環境|ツール名|
|----|----|
|GNOME|GNOME software|
|KDE Plasma|Discover|
|Cinammon|Software Manager|
|XFCE|GNOME Software/Pamac|

この他にもelementary OSではAppCenterというのもあります。多くの場合こういった名称で、そのパッケージがどういうものかを確認しながらインストール/アンインストールすることができます。
これらにしても内部ではShellコマンドが動作してインストールを行っていると思います。

#### ユニバーサルパッケージ形式専用のGUIツール

Flatpakがこの形式での現在最強勢力となっていて、ほとんどのディストリビューションで使用することができます。通常はターミナルからコマンドを入力するわけですが、Gnome Softwareなどにも組み込まれていてGUIで操作することができます。

Ubuntu系が強いですが、snapdが入っている環境であれば使用することができるSnapもあります。使っているものが違うだけで登録されているパッケージがFlatpakにもSnapにもあれば同じようにして導入できます。

#### 従来型のパッケージマネージャーのGUIフロントエンド（上級者向け・細かい管理に強い）

<div class="table-container">

|ツール名境|対応パッケージマネージャ|主なディストリビューション|
|----|----|----|
|Synaptic|APT (deb)|Ubuntu/Debian/Linux Mint/Debian系|
|Pamac|Pacman + AUR + Flatpak + Snap|Manjaro, EndeavourOS, Arch系|
|Octopi / Bauh|Pacman + AUR|Arch系|
|YaST|zypper (rpm)|openSUSE|
|DNFdragora|DNF|Fedora（古い。今はほとんどDiscoverに取って代わられている）|

</div>

導入するのにどれを選択して導入しするかや、どういう方法で導入するかなどが初心者向けではないですが、基本的には簡単に導入できます。ディストリビューションによっては最初から導入されているものもあります。

Arch系は普段使っているので他のものよりは少しばかりわかります。これらを導入するために`yay`あるいは`paru`を導入する必要があります。入っていればそのまま使えばよいのでまずは`paru`で試して、なければ`yay`を試しいずれもないようであれば、paruを導入することをおすすめします。paruをyayに変えればyayを導入することができます。
どちらも同じようなものであるので両方入れる必要はありません。おすすめする理由としてはparuの方が新しくわかりやすいと言うだけです。
```bash
sudo pacman -S paru
```

paruの導入ができたら、それを使用して上記表のArch系で利用できる各パッケージを導入します。
```bash
paru -S pamac-aur
```
あるいは、octopiなら、

```bash
paru -S octopi
```
等として、まずはユーザーディレクトリでパッケージのダウンロード及びビルドを行い、導入できる形にしてから`pacman`で自動的にインストールされますが、もちろんその際には管理者のパスワードが必要です。なので導入する前にArch wikiなどで現在誰がメンテナンスをしているのか、どれぐらい前に更新されたのかを確認して、またコメントが荒れてないかなども重要ですが、そういった情報を集めてから導入するようにして下さい。

#### 別の方法として

Garuda Linuxの開発グループが[Chaotic AUR](https://aur.chaotic.cx/docs)を公開しています。これらは本来ソースからビルドする必要があるものをビルド済みのバイナリパッケージとして公開していて、これらは公式パッケージマネージャでインストールが可能になります。
導入したリポジトリは上記pamacなどにも反映されて表示されるので、同じ物がある場合、入手先の名称でChaotic AURで入れれば多くの場合がバイナリでのインストールになります。
ただしこれはリポジトリが増えることになるのでチェックに少し時間がかかるようになったりなので、一長一短があることに注意して下さい。

## なぜ「不便だ」「使い方がわからない」という声が出るのか？

そこには**期待値のミスマッチ**があると思います。例えば、[DistroWatch](https://distrowatch.com/)ランキングやおすすめ記事で「一番人気」「初心者向けNo.1」と見るため、「Windowsより優れてるはず！」と高い期待を抱く人が多いのはあると思います。

> DistroWatchのページヒットランキングについて
> DistroWatch自体が 「これはページ閲覧数でしかなく、実際の使用率や人気を正確に反映しない」 と明記しています。ランキングは興味を持った人がページを訪れる回数を示す指標に過ぎません。

更には、Windows 10サポート終了（2025年10月）で、急いでLinuxに移行する人が増え、<u>事前準備不足でつまずく</u>のも考えられます。
よくあるIT系の記事のコメントを見ると、自称PC使える人がWindowsしか使ったことがないのにLinuxをちょっと入れてみて「これは使えない」という感想を述べます。するとそれを見たインストールすらしない人は「やっぱりそうか」と思うわけです。
よくRedditでも議論されていますが、こういった"使えない"と言う声は、

- 特定のハードウェア問題
- 専門ソフトの互換性
- 小さなバグ

等から来ることが多く、**全体のユーザーの中では少数派**ですが、目立つ事が言われています。

日本車しかいじったことがなく日本車に合う道具しか持っていない人が外車を購入してネジの規格が違うことで、(面倒くさい)これはダメだと思うような、大工でなんでも作れる人が外国に移住してノコギリの違い、カンナの違いに戸惑うようなそういったものが総じて「使えない」と言われている感じです。

例えばLinux MintをDistroWatchのページヒットランクを見て選んだ場合、Windowsと大きく変化がないし退屈じゃないかと言う感想があってもそれはしょうがありません。Windowsから移ってもなるべく大きな違和感を感じないように作ってあるのですから。

<u>変化がないし退屈じゃないか</u>と思うあなたにもマッチする、あるいはまだ試していないディストリビューションはあるはずです。

## まとめ

他にも色々とありますが、よくWindowsを使用している人が言う「Linuxにはソフトがない」と言うのは間違っていて、むしろ細かいものはWindows並にあるとも言えますが、主語に「<u>自分が使っているソフトは</u>」と言われると無いと言うのはその通りかも知れません。

また使い勝手が違うとか英語でわからないと言うのもあると思いますが、LinuxはWindowsと同じUIで提供されているものも多いです。
WindowsがDirectX等のAPIに依存している、むしろそれが最適化とも言えるのでそういうソフトは動きませんが((LinuxにはDirectXがないので。Wineで動くものもある))そうではないものについてはかなりの互換性を保ったまま使用できるのです。

ゲームなどの使用条件に**DirextX12以降対応**みたいなものはWineを使用したとしても動かないかも知れません。しかし現在[WinBoat](https://www.winboat.app/)のように、Linuxに専用のコンテナを作り、そこでWindowsを動かすと言ったものもでてきていて、それであればより多くのWindows用ソフトが動作するようになると思います。
まだベータ版ではあるもののソフトがOSの垣根を超えて使用できるようになる試みです。

しかし、ここまでを見てきてもらったら、**ソフトが不足していると言うわけではない**というのは理解してもらえるでしょうから、後はどこにそれがあって自分の環境で使えるのか問題だけがあって、普段遣いで困ることはありません。設定をしたりが難しいかも知れませんができるかできないかで言えば**できる**と言えるだろうと思います。

なので全部をlinuxで済ませようとしないでまずはあるジャンルから、例えば、

- 動画の編集だけ Kdenlive を使う
- 画像の編集だけ GIMP を使う
- 開発環境だけ使う

というような感じで、Windowsでも何かしながらLinuxでも他のことをするという使い方をして、それが1つ2つとLinuxで増えていき全部できるとなればその時はじめてLinuxにも移行できるのだと思います。

**リソースの消費は圧倒的に少ない**Linuxですから、(問題が起こっていなくて正常に処理できているのであれば)Windowsと同じソフトを使用した場合には快適に使用できるだろうと思います。

多くのジャンルで既に多くのソフトがありますが、それらは日本国外で作られたものがほとんどです。プログラムできる人、デザインができる人がLinux向けにソフトを作るようになればそれだけ日本語に対応した日本語環境のソフトがこれまで以上に増えるはずです。
今でもたくさんの日本人がLinuxソフトの開発に貢献していますがデスクトップアプリで日本語で作られたものが海外の言語に翻訳されるというようなものは多くはありません。今ならまだLinuxでの日本語ソフトのパイオニアになれる可能性もあります。

誰でもが作れて誰でもが改変でき、より良い品質のものが作られたり、そこから新しい発見があったりと隙間無くミチミチに詰まったWindowsのソフト事情から脱却ができると良いなと思うのです。WindowsでしかできないことはWindowsでして、それ以外にもやり方があって幅を広げると言うのが理想かも知れません。

こういう流れがもっと活発化することを願って。

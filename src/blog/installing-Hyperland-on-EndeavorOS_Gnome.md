---
title: 公式で無いなら個人でやればいいじゃない？ EndeavourOS+Gnome+hyprland
description: EndeavourOS+Gnome環境にHyprlandを導入するというのを実際に試してみた記録です
date: 2025-08-25
update: 2025-09-15
category:
  - blog
tags:
  - linux
  - Arch系
  - Hyprland
images:
  - ../img/end-4_fastfetch.avif
  - ../img/end4_desktop01.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## この記事を書くにあたっての前置き

前回紹介した[ArchRiot](../archriot)を個人的に試してみようとやってみたのですが、上流のArchサイドにも問題があるのかもしれないというのを前置きに、Arch Linux自体をインストールするのにしてもとても時間がかかったり起動してもデスクトップに入れないという問題点もあり、それなら**別の方法で試してみよう**と言うのがこの記事の内容です。

- [「Arch Linux」に対するDDoS攻撃、依然として継続中 - ZDNet](https://japan.zdnet.com/article/35237089/)
- [Arch Linuxプロジェクト、1週間にわたるDDoS攻撃に対応](https://blackhatnews.tokyo/archives/5713)

> 2025/8/27 あたりに`reflector`を試してみたら動作したので、まだ完全ではないかもしれませんが徐々に回復しているように思います。

<div class="p-8 mb-8 border-solid border-2 border-sky-500">
色々と実機でも確認しながら書いていますが環境によっては内容が異なる場合があります。注意の上、参考程度に御覧ください。
</div>

### 簡単に導入の手順を書くと

1. Arch Linuxをインストール
2. ArchRiotのようなスクリプトでHyprlandに必要なファイルを取得導入

こういうことですから、つまり、

- ベースになるArch Linuxがあって、
- 必要なファイルを入れて、
- 設定すれば良い

というだけのことなんですけども、何が必要でどういう設定をすればよいのかというのが難しいところです。

本来のインストール方法は[Hyprland - Arch WIki](https://wiki.archlinux.jp/index.php/Hyprland)などに書いてあるので興味のある方は参考にしてみて下さい。初見ならわけがわからないことばかり書いてあると思います。
一から設定したい人はArch Wikiを参照してやれば良いのですが、書いてあることは簡単でも言葉や何をしているのかがわかりにくかったりもするわけです。

## こういうのをすっ飛ばして

こまけぇことはいいんだよ、さっさと`Hyprland`とやらを触らせろという気の短い人はもっと簡単に導入する方法があります。
基本的な所は既存の設定されたディストリビューションを下地にしたらいいじゃないということなのです。

つまりは、カスタマイズの一種で、[ArchRiotのページ](../archriot)でも書きましたが**Rice**(あるいはRicing)と言うLinuxの文化があるのでそれに乗っかればいいじゃないと言うことです。

Rice自体は色んなディストリビューションで行われていますが、**Arch Linuxが最も盛んに行われています** 。元々自分で作り上げていくディストリビューションであり、ローリングリリースであるのでシステム側が常に最新に保たれる((本当の最新ではなく、更新されたのは知っているがテストしてから放流と言う感じです))ので盛んに行われて当前で、やりやすいというのもあると思います。
Ubuntu LTSは、LTS(Long Term Support)のその名の通り、安定している状態を長く使うためのディストリビューションであり、更新時期にもよりますが内容が古くなりつつあるので、Riceのように常にバグフィックスをし最新の状況を追いながら修正され続けているものは、ローリングリリースでないディストリビューションでは最新の状態を適用できない事があるわけです。
強制的にインストールする方法など色々と手はあると思いますが。

そこで、

1. Arch系のディストリビューションである**EndeavourOS+Gnome環境**を使用して
   - Gnomeを選ぶのはWaylandで動作しているからです。HyprlandはWaylandのコンポジター
2. そこに環境を作るために必要なものを追加してHyprland環境を作り、
3. それらの設定やカスタマイズを独自に変更していく

という手法で行えるのが、次の**end-4/dots-hyprland**のスクリプトです。
※ ちなみにArchRiotも同様の手法でインストールできます。ただRiceはそれぞれに環境が違うので手法は同じだとしても諸々が違うので全く同じようにはできないこともあります。

### 注意事項

> これらは、ユーザーディレクトリ以下に必要なファイルを導入してHyprland環境などを構築するので、ユーザーアカウントを増やせばそれだけ別の環境を持てるという事になります。
> しかし更に注意があり、本来は全体的に設定する方法が記載してあるものは個人的に書き直す必要があります。例えばfcitxの設定をすべての環境で使用する場合は、`/etc/environment`に設定を書きますが、ユーザー単位で書く場合は`~/.pam_environment`に書く必要があります。

これらはフォントでも同様です。すべての環境で使うフォントは`/usr/share/fonts/`もしくは`/usr/local/share/fonts/`などを使用するのが標準です。これがユーザーディレクリだと`~/.local/share/fonts/`((場合によっては~/.fonts/もあるかも知れません))が一般的です。なので導入する環境にだけ適用するなら`~/.local/share/fonts/`を使うべきですし、ログイン画面などログインする前ならシステム全体で使う`/usr/share/fonts/`に入れるのが当然となります。

#### 既にHyprlandエディションがあるディストリビューションではどうなるか

例えばCachyOSや、Garuda LinuxにはHyprlandエディションが存在しますが、それらにこれらを適用した場合にどうなるかですが、多くの場合は導入したRice環境が有効になります。
必要なパッケージの内、既に導入されているものが存在すればスキップして上書きしないような仕組みがあり、また`quick shell`を使用しているのも作者の意図としては、既存のファイルを上書きせずに追加するという意味合いがあるのではないかと想像しています。

実際の所はわかりませんが、既存の環境が必要な場合は、**ユーザーを追加してそちらにRice環境を作る**とよいかと思います。
そうすることでオリジナルの状態と、Rice環境が共存でき、ログインし直すだけでそれぞれの環境が動作すると思います。

### end-4/dots-hyprland

導入がうまく行った場合の[ShowCase](https://end-4.github.io/dots-hyprland-wiki/en/general/showcase/)

いくつかありますが、`[Qs] illogical-impulse`((illogical-impulseは略して「ii」と表記されることがあります。ディレクトリ名であったり諸々で)) を選択します。他のは詳細は知りませんが何かしらの古いバージョンです。
`Qs`はQuick shellを略したものと思われます。

> QuickShell = 「Qt/QML でデスクトップ環境の UI を自由に組めるフレームワーク」です。
> これらはタスクバーやパネル、ランチャーなどをQtのUI記述言語であるQML(Qt Modeling Language)を使用して書けます。それらを内部的にはJavascriptとC++/Qtが融合したような仕組みです。
> QtはGTKなどのように、クロスプラットフォームのアプリケーション開発フレームワークです。Qtはアプリを組み立てるための大きなツールボックスであり、その中の1つであるQMLやQtQuick(Qsの基盤になる仕組み)を使うと、シェルやランチャーなどのUIも簡単に作れるという事になります。ここで言うシェルとはガワに当たるものです。
> Qtが比較的軽いとされるのは自身で様々なモジュールをまとめて持っているためC++のネイティブコードで直接動作する(依存性が少ない)、メモリ効率も良いという点が他のものと違って軽さの秘訣になっています。つまり汎用性を持たせるために外部に頼るのではなく、自身でほぼ全てを賄っているため効率良く軽いと言えるかと。

[end-4/dots-hyprland](https://end-4.github.io/dots-hyprland-wiki/en/ii-qs/01setup/)で推奨される方法として書いてある、**「1.3 Automated installation (Arch distros only)」** にあるスクリプトをターミナルに貼り付けるだけ。

```bash
bash <(curl -s "https://end-4.github.io/dots-hyprland-wiki/setup.sh")
```
これは、`~/.cache/dots-hyprland`にリポジトリをクローンするので、もし別の場所に入れて管理したい場合は、

```shell
cd ~/Downloads # ここで任意のディレクトリを選ぶ
git clone https://github.com/end-4/dots-hyprland
cd dots-hyprland
./install.sh
```
それだけでHyprland環境に必要なものが全てインストールされます(完全ではなく必要とするものが全てです)。

<details>
<summary>音楽プレイヤーを導入するサンプル</summary>

<div>

例えば音楽プレイヤーは含まれていないので別途、Amberol、G4Music、Lollypop、Elisa、MPD＋ncmpcppなどMPRIS対応の音楽プレイヤーを導入する必要があります。
```shell
sudo pacman -S amberol  // サンプル例
```
管理人の場合は、`mpv`を導入して、更に`mpris`に対応させるために、`mpv-mpris`を導入しました。
```shell
sudo pacman -S mpv mpv-mpris
```
これでどこかのワークスペースで音楽を再生させておけばタスクバーからそれらをコントロールできるという感じになります。

</div>
</details>

後はターミナルで出てくる質問に対して「y(yes)」などの選択をしたり、たいていは<u>管理者が自分でしょうから</u>自分のパスワードを入れていくだけです。多岐に渡るインストールがあるので時間も手間もかかり面倒くさいですが、ほとんど「y」と自分のパスワードだけでいけます。最後の方に、ビルドに必要だったものとか一時ファイルの削除などを連続でしますが、ここが面倒くさいだけです。

2025/8/25のスクリプトの状態で、2025/8/26の朝に試しましたが問題なくインストールできたものの2点エラーが出ました。
1つは、`quick shell`、もう1つは`qt6-avif-image-plugin`でした。後者はプラグインなので日を改めてまた探してみることにしました((8/28にインストールできましたが、qt5-avif-image-pluginが入りました。ここはまたしばらくして調査します))が、前者の`quick shell`は根幹に関わるものであり、これが入らないとただの色付きのデスクトップとなり、ウィンドウやらは出せるわけですが、いい感じにタスクバーなどが出るわけでもなくとても困ります。

とは言え、機能はしているので、`スーパーキー(Windowsキー)+ W`でブラウザを開き、[chaotic-aur](https://aur.chaotic.cx/)を導入しました。これは<u>エラーで入らなかった`quick shell`を入れるための処置</u>なので、不要であれば通常は入れる必要はありません。

<details>
<summary>chaotic-aurの導入と再起動の方法</summary>
<div>

リンク先のページスタートから遷移したページにSetUpがあるので、
- `$ sudo...`部分にマウスカーソルを持っていけば、`Copy to ClipBoard`と出てくるのでクリックしてコピー
- コピーしたものをターミナルで貼り付けてエンターで、pacman-keyとミラーリストをダウンロードしてインストール
  - `nano`のペーストは`Ctrl + V`です

その後、
- ターミナルに、`sudo nano /etc/pacman.conf`と入れて`pacman.conf`を開く
- 開いた<u>ドキュメントの一番下</u>に、(これもマウスでコピーできますが)、`[chaotic-aur]`とある部分でコピーして、
```text
[chaotic-aur]
Include = /etc/pacman.d/chaotic-mirrorlist
```
を追加
- `nano`では、保存する際に`ctrl + o`の後、`pacman.conf`をエンターで上書き
- `ctrl + x`でnanoを終了しターミナルに戻る

その後、chaotic-aurを適用するためにターミナルで、
```shell
sudo pacman -Syu
```
と入れてシステムを更新します。

これで準備が整ったので、`quick shell`をインストールします。
```shell
sudo pacman -S quickshell
```

この後、ログアウトだけでもいけるかもしれませんが、再起動すれば適用できます。シェルが表示されてないのでターミナルから行うかPCの電源を強引に切るしか無いと思います。Quick Shellのインストールに失敗してもWinキーからターミナルは開けるはずです。
そこから再起動するために、次のコマンドを入れます。

```bash
// 再起動
sudo reboot

// or
systemctl reboot

// シャットダウン
sudo poweroff

// or
systemctl poweroff
```

もしターミナルに入れない場合は、仮想コンソールに入るという手もあります。
`ctrl + Alt + F2`～`F6`
これらが開けば前述のコマンドが使用できると思います。これは`TTY`と言います。

もし、Hypelandに問題が起きても**Gnome環境は生きているはず**ですから、再起動さえすれば修復などができる可能性はあります。それが**EndeavourOS+Gnome環境にHyprlandを適用するメリット**でもあります。

ターミナルがどうしても開けないとなるとPCの電源を長押しして終了させるしかないですが。

</div>
</details>

#### 注意点

ここでは、インストール時にエラーが出たと言う状況からのトラブルシュートみたいなもので、本来何も問題がなければ`quick shell`は入ると思うのでそのまま<u>インストーラー付属のquick shellを使用するべき</u>です。<u>別途目的がない限り`chaoticAUR`のバージョンを使用する必要はありません</u>。
というのは、開発が先行している場合に問題が出るということがあるからです。
作者が動作するとしたバージョンのものはインストール時に同時に入りますからそれらを使用しましょうということです。ひとまず動作するようにしておいて、Githubなどの更新状況を見てアップデートをして安定するようにしていくのが賢明かと思います。

## 日本語設定

> 9/7ぐらいのアップデートで、設定にja-JPの項目が出たのでキーボードの設定は必要なくなっているかも知れません。またfcitx5の設定も書かれていたような気もしますがもし実際に確認してみて、キーボードが正しく動作しないとか設定がないなどの場合に追加という感じで試してみて下さい。

キーボードを日本語配列にするために、`~/.config/hypr/custom/general.conf`に
```js
input {
    kb_layout = jp
}
```
を追加。

fcitx5((IMEのフレームワーク))の設定で、`~/.config/hypr/custom/env.conf`に
```js
# fcitx5 setting
env = QT_IM_MIDULE, wayland
```
を追加。

<details>
<summary>「GKTモジュールを検出したのでこれらを無効にしてfcitxの公式サイトにある説明を参考に修正して下さい」と通知が来たら</summary>

<div>
もし通知に「GKTモジュールを検出したのでこれらを無効にしてfcitxの公式サイトにある説明を参考に修正して下さい」というのが着たら、確認してほしい事として、

- `fcitx5-im`として導入した場合、`fcitx5-gtk`が邪魔をしている
- Plasmaが入っていた場合、`kded6`が邪魔をしている可能性があります。

ポイントとしては`sudo pacman -S fcitx5-im fcitx-mozc`((mozcがIMEに当たります))として導入する際に、<u>選択肢が3つか4つ出る</u>と思いますが、今回のものに関しては **QT系** のアプリ主体のRiceであるため、<u>選択も自ずと`QT`とつくものを選んで下さい</u>。
もちろん`GTK`のものも動作しますが、動作しないものもあります。Waylandに対応しているかどうかが重要かと思います。

もし、`fcitx5-gtk`が邪魔しているとすれば、
```shell
sudo pacman -Rns fcitx5-gtk
```
として削除できると思います。しかし、依存関係が崩れるだの依存関係があって削除できないとなった場合は、
```shell
sudo pacman -Rns fcitx5-im
```
として削除してから、`sudo pacman -S fcitx5-im`で再度インストールして`QT`を選ぶようにして下さい。

これらがどうしてもわからないとなった場合は、一旦HyprlandからログアウトしてGnomeに入り直して、`pamac`などを利用してGUIで操作するという方向も考えてみて下さい。<u>Gnomeであれはpamacが動作します。</u>

`pamac`はターミナルから、

```shell
yay -S pamac-aur
```
として導入することができます。色々種類がありますが、`pamac-aur`だけで良いかと思います。これらはインストールされた後は「**ソフトウェアの追加と削除**」として登録されます。Windowsキーか三本指でデスクトップを上にスワイプしたら出てくるリストの中にあります。
いちいち横スクロールで探さなくてもよく、「Windowsキーか三本指で上スワイプ」の後キーボードから`pam`ぐらいまで入力すれば候補が絞られます。end-4/dots-hyprlandではおそらく日本語ができず、また`pamac`でも候補が絞れないと思うので(入力ができない)のでGnomeでやります((単にpamacがこのHyprland環境で動作しないだけかも))。

</div>
</details>

## リンクを新しいタブで開くをした時にマウスカーソルが動いていない状態だと二本指スクロールができない

これはすでにissueが提出されていて、もう少し詳細を書くと、

- リンクを新しいタブで開く

とした場合に、バックグラウンドでこれらは開きますがマウスカーソルはその場に留まっているため、タッチパッドの二本指スクロールが効かないと言う感じです。
例えば、リンクがいくつかある中でAとBというリンクを比較しようと新しいタブで開こうとするということはたまにあると思いますが、Aのある位置から少し下にBがあるとして、この場合に、

1. Aのリンクを新しいタブで開く
2. 少しカーソルを動かす
3. Bのリンクまでスクロールしてリンクを新しいタブで開く

この流れであれば2番は本来不要なアクションです。

1. Aのリンクを新しいタブで開く
2. Bのリンクまでスクロールしてリンクを新しいタブで開く

これだけで良いはずなのです。「少しカーソルを動かす」と言う手間が発生しているのが問題点です。

これはおそらく修正可能ではあるだろうと思いますが、Hyprlandの処理に関することなのでユーザー側でできることはほぼなく、修正するには開発が手伝えるぐらいのスキルが必要になるかと思います。なので、修正されるのを待つしかありません。
Hyprlandではすでに修正されていて、それ以外で別の問題が発生しているのかもしれませんが。

## 日付の表示を日本語にする

### バーの日付部分

`~/.config/illogical-impulse`の中に`config.json`があるので、それを編集すると大まかな修正はできます。
下の方に`time`の箇所があるので、

```json
  "time": {
    "dateFormat": "ddd, dd/MM",
    "format": "h:mm ap",
    //...
    "shortDateFormat": "dd/MM"
  },

```
- time部分
  - ddd, dd/MM → 日, 31/08
  - 修正例： M/d(ddd) → 8/31(日)
- format部分
  - h:mm ap → 4:18 午前/午後
  - 修正例： ap h:mm → 午前/午後 4:18
- shortDateFormat部分
  - dd/MM → 31/08
  - 修正例： M/d → 8/31

などと修正します。これら修正によって、トップバーは、午後4:18・8/31(日) と表示されると思います。そこをPopUp表示させた場合、午後4:18・日曜日,8月31,2025と表示されると思います。元の英語の順番で並んでいるのよりは日本語として自然ですが、しかしまだこれだけでは足りない場合に、細かく修正するにはそれらを表示しているファイルを修正する必要があります。

#### より細かく修正する

**-end-4/dots-hyprlandの更新で修正が無くなる可能性があります。**

バーは、パッと見て今日が何日で、今が何時かわかればよいと思うので`月/日(曜日)・時:分`という形式にしたい思います。

~/.config/quickshell/ii/modules/bar/ の ClockWidget.qml をテキストエディターで編集します{class="block bg-sky-500/25 px-4"}

`// ...`部分は、何かしら記述がある部分です。

```qml
Item {
    //...
    
    RowLayout {
        // ...

        StyledText {
            // ...
            // text: DateTime.time   # コメントアウト
            text: DateTime.date
        }

        StyledText {
            // ...
            text: "・"  # セパレーター
        }

        StyledText {
            // ...
            // text: DateTime.date      #コメントアウト
            text: DateTime.time
        }
    }

    // ...
}
```
の部分だけを修正します。マウスを持っていった時にポップアップする所にも日付の表示があるのでそこも直します。

~/.config/quickshell/ii/modules/bar/ の ClockWidgetTooltip.qml を修正{class="block bg-sky-500/25 px-4"}

```qml
# ...

StyledPopup {
    id: root
    // property syting formattedDate: Qt.locale().toString(DateTime.clock.date, "dddd, MMMM dd, yyyy")  # コメントアウト
    // 変更追加
    property syting formattedDate: Qt.locale().toString(DateTime.clock.date, "yyyy年M月d日(ddd) ap h:mm")
    // ...

    function getUpcomingTodos() {
        // ...
    }

    ColumnLayout {
        // ...

        RowLayout {
            // ...

            MaterialSymbol {
                // ...
            }
            StyledText {
                // ...
                // text: `${root.formattedTime} ・ ${root.formattedDate}` # コメントアウト
                // 変更追加
                text: `${root.formattedDate}` # 出力部分
            }
        }
    }
}

```
## スクリーンショットを撮ったらどこに保存される？

どういう事かは定かではないのですが、ユーザーディレクトリ以下にある`picture`ディレクトリ、つまりは`画像`ディレクトリのパスは、`~/.config/quickshell/ii/modules/common/Directories.qml`だったかに設定があって、スクリーンショット自体はまた別で設定があるのですが、作者は`screenshotTemp`というパスを別で作っていて、そこにはフルパスが書かれています。
```qml
    property string screenshotTemp: "/tmp/quickshell/media/screenshot"
```

画像ディレクトリは、
```qml
Singleton {
    // XDG Dirs, with "file://"
    //... 他の値
    readonly property string pictures: StanderdPaths.standerdLocation(StanderdPaths.PicturesLocation)[0]
}
```
などと書かれています。

つまり、`Directories.pictures`とすれば画像パスが取れるはずが、それを設定するとユーザーディレクトリの下に`file:`と言うディレクトリができスクリーンショットの保存場所がその下に入ってしまいます。おそらく`file:///home/YOUR-NAME/画像/`とパスが得られて、その中にスクショした画像が入るような感じです。何のためにこのような仕様になっているのかはわかりませんが、これらがあるので作者が敢えて`/tmp/quickshell/media/screenshot`とハードパスを別で書いているのだろうと思うわけです。

### これらを踏まえてどう設定するか

では、他に方法はないだろうかと見てみた所、`picturs`の設定の少し下に`// Other dirs used by the shell, without "file://`という箇所があるではないですか。これは使えるので追記します。

~/.config/quickshell/ii/modules/common/Directories.qml{class="block bg-sky-500/25 px-4"}
```qml
property string screenshotDir: FileUtils.trimFileProtocol(Directories.pictures + "/screenshot")
```
と、まず`/home/YOUR-NAME/画像/screenshot/`のパスを設定しておきます。

~/.config/quickshell/ii/screenshot.qmlのパス{class="block bg-sky-500/25 px-4"}
```qml
// property string screenshotDir: Directories.screenshotTemp
property string screenshotDir: Directories.screenshotDir
```
のようにして、元の記述を念の為残しつつ、書き換えます。`screenshotDir`が2つ出てくるのでややこしいという場合は、前述のプロパティ名を他のものに変更したらそれが使用できます。

次のような感じです。

~/.config/quickshell/ii/modules/common/Directories.qml{class="block bg-sky-500/25 px-4"}
```qml
property string ssDir: FileUtils.trimFileProtocol(Directories.pictures + "/screenshot")
```
であれば、

~/.config/quickshell/ii/screenshot.qml{class="block bg-sky-500/25 px-4"}
```qml
// property string screenshotDir: Directories.screenshotTemp
property string screenshotDir: Directories.ssDir
```
のような感じにできるということです。

これらの設定が済むとどうなるかというと、`/home/YOUR-NAME/画像/`に`screenshot`ディレクトリができ、そこにこのHyprland環境でスクショしたものは保存されます。ユーザーディレクトリ以下にあるのでコピーやら何やらが便利にできると思います。
本来の意図としては、<u>スクショがどうのよりも`quickshell`がどう動作しているかのサンプルみたいな感じで書いています</u>。

## アップデートの方法

まず前提を書いておきます。
- EndeavourOS+Gnomeの環境にend-4/dots-hyprlandがインストールされていて動作している事

アップデートは通知があるわけでもない状態でやったので、実際にはアップデートの通知があるのかもしれないしないのかも知れないですが、ないとしても公式Githubで必要な更新があれば実行できます。

1. ターミナルから `cd /home/YOUR-NAME/.cache/dots-hyprland/`((YOUR-NAMEは自身のアカウント名)) としてディレクトリを移動
2. `git pull origin main` で最新の更新をダウンロード
3. `install.sh` をダブルクリックで実行して、`Yes`から更新開始
   - install.shがテキストエディターで開かれる場合は、右クリックから実行するアプリを選択できるので`kitty url launcher`にしたら実行できます((Thunarの場合))。
   - 後は、インストール時と同じようにどうするか聞かれるので`y`であったり自身のパスワード(管理者のパスワード)を入れていきます。

もし`2`の段階でエラーが出た場合は、`git reset --hard`で、ローカルでの変更を元に戻す事もできます。

## おまけ

管理人は`unbind`を覚えたので 2025/9/15 に書き直しました。`unbind`はデフォルトの該当キーバインドの設定を無効にして、`~/.config/hypr/custom/keybinds.conf`の設定だけ有効にします。

本来はHyprlandの設定をコメントアウトして、end-4/dots-hyprlandの設定で書き直すんでしょうけれどもアップデートすることで設定が無くなるのはどうするのだろうと調べてたら、ちょうどいいのを見つけたので書き直した次第です。

<details>
<summary>ターミナルをGhosttyに変更する</summary>
<div>

最初に[Ghostty](https://ghostty.org/)自体を導入する必要があります。
EndeavourOSを使用してのRice環境だとすれば、
```shell
sudo pacman -S ghostty
```
で入ると思います。起動させるためには、`~/.config/`に`ghostty`ディレクトリと、`config`ファイルが必要です。

ユーザーディレクトリ以下にあるので、ファイルマネージャーで右クリックからディレクトリとファイルを作るというのでもよいですし、ターミナルから次のようにも書けます。
```shell
mkdir -p ~/.config/ghostty
touch ~/.config/ghostty/config
```

この場合の`-p`は`parents`の略で、もし`~/.config`がない場合に作成するという事で実際は必ずありますから必要ではないものの、他のディレクトリ操作の時に親ディレクトリがなかったとしても自動で作ると考えると便利なコマンドだと思います。
さて、実際はすでにkittyで作業していると思うので、`mkdir -p ~/.config/ghostty`でディレクトリを作れば、`touch ~/.c`ぐらい、あるいはもっと早くに補完候補がでているはずです。この時に`→`キーを押せば自動的に入力されるので、いちいち`~/.config`とか面倒くさいと思いつつも、とても楽に入力できます。

`touch`はファイルを作るコマンドです。ここで要注意ですが、Ghosttyは`***.conf`ではなくて、`config`と言うファイルが必要な事に気をつけて下さい。拡張子がないので右クリックでテキストエディターを選んで開くなどが必要になったりもします。

```shell
mkdir -p ~/.config/ghostty && touch ~/.config/ghostty/config 
```
などとして、一発で書くことも可能ですが、`mkdir`は失敗するとそれ以降は実行されないので、結果的にfishの補完機能を使いつつ分けて書いても言うほどかかる時間に違いはないとも言えます。
そもそも`mkdir -p ~/.config/ghostty`が失敗することなどほぼないですが、そういった場合でも`-p`はつけておいて損はないおまじないみたいなものなので。
なければ作るし、あってもそのままなのでエラーが出るわけでもなんでもないというのもあり、かつ誰がしても同じ結果になるということが大事なわけです。

Ghosttyの設定は、各々誰かの公開されている設定を参考にしても良いと思いますし、ドキュメントを読んで独自に設定しても良いと思いますがここでは割愛させてもらいます。

これら下準備ができているとしてHyprlandの設定では、`~/.config/hypr/hyprland/keybinds.conf` の`##! Apps`の所にターミナルのキーバインドの項目があります。これはend-4/dots-hyprlandのデフォルトのものなので変更しません。

ターミナルはいくつかの起動方法が登録されていて、今回は<u>`Super + T`だとGhostty、他は元のままでkittyが起動するようにします</u>。

デフォルトの記述を参考に、`~/.config/hypr/custom/keybinds.conf`を次のような感じで追記します。
```conf
unbind = Super, T
bind = Super, T, exec, ~/.config/hypr/hyperland/scripts/launch_first_available.sh "ghostty -e fish"
```
これで`Super + T`でGhosttyがfishで起動できます。Ghosttyではこの設定でfishで起動できましたが、他のターミナルだとどうかは試してないのでわかりません。kittyのままで使っても特に問題はないので変にいじらない方が良いと言えばそうですが、どうてもGhosttyにしたい場合などに参考までに。

`-e` はexecuteで、`ghostty`だけだと`bash`が起動し、`ghostty -e fish`だと、デフォルトのシェルの代わりに`fish`を起動するというような意味になります。

</div>
</details>

<details>
<summary>デフォルトのファイルマネージャをThunarに変更する</summary>
<div>

<del>
方法としては、ターミナルの場合と同じようなことです。元の記述を参考にして、`~/.config/hypr/custom/keybinds.conf`に次のような感じで追記します。
```conf
unbind = Super, E
bind = Super, E, exec, ~/.config/hypr/hyperland/scripts/launch_first_available.sh "thunar" "nautilus" "nemo" "dolphin" "${TERMINAL}" ...
```
意味合いとしては、Thunarが入っていたらそれを使い、なければnautilus、それもなければnemoと言うことです。なので一番最初にthunarを持っていくということです。

</div>
</details>

<details>
<summary>ファイルマネージャーにThunarを選んだ場合に、動画ファイルにサムネイルが表示されない時</summary>
<div>

`tumbler`をインストールします。
```shell
sudo pacman -S tumbler
```
</div>
</details>

<details>
<summary>サムネイルが小さい</summary>

<div>
メニューの表示に拡大できるオプションがあります。
他のファイルマネージャーでは表示されていたと思いますが、Thunarはデフォルトでは動画ファイルにサムネイルが出ておらず、出ても小さいのでひと手間必要です。

</div>
</details>

## EndeavourOS+Gnome+end-4/dots-hyprlandを適用した状態レポート

![fastfetch](../img/end-4_fastfetch.avif)

状況として、
- Thinkpad T470s
- Hyprland関係なくバッテリーが使用不可となっているのでそれらの評価はできません
- 搭載メモリは8GB + 4GBの12GBです
- SSDはシリコンパワーの256GBです

画像で確認できるように、OSはEndeavourOSになっています。起動時間(UpTime)はスリープで止めていた所からスクリーンショットを撮ったのでこれだけ進んでいます。
WM部分がHyprlandになっており、正しくEndeavourOSでHyprlandが動作しているのがわかってもらえると思います。
Shellがfishであると言う点、CursorがAdwaita、Terminalがkittyなのはデフォルトでそうなります。ターミナルの文字が[Bizin Gothic NF](https://github.com/yuru7/bizin-gothic)になっているのは後で導入しました。導入はしたもののほとんど設定はしていません。

ちなみに上記画像は[Fastfetch](https://github.com/fastfetch-cli/fastfetch)の画像で、こういった細々としたものはいくつか入れました。[Localsend](https://localsend.org/ja)とか。LocalsendはファイルをWindowsから移したり、あるいはその逆であったりをするために必須ですがなんでこれを選ぶのかと言うと、Linux(Arche系)ではyayで入るので楽だからです。
```shell
yay -S localsend-bin
```
これだけですから。

### メモリ使用量

起動してしばらく何も開かずアイドリングさせて落ち着いた状態で `1.2GB` ぐらいでした。これはおそらくEndeavourOS+Gnomeをはじめ何故か`Plasma`も入ったのでそのサービスデーモンなどがバックグラウンドで動作しているためだろうと思いますが、素のGnomeだけであれば`800MB～1GB前後`だったはずなので、それらと共通利用する部分などを含めてもHyprland自体はとても軽いんだろうと思います。
よって、素のArch環境にHyprlandを入れるのが最も軽くなるんだろうと考えられますが、足りない機能を足していけば自ずと現在のGnome程度にはなりそうです。

end-4/dots-hyprlandの最新バージョンはQuickShellを使用した環境であり、それ自体はとても軽いはずですがそれだけでは足りずにGnomeやKDEのソフト(あるいはサービス)がいくつか動いていると思いますので、その分はどうしてもメモリ消費にプラスされるのではなかろうかと。しかしそれを加味してもWindowsの半分以下ですからWindowsがそれだけ余計なサービスが動作しているのがわかると思います

ブラウザ(Firefox)を動作させて10以上のタブを開いてる状態でも、2.5～3GB以下のメモリ消費量ですから一般的な使用法なら4GBあれば足りると思います。ただ開くソフトの数や、そのソフトの消費メモリを考えると**8GB(以上)はある方が良い**と思います。

### 最近どうしてHyprlandを推しているか

意味合いとしてはWindowsやGnomeでもスタック型のウィンドウマネージャーのOSでもたいして変わるものではないのですが、その<u>作業効率は圧倒的にHyprlandのタイル型の方が良く</u>、1枚だけウィンドウを開くと自動で最大になり、2枚開いたら半分になりと勝手に並ぶというのはとても使い勝手が良いです。

ただ並ぶだけではなく、それらはもちろん並べ替えられるわけですが、例えばブラウザを開いてる状態で横に音楽プレーヤーや、動画を出すという場合はもちろん上下、あるいは左右半分ずつにできるわけです。
左右半分にした場合、左側に動画プレーヤーを置いたとすると、最近は縦型の動画もありつつもだいたいは16:9の横長ですから動画プレーヤーの下に余計なスペースがあるので、ここにファイルマネージャーを置いてみたりとか、そのレイアウトはウィンドウの動かし方で様々に配置できます。

最初からワークスペース(仮想デスクトップ)が複数用意されているので、それぞれに画面いっぱいのアプリを開いて別で作業もできますし、その切替もスワイプでも`Win + num`で簡単に切り替えれたりで、その動作が軽いのが効率を上げます。

一番良いのはフォーカスが当たっているウィンドウをダイレクトに操作できるのがよいです。つまりマウスカーソルあるいはフォーカスがあるウィンドウがアクティブなのでいちいち選択せずともペーストができたりと言うことを意味しています。

これはマウスで「ウィンドウの上にカーソルが入ればアクティブにする」という設定自体はスタック型でもあります。しかし大きいウィンドウの下に隠れた小さいウィンドウを選ぶためには`alt/win + tab`などで切り替える必要があります。

タイル型であれば重ねるということもできつつも、基本は平面に並べるわけですから、切り替えて何かしら作業するというのがとても簡単です。マウスで移動させてウィンドウを選ぶということをしなくても、`win + 矢印`でその方向のウィンドウに切り替わります。上下や左右に並べてるウィンドウでそれぞれ関連する作業は特に効率よくできます。

アクティブなウィンドウを`win + d`で最大画面に即切り替えられるので、最大表示していないと面倒な作業もすぐにでき、トグル操作になっているので、再度`win + d`で元の位置に戻ります。

つまり最小化してタスクバーに置いておくのではなく、常に切り替えて作業できるわけです。ブラウザで何かしら見ながらメールを書くとか、AIに質問した回答を参考に何かをするとかも効率が良いです。

従来のスタック型でも同じことはできると思いますが、全く別物な挙動を見せます。Hyprlandはアニメーションも加えつつウィンドウが動作するので小気味よく操作できるのも良いです。
ただ、nVidiaなどのGPUが搭載されているPCで使うには色々と問題があったりします。((判明している問題点の多くは改善されています))これらは技術仕様が一般に公開されていないのでそれらに対応させるのがどうしてもオープンソースのドライバーなどに比べると遅れます。

おそらくそれらGPUを使用した方がより良いのには間違いなく、ローカルでAIを無尽蔵に動かすにも良いGPUがいるわけですが、残念ながら完璧に動作できるかは何とも言えない部分も多く、WaylandもHyprlandも比較的新しいものですからもう少し時間がかかりそうです。
IntelにしてもAMDにしても内蔵GPUに関しては問題なく動作するだろうと思います。

ちなみに、end-4/dots-hyprland では、ローカルでAIを動作させる仕組みが導入されています。
![end4_desktop01.avif](../img/end4_desktop01.avif)

いくつかのRiceはnVidiaなどのGPUにも対応したというものもありますが、必ずしも保証されているものではないのでそれらは誰かの報告を待つか、自らが人柱になるか、自分次第です。

## 参考動画

これら動画でどういったものであるかを確認してみて下さい。

<div class="ytgrid grid grid-cols-1 md:grid-cols-2 auto-rows-auto">

{ytp::https://youtu.be/RPwovTInagE::My virginity defense ft. Quickshell (illogical-impulse showcase, July 2025)}
{ytp::https://youtu.be/OnxU419vnts::THE FRESH ARCH LINUX HYPRLAND SETUP 2025 (Ft. END 4 MATERIAL 3 THEME )}
{ytp::https://youtu.be/EKCx6z8Yizk::ML4WからEnd4 Hyprlandに切り替えて自分のものにしました(オートダビング版)}
{ytp::https://youtu.be/WARUq1sFyAI::You Gotta Try These Dotfiles? End-4 | Hyprland}

</div>
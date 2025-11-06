---
title: illogical-impulseを適用したEndeavourOS+Gnome環境にイコライザーを入れてみよう
description: PCで作業をする場合には何かしら音楽を聞いたりしたりするものです。より良い音でそれらを行うためのイコライザーを設定しようという話です
date: 2025-10-16
update: 2025-11-06T04:09:31.451Z
category:
  - blog
tags:
  - linux
  - Arch系
  - Hyprland
images:
  - ../img/easyeffects.avif
  - ../img/easyeffects_official_preset.avif
  - ../img/easyeffects_device_config.avif
  - ../img/easyeffects_right_panel.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

![EasyEffects](../img/easyeffects.avif)

## 最初に確認

EndeavourOSは、**PipeWire**という主にオーディオとビデオのストリーム処理するフレームワークを採用しています。これは主に音声の録音・再生、ビデオのキャプチャ・出力、ルーティングを低遅延で扱うためのサーバーとして設計されています。

通常は、既に入っているはずですがこれが入っていない場合などもありまして、念のための確認として。
EndeavourOSでは`pipewire`、`pipewire-alsa`、`pipewire-jack`、`pipewire-pulse` の4つが主要なパッケージとなっているのでこれらをインストールします。

```bash
sudo pacman -S pipewire pipewire-alsa pipewire-jack pipewire-pulse
```

これですべてが入ります。既に入っていた場合は再インストールされるか、スキップされると思います。

インストールされた後、<u>サービスを有効化する必要があります</u>。これもおそらくはインストールしたら有効化されていると思うのですが、念の為に。

```bash
systemctl --user enable --now pipewire.service pipewire-pulse.service
```

これらが設定されているかを確認するために、以下のコマンドで情報を見ておきます。

```bash
pactl info
```

表示された情報から、`Server Name:`が`PulseAudio (on PipeWire 1.4.9)`((バージョンは更新されれば変わると思います))と言うような表示があれば成功です。

## イコライザーを導入する

illogical-impulseのHyprlandの設定で、execs.conf(`~/.config/hypr/hyprland/execs.conf`)に、`easyeffects`とあるのに気づかれてる方もいるかも知れません。これがいわゆるイコライザーなどの設定をするプログラムで、以前は`pulseEffects`と言われていたものだと思います。これらはPipeWire対応に特化してEasyEffectsにリネームされたと記憶しています。
EndeavourOSもPipeWireがデフォルトなのでEasyEffectsを入れるのが最も安定した方法と考えられます。よって、EasyEffectsをインストールします。

```bash
sudo pacman -S easyeffects
```

EasyEffectsの起動は、`Superキー`(windowsキー)でメニューを開いて、easyあたりまで入力すれば起動できます。
しかしこのままだとプリセットは何も無い素の状態なので[公式Github](https://github.com/JackHack96/EasyEffects-Presets)からプリセットを導入します。

### プリセットの導入

インストールはターミナルから以下のスクリプトを動作させます。

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/JackHack96/PulseEffects-Presets/master/install.sh)"
```

![公式プリセット選択](../img/easyeffects_official_preset.avif)

起動させると、どのプリセットをインストールするかを聞いてくるので数字で選択します。ここから、`Perfect EQ Preset`をインストールしたとします。

EasyEffectsのウィンドウ左上にある`プリセット`でローカルにインストールされたプリセットを選ぶわけですが、ここまでの手順でやると`Linux Studio Plugins`というのが不足しているとなります。Flatpakでインストールすると全部入っているようですが、順番にすると不足しているので、それらもインストールします。

```bash
sudo pacman -S lsp-pligins
```

どこから入れるかを聞かれると思いますが、デフォルトの`1`で良いのではなかろうかと思います。これはやや重く、25MBちょっとありますのでテザリングなどよりはWi-Fiに繋いでが良いでしょうか。

`Linux Studio Plugins`を導入すると、公式プリセットで設定された内容が正しく動作します。<u>これらが**なくても**イコライザーの設定はオリジナルで作成可能</u>で、`Linux Studio Plugins`はそれら以外のリバーブ(残響)やコンプレッサー(音圧調整)、ノイズサプレッション(ノイズ除去)などの<u>イコライザー以外</u>の高度なエフェクトを使うために必要なだけですので、それらが不要であれば導入する必要なく、個人で好きな音質にイコライザーで調整していけます。

#### Flatpakで導入する

次のコマンドで導入できます。

```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub com.github.wwmm.easyeffects
```

> --if-not-existsの記載通り、入ってなかったらflatpakが導入され、もし導入されていたらスキップされるので、既にflatpakを導入している場合は上記最初の行は不要です
> またEasyEffects公式のWikiページの情報が更新されておらず、上記の2行目のリンクが間違っていましたのでflathubのリンクに合わせて修正しました。2025/10/18

現在ご覧になってるこの記事は、<u>Arch系のディストロでの記事なので関係ない</u>ですがUbuntuではFlathubからインストールしようとすると、「could not unmount revokefs-fuse filesystem」エラー（revokefs-fuseファイルシステムのアンマウント失敗）が発生し、インストールが中断するという報告があるので注意してください。
これら問題はパッチがリリースされており、apparmor 5.0.0~alpha1-0ubuntu8.1の更新で解決すると言われています。→ [Updated: Flatpak Doesn’t Work in Ubuntu 25.10, But a Fix is Coming](https://www.omgubuntu.co.uk/2025/10/flatpak-broken-ubuntu-25-10-apparmor-bug)

Flatpak版を入れると依存プラグイン(Linux Studio Plugins for EqualizerやDeep Noise Remover)が自動的に導入され、全機能がすぐに利用可能になる利点があります。
しかしこれらは全ての依存関係が最新と言うわけではなく古いライブラリが同梱されている場合もあり、最初から全機能が使えるのは便利ですがファイルサイズの肥大にも繋がるため、Arch系ディストロは`pacman`を用いて必要なものを順番に導入していくのが最も良い方法だと思います。

### 再起動しても設定がそのまま続くか

最初に書いた「**illogical-impulseのHyprlandの設定で、execs.conf…**」の部分から既にEasyEffectsは次回起動時にバックグラウンドで起動するようになっています。しかし、設定した内容が起動しない場合は、EasyEffectのウィンドウの左上、`プリセット`とある右側にアイコンがありますが、ここが`Off`になってる可能性があるので`On`にしておけば次回も効果のあるまま起動するはずです。

デバイスごとの自動ロードも可能です。特定のデバイス、例えばUSBヘッドセットや、Bluetoothスピーカーが接続された時に自動で起動する設定も可能です。各デバイスの有効/無効はメイン画面内でも可能です。
これらを確認して最適な設定で音楽などが再生されるように設定して下さい。

![各デバイスの設定](../img/easyeffects_device_config.avif)

<div class="mb-4 md:float-right ml-4">

![右パネルアイコン](../img/easyeffects_right_panel.avif)

</div>

EasyEffectsはインストールされて動作し始めると、右サイドパネル上部にあるアイコンに追加され表示されます。ここから右クリックでEasyEffectsの設定ができるようになっています。<u>上部パネルではなく右サイドパネルです</u>。

このサイドパネルにあるEasyEffectsのアイコンはクリックするとoffになり、EasyEffectsのウィンドウ左側上部にあるOn/Offアイコンの動作と連動しているように思います。
音楽を再生中にサイドパネルのアイコンをoffにすると`MPV`の場合は停止して、再度MPVを再生するとEasyEffectsのエフェクトが効いていない状態で再生されました。Onにするとエフェクトがかかって再生されるのを確認しました。

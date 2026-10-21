---
title: Dank Material Shellがバージョン2.0となり名称がDux Shellに変更されました
description: プロジェクト全体も「Dank Linux」から Dux Labs へと改称されています。
date: 2026-10-21
update: 2026-10-21
category:
  - blog
tags:
  - Arch系
  - Linux
  - DankMaterialShell
images:
  - ../img/settings-dark.avif
  - ../img/dash-dark.avif
  - ../img/dfiles.avif
layout: post.njk
permalink: /blog/{{ page.fileSlug }}/
---

## v2.0に伴い、DMSからDux Shell(コードネーム：Heisenberg)になりました

### 名前変更について

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


### アップデート、従来のコマンドについて

基本的には従来通り新しい dms-shell が配布されたらアップデートされるはずですが、新規インストールスクリプトはプロジェクトの変更に伴い変更されています。

```bash
curl -fsSL https://install.duxlabs.dev | sh
```

`dms`コマンドは変更されておらずそのまま使用できるとのことです。

## まとめ

実際にはまだ試していないので、試してみてから、あるいは詳細が判明した段階でまた書いていこうかと思います。
公式ドキュメントを見ていると、MangoWnのconfig(設定)などが、

```bash
exec-once=wl-paste --type text --watch cliphist store
```

と記載されていることから、まだMangoWMの新しいバージョンへの対応はされていないのではなかろうかと見られる部分もあります。
MangoWM新しい設定では`-`(ハイフン)から`_`(アンダーバー)に変わっているものもあり、修正されているのであればドキュメントも当然変更されていると思いますが、それらはないので。

また、v1.6+の段階で日本語入力に不備があるという旨を現在報告中です([PR #3817](https://github.com/duxlabs-dev/dux-shell/issues/3817))。
これらがどうなっているのかは実際に`dms-shell`が配布されて、試してみてからでしかわかりません。もちろんインストールスクリプトを使用したら新しくはなると思いますが配布されたものでどうなるかを試したいので。

実際、パッチを当てて直すというよりは、DMS(現Dux)はマルチランゲージ対応でもあるので、それなら一からキー入力周りを刷新してほしいとすら思っていました。
しかし、メジャーバージョンアップなので、そのあたりにも手が加わっている可能性は捨てきれません。実際には試してみないとわからないのですが、問題を残したままメジャーバージョンアップされている可能性もあります。

ひとまずは、わかるところから追記という形で編集していこうかと思います。

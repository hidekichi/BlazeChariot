// CSS を Vite のパイプライン経由で読み込む。
// <link> タグではなく import にすることで Vite のモジュールグラフに登録され、
// 編集時に CSS HMR（ページリロードなしの差し替え）が正しく機能する。
import '../css/styles.css';

// アプリケーションのスクリプト
import '../scripts/scripts.js';

export function copyButton() {
  // URLに 'blog' が含まれる場合のみ実行
  if (!window.location.href.includes('blog')) {
    return;
  }

  // 対象のpre要素をすべて取得
  const codeBlocks = document.querySelectorAll('.body-copy pre[class*="language-"]');

  if (codeBlocks.length === 0) {
    return; // コードブロックがない場合は何もしない
  }

  // 各pre要素にコピーボタンを追加
  codeBlocks.forEach(function(pre) {
    // ボタンを作成
    const copyButton = document.createElement('button');
    copyButton.classList.add('copyButton');
    copyButton.setAttribute('aria-label', 'コードをコピー');
    copyButton.setAttribute('title', 'コードをコピー');

    // preをrelativeに設定（ボタンの位置基準）
    pre.style.position = 'relative';

    copyButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <use href="#tabler-copy-plus"></use>
      </svg>
    `;

    // ボタンをpreに追加
    pre.appendChild(copyButton);

    // クリックイベント
    copyButton.addEventListener('click', function() {
      // code要素内のテキストを取得（spanタグやコメントを除去）
      const code = pre.querySelector('code');
      if (!code) return;

      const textToCopy = code.innerText; // これでプレーンテキストだけ取れる

      // Clipboard APIでコピー
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // 成功: ボタンテキストを変更してフィードバック
          copyButton.innerHTML = `
	          <svg viewBox="0 0 24 24">
	            <use href="#tabler-copy-check-filled"></use>
	          </svg>
	        `;
          copyButton.classList.add('copied');

          setTimeout(function() {
          	copyButton.innerHTML = `
              <svg viewBox="0 0 24 24">
                <use href="#tabler-copy-plus"></use>
              </svg>
            `;
           copyButton.classList.remove('copied');
          }, 2000);
        })
        .catch(err => {
          // エラー: フォールバック（例: promptでコピー案内）
          console.error('Copy failed: ', err);
        });
    });
  });
};

export async function copyButton() {
  if (!window.location.href.includes('blog')) return;

  const codeBlocks = document.querySelectorAll('.body-copy pre[class*="language-"]');

  codeBlocks.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;

    // 1. 最初の行が skip-copy コメントかチェック
    const firstLine = code.innerText.split('\n')[0].trim();
    const isSkipComment = firstLine.startsWith('# skip-copy') ||
                          firstLine.startsWith('// skip-copy') ||
                          firstLine.startsWith('<!-- skip-copy -->'); // HTMLコメントも対応可

    if (isSkipComment) {
      // 表示からコメント行を削除（Prismのspan構造を考慮）
      let current = code.firstChild;
      let foundComment = false;

      while (current) {
              if (current.nodeType === Node.ELEMENT_NODE) { // <span class="token comment"> など
                const text = current.innerText.trim();
                if (text.startsWith('# skip-copy') ||
                    text.startsWith('// skip-copy') ||
                    text.startsWith('<!-- skip-copy -->')) {
                  current.remove();
                  foundComment = true;
                  break; // 最初のコメントだけ削除（複数行は考慮外）
                }
              }
              current = current.nextSibling;
            }

      // 削除後に空の先頭改行が残りがちなので、最初の空テキストノードも掃除
      if (foundComment) {
              current = code.firstChild; // 再スキャン
              while (current) {
                if (current.nodeType === Node.TEXT_NODE) {
                  // テキストノードの空白をtrim
                  current.textContent = current.textContent.replace(/^[\s\n\r]+/, '');
                  if (!current.textContent.trim()) {
                    // 空になったら削除
                    const next = current.nextSibling;
                    current.remove();
                    current = next;
                    continue;
                  }
                } else if (current.nodeType === Node.ELEMENT_NODE && !current.innerText.trim()) {
                  // 空spanも削除
                  const next = current.nextSibling;
                  current.remove();
                  current = next;
                  continue;
                } else {
                  // 非空ノードが出たら終了（削除しすぎない）
                  break;
                }
                current = current.nextSibling;
              }
            }

      // ボタン追加をスキップ
      return;
    }

    // ここまで来たら skip ではない → ボタン追加
    if (pre.querySelector('.copyButton')) return;

    pre.style.position = 'relative';

    const copyButton = document.createElement('button');
    copyButton.classList.add('copyButton');
    copyButton.setAttribute('aria-label', 'コードをコピー');
    copyButton.setAttribute('title', 'コードをコピー');
    copyButton.innerHTML = `
       <svg viewBox="0 0 24 24">
         <use href="#tabler-copy-plus"></use>
       </svg>
     `;

    pre.appendChild(copyButton);

    copyButton.addEventListener('click', async () => {
      // クリック時はもうコメントがないのでシンプルにコピー
      try {
        await navigator.clipboard.writeText(code.innerText.trim());
        copyButton.innerHTML = `
	          <svg viewBox="0 0 24 24">
	            <use href="#tabler-copy-check-filled"></use>
	          </svg>
	        `;
        copyButton.classList.add('copied');
        setTimeout(() => {
        copyButton.innerHTML = `
           <svg viewBox="0 0 24 24">
             <use href="#tabler-copy-plus"></use>
           </svg>
         `;
        copyButton.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('コピーに失敗しました', err);
      }
    });
  });
}

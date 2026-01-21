export async function copyButton() {
  if (!window.location.href.includes('blog')) return;

  const codeBlocks = document.querySelectorAll('.body-copy pre[class*="language-"]');

  codeBlocks.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code || pre.querySelector('.copyButton')) return;

    // 1. スキップ判定とDOMクリーニング
    // 最初のノードを取得
    let firstNode = code.firstChild;
    if (!firstNode) return;

    // Prism.jsはコメントを <span> で囲むことがあるため textContent で判定
    const isSkip = firstNode.textContent && firstNode.textContent.includes('skip-copy') || firstNode.textContent.includes('skipCopy');

    if (isSkip) {
      // 2. コメントノードとその直後の改行を削除
      const nextNode = firstNode.nextSibling;
      firstNode.remove();

      // 改行テキストノードがあれば、最初の改行だけ削除して詰める
      if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
        nextNode.textContent = nextNode.textContent.replace(/^\r?\n/, '');
      }
      return; // ボタンは作らず終了
    }

    // 3. 通常のコードブロックにはボタンを設置
    setupCopyButton(pre, code);
  });
}

function setupCopyButton(pre, code) {
  pre.style.position = 'relative';

  const button = document.createElement('button');
  button.className = 'copyButton';
  button.setAttribute('aria-label', 'コードをコピー');
  button.innerHTML = `<svg viewBox="0 0 24 24"><use href="#tabler-copy-plus"></use></svg>`;

  pre.appendChild(button);

  button.addEventListener('click', async () => {
    try {
      // innerText は HTML タグを除去した「見えている文字」だけを取得する
      const text = code.innerText.trim();
      await navigator.clipboard.writeText(text);

      toggleIcon(button, true);
      setTimeout(() => toggleIcon(button, false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  });
}

function toggleIcon(button, isCopied) {
  const iconId = isCopied ? '#tabler-copy-check-filled' : '#tabler-copy-plus';
  button.innerHTML = `<svg viewBox="0 0 24 24"><use href="${iconId}"></use></svg>`;
  button.classList.toggle('copied', isCopied);
}

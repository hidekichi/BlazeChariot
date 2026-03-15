export function toc() {
  const toc = document.getElementById("toc");
  if (!toc) return;

  const sidebar     = document.querySelector(".sidebar");
  const backdrop    = document.querySelector(".backdrop");
  const panelSwitch = document.querySelector(".sidebar .panel-switch");
  const tocMenu     = document.querySelector("#toc .toc_menu");
  if (!tocMenu) return;

  // ── 1. 見出し収集 ─────────────────────────────────────────────────────────
  const headers = Array.from(
    document.querySelectorAll(".body-copy > :is(h1, h2, h3, h4, h5, h6)")
  );
  headers.forEach((h, i) => {
    h.dataset.id = i;
    if (!h.id) h.id = `header-${i}`;
  });

  // ── 2. メタデータ構築（h4-h6 の親 h3 を特定）────────────────────────────
  const metas = headers.map((h, i) => ({
    el:       h,
    level:    +h.tagName[1],
    index:    i,
    parentH3: null,
  }));

  {
    let cur3 = null;
    metas.forEach(m => {
      if (m.level < 3)   cur3 = null;
      if (m.level === 3) cur3 = m.index;
      if (m.level > 3)   m.parentH3 = cur3;
    });
  }

  // ── 3. DOM 構築 ───────────────────────────────────────────────────────────
  const dom = {};

  metas.forEach(({ el, level, index, parentH3 }) => {
    const row = document.createElement("div");
    row.className = `level-${level}`;
    row.dataset.index = index;

    const label = document.createElement("span");
    label.className = "toc-label";
    label.textContent = el.textContent;
    row.appendChild(label);

    if (level === 3) {
      // シェブロンは子要素の有無を確認後に付与するため、ここでは childrenEl だけ作る
      const childrenEl = document.createElement("div");
      childrenEl.className = "toc-children";
      childrenEl.hidden = true;

      dom[index] = { row, childrenEl };
      tocMenu.appendChild(row);
      tocMenu.appendChild(childrenEl);

    } else if (level > 3 && parentH3 !== null && dom[parentH3]) {
      dom[index] = { row };
      dom[parentH3].childrenEl.appendChild(row);

    } else {
      dom[index] = { row };
      tocMenu.appendChild(row);
    }
  });

  // ── [Fix 1] 子要素なし h3 のシェブロンを付与しない ───────────────────────
  // DOM 構築完了後に childrenEl の中身を確認し、
  // 子がある h3 にだけシェブロンを追加、子がない場合は childrenEl ごと除去する
  metas.filter(m => m.level === 3).forEach(m => {
    const d = dom[m.index];
    if (!d?.childrenEl) return;

    if (d.childrenEl.children.length === 0) {
      // 子なし → childrenEl を DOM から除去し、折りたたみ機能を無効化
      d.childrenEl.remove();
      delete d.childrenEl;
    } else {
      // 子あり → シェブロンボタンを追加
      const chevron = document.createElement("button");
      chevron.className = "toc-chevron";
      chevron.type = "button";
      chevron.setAttribute("aria-label", "セクションを開閉");
			chevron.setAttribute("aria-expanded", "false");
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			const iconId = "#arrow-open-right";
			use.setAttributeNS(null, 'href', iconId);
	    svg.setAttributeNS(null, 'role', 'img');
	    svg.setAttributeNS(null, 'width', '13.35px');
			svg.setAttributeNS(null, 'height', '13.35px');
			svg.appendChild(use);
			chevron.appendChild(svg);
      d.row.appendChild(chevron);
    }
  });

  // ── 4. 状態管理 ───────────────────────────────────────────────────────────
  let activeH3 = null;
  const userPinned = new Set();

  function isOpen(h3Index) {
    return h3Index === activeH3 || userPinned.has(h3Index);
  }

  function applyH3Display(h3Index) {
    const d = dom[h3Index];
    if (!d?.childrenEl) return;
    const open = isOpen(h3Index);
    d.childrenEl.hidden = !open;
    d.row.classList.toggle("toc-open", open);
    d.row.querySelector(".toc-chevron")?.setAttribute(
      "aria-expanded", open ? "true" : "false"
    );
  }

  function applyAllH3() {
    metas.filter(m => m.level === 3).forEach(m => applyH3Display(m.index));
  }

  // ── [Fix 2] TOC 高さ判定：全展開した高さが 70vh 以下なら最初から全開 ────
  // 一時的に全 childrenEl を表示して scrollHeight を計測し、元に戻す
  {
    const h3WithChildren = metas.filter(
      m => m.level === 3 && dom[m.index]?.childrenEl
    );
    h3WithChildren.forEach(m => { dom[m.index].childrenEl.hidden = false; });

    const fullHeight = tocMenu.scrollHeight;
    const threshold  = window.innerHeight * 0.7;

    h3WithChildren.forEach(m => { dom[m.index].childrenEl.hidden = true; });

    if (fullHeight <= threshold) {
      // 全展開してもコンパクト → 全 h3 を userPinned に追加（常時展開）
      h3WithChildren.forEach(m => userPinned.add(m.index));
    }
    // fullHeight > threshold の場合は userPinned を空のままにし、
    // アクティブな h3 だけが開くデフォルト折りたたみ状態を維持する
  }

  // ── 5. イベント ───────────────────────────────────────────────────────────
  metas.forEach(m => {
    const d = dom[m.index];
    if (!d) return;

    // 行クリック → 見出しへスクロール
    d.row.addEventListener("click", () => {
      m.el.scrollIntoView({ block: "start" });

      const cleanup = () => {
        sidebar?.classList.remove("active");
        backdrop?.classList.add("hidden");
        if (panelSwitch) panelSwitch.ariaExpanded = "false";
        window.removeEventListener("scrollend", cleanup);
      };
      "onscrollend" in window
        ? window.addEventListener("scrollend", cleanup)
        : setTimeout(cleanup, 600);
    });

    // h3 シェブロンクリック → 手動開閉（スクロールは発生させない）
    if (m.level === 3 && d.childrenEl) {
      d.row.querySelector(".toc-chevron")?.addEventListener("click", e => {
        e.stopPropagation();
        if (m.index === activeH3) return; // アクティブ中は閉じられない
        userPinned.has(m.index)
          ? userPinned.delete(m.index)
          : userPinned.add(m.index);
        applyH3Display(m.index);
      });
    }
  });

  document.querySelector("#toc .toc_sitetitle")?.addEventListener("click", () => {
    window.scroll({ top: 0 });
  });

  // ── 6. スクロール追跡 ────────────────────────────────────────────────────
  const visibleSet = new Set();
  let activeIdx  = -1;
  let rafPending = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const i = +e.target.dataset.id;
      e.isIntersecting ? visibleSet.add(i) : visibleSet.delete(i);
    });
    scheduleUpdate();
  }, {
    rootMargin: "-5% 0px -65% 0px",
    threshold: 0,
  });
  headers.forEach(h => observer.observe(h));

  window.addEventListener("scroll", scheduleUpdate, { passive: true });

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => { rafPending = false; update(); });
  }

  function getCurrentIndex() {
    if (visibleSet.size > 0) return Math.min(...visibleSet);

    const snapY = window.scrollY + 80;
    let best = -1;
    for (const h of headers) {
      if (h.getBoundingClientRect().top + window.scrollY <= snapY) {
        best = +h.dataset.id;
      } else {
        break;
      }
    }
    return best;
  }

  function update() {
    const newIdx = getCurrentIndex();
    if (newIdx === activeIdx) return;
    activeIdx = newIdx;

    metas.forEach(m => {
      dom[m.index]?.row.classList.toggle("active", m.index === newIdx);
    });

    let newH3 = null;
    if (newIdx >= 0) {
      const m = metas[newIdx];
      if (m.level === 3)    newH3 = newIdx;
      else if (m.level > 3) newH3 = m.parentH3;
    }

    if (newH3 !== activeH3) {
      activeH3 = newH3;
      applyAllH3();
    }
  }

  // 初期描画
  applyAllH3();
  update();
}

export function addToToc(id, title) {
  const toc = document.getElementById("toc");
  const link = document.createElement("a");
  link.href = `#${id}`;
  link.textContent = title;
  const listItem = document.createElement("li");
  listItem.appendChild(link);
  toc.querySelector("ul").appendChild(listItem);
}

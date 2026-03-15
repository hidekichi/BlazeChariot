// panel
export function initPanelSwitch() {
	const panelSwitch = document.querySelector(".sidebar .panel-switch");
	if (!panelSwitch) return;

	const sidebar = document.querySelector(".sidebar");
	const backdrop = document.querySelector(".backdrop");

	panelSwitch.addEventListener("click", () => {
		const pressed = panelSwitch.ariaExpanded === "true";
		panelSwitch.ariaExpanded = pressed ? "false" : "true";
		sidebar.classList.toggle("active", !pressed);
		backdrop.classList.toggle("hidden", pressed);
	});

	backdrop.addEventListener("click", () => {
		panelSwitch.ariaExpanded = "false";
		sidebar.classList.remove("active");
		backdrop.classList.add("hidden");
	});
}

// Mark updates within the last two weeks
export function updateMarkLast2weeks() {
	const today = new Date();
  // 14日前
  const limit = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  document.querySelectorAll(".listing .post_update").forEach(postUpdate => {
    // 更新済み（.separatorあり）かチェック
		let lastTime;
		if (postUpdate.querySelector(".separator")) {
			lastTime = postUpdate.querySelector("time:last-of-type");
		} else {
			lastTime = postUpdate.querySelector("time");
		}

		if (!lastTime) return;

		const updateDate = new Date(lastTime.getAttribute("datetime"));

    // 比較（ISO形式なら new Date() で正しくパースされます）
    if (updateDate >= limit) {
      // 一番近い親の記事要素を探して ★ を表示
      const badge = postUpdate.querySelector(".isUpdate");
			if (badge) badge.classList.add("show");
    }
  });
}

//add load lazy
export function insertLoadlazy() {
	const images = document.querySelectorAll("img");
	images.forEach((img) => {
		if (!img.getAttribute("loading")) {
			img.setAttribute("loading", "lazy");
		}
	});
}

// SVGアイコン生成を共通化
function createSvgIcon(iconId, className) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS(null, 'href', iconId);
    svg.setAttributeNS(null, 'role', 'img');
    svg.setAttributeNS(null, 'width', '13.35px');
    svg.setAttributeNS(null, 'height', '13.35px');
    svg.classList.add(className);
    svg.appendChild(use);
    return svg;
}

// サイト固有の設定をデータとして定義
const SITE_CONFIGS = [
    {
        test: (href) => href.includes('amzn.to/'),
        iconId: '#icon-amazon',
        className: 'amazon',
        title: 'Amazonへのリンクです',
    },
    {
        test: (href) => href.includes('github'),
        iconId: '#icon-github',
        className: 'github',
        title: 'GitHubへのリンクです',
    },
];

export function isExternalLink(url) {
    if (!/^https?:\/\//.test(url)) return false;
    return !url.startsWith(window.location.origin);
}

export function externalLink() {
    const links = document.querySelectorAll('.body-copy a');
    if (!links.length) return;

    links.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || !isExternalLink(href)) return;

        link.setAttribute('target', '_blank');

        // Setを使うことで重複を簡潔に防ぐ
        const relValues = new Set((link.getAttribute('rel') || '').split(' ').filter(Boolean));
        relValues.add('noopener');
        relValues.add('noreferrer');
        link.setAttribute('rel', [...relValues].join(' '));

        const wrapper = document.createElement('span');
        wrapper.className = 'external-link-wrapper';
        wrapper.style.position = 'relative';
        link.parentNode.insertBefore(wrapper, link);
        wrapper.appendChild(link);

        // サイト固有アイコン（一致した最初の設定のみ適用）
        const siteConfig = SITE_CONFIGS.find((config) => config.test(href));
        if (siteConfig) {
            link.setAttribute('title', siteConfig.title);
            link.appendChild(createSvgIcon(siteConfig.iconId, siteConfig.className));
        }

        // 外部リンクアイコンは常に追加
        wrapper.appendChild(createSvgIcon('#icon_external-link', 'icon_external-link'));
    });
}

export function credit() {
	const pageCredit = document.querySelector('footer .credit');
	const year = new Date().getFullYear();

	pageCredit.innerText = pageCredit.textContent.replace(/2025/g, `2025 - ${year}`);
}

export function stickyTable() {
    const tableContainers = document.querySelectorAll('.table-container');
    if (!tableContainers.length) return;

    const checkOverflow = (container) => {
        const table = container.querySelector('table');
        if (!table) return;
        table.classList.toggle('active', table.offsetWidth > container.offsetWidth);
    };

    tableContainers.forEach(container => {
        checkOverflow(container);

        const observer = new ResizeObserver(() => checkOverflow(container));
        observer.observe(container);
    });
}

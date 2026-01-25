export function toc() {
	//const toc = document.querySelector("#toc");
	const toc = document.getElementById("toc");

	if (!toc) return;

	const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".backdrop");
  const panelSwitch = document.querySelector(".sidebar .panel-switch");

	const headers = document.querySelectorAll(
		".body-copy > :is(h1, h2, h3, h4, h5)"
	);
	//const commentsSection = document.getElementById("comments");
	const tocMenu = document.querySelector("#toc .toc_menu");

	headers.forEach((header, i) => {
		header.setAttribute("data-id", i);

		const level = parseInt(header.tagName.substring(1), 10);
		const div = document.createElement("div");
		div.className = `level-${level}`;
		div.textContent = header.textContent;
		div.setAttribute("data-target", `#${header.id || `header-${i}`}`);
		tocMenu.appendChild(div);
	});

	const tocButtons = document.querySelectorAll("#toc .toc_menu div");
	const tocSitetitle = document.querySelector("#toc .toc_sitetitle");
	tocSitetitle.addEventListener("click", () => {
		window.scroll({
			top: 0,
		});
	});

	tocButtons.forEach((button, i) => {
		button.addEventListener("click", async function (event) {
			event.preventDefault();
			const targetId = i;
			const targetHeader = document.querySelector(`[data-id="${targetId}"]`); // data-idでヘッダーを特定

			if (targetHeader) {
				targetHeader.scrollIntoView({
					block: "start",
				});
			}

			const handleScrollEnd = () => {
				if (sidebar) sidebar.classList.remove("active");
				if (backdrop) {
					backdrop.classList.add("hidden");
				}
				if (panelSwitch) panelSwitch.ariaExpanded = "false";
				window.removeEventListener("scrollend", handleScrollEnd);
			};

			if ("onscrollend" in window) {
            window.addEventListener("scrollend", handleScrollEnd);
        } else {
            // 未サポートブラウザ用のフォールバック（従来のsleep方式）
            setTimeout(handleScrollEnd, 600);
        }
		});
	});

	// スクロール位置を監視して、現在の見出しをハイライトする
	const observerOptions = {
		root: null, // ビューポートをルートとして使用
		rootMargin: "0px",
		threshold: 0.5, // 見出しの50%が表示されたらトリガー
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const id = entry.target.getAttribute("data-id");
			const tocButton = document.querySelector(
				`#toc .toc_menu div[data-target="#header-${id}"]`
			);

			if (entry.isIntersecting) {
				// 現在表示されている見出しに対応するTOCのボタンにクラスを追加
				tocButton.classList.add("active");
			} else {
				// 表示されていない見出しに対応するTOCのボタンからクラスを削除
				tocButton.classList.remove("active");
			}
		});
	}, observerOptions);

	// 各見出しを監視対象に追加
	headers.forEach((header) => {
		observer.observe(header);
	});
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

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

//add load lazy
export function insertLoadlazy() {
	const images = document.querySelectorAll("img");
	images.forEach((img) => {
		if (!img.getAttribute("loading")) {
			img.setAttribute("loading", "lazy");
		}
	});
}

// external link
export function isExternalLink(url) {
	// URLがhttp://またはhttps://で始まるか確認
	const isAbsoluteUrl = /^https?:\/\//.test(url);

	// 現在のページのオリジンを取得
	const currentOrigin = window.location.origin;

	// ローカル環境での相対パスや絶対パスを除外
	if (!isAbsoluteUrl) {
		return false; // 相対パスや絶対パスは外部リンクと見なさない
	}

	// URLが完全なURLであり、かつ現在のオリジンと異なる場合に外部リンクと見なす
	return !url.startsWith(currentOrigin);
}

export function externalLink() {
	// 記事内のすべてのリンクを取得
	const links = document.querySelectorAll(".body-copy a");

	links.forEach((link) => {
		const href = link.getAttribute("href");

		if (href && isExternalLink(href)) {
			link.setAttribute("target", "_blank");

			const existingRel = link.getAttribute("rel") || "";

			// noopenerとnoreferrerを追加
			const newRel = existingRel
				.split(" ")
				.filter((attr) => attr !== "noopener" && attr !== "noreferrer") // 重複を防ぐ
				.concat("noopener", "noreferrer")
				.join(" ")
				.trim();

			link.setAttribute("rel", newRel);

			let iconId = "#icon_external-link";
			let extraClass = "icon_external-link";

			if (href.includes("amzn.to/")) {
				iconid = "#icon-amazon";
				extraClass = "amazon";
				link.setAttribute("title", "Amazonへのリンクです");
			}

			const wrapper = document.createElement('span');
      wrapper.className = 'external-link-wrapper';
			//wrapper.style.display = 'inline-flex';
			wrapper.style.position = 'relative';
      //wrapper.style.alignItems = 'baseline'; // アイコンを文字の高さに合わせる
      // wrapper.style.whiteSpace = 'normal';   // 折り返しを許可

      // 2. リンクの直前にラッパーを挿入し、その中にリンクを移動
      link.parentNode.insertBefore(wrapper, link);
      wrapper.appendChild(link);


			if (href.includes("amzn.to/")) {
				// アイコンを追加
				const amazonIcon = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"svg"
				);
				amazonIcon.classList.add("amazon");
				const amazonUse = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"use"
				);
				amazonUse.setAttributeNS(null, "href", "#icon-amazon");
				amazonIcon.setAttributeNS(null, "role", "img");
				amazonIcon.setAttributeNS(null, "width", "13.35px");
				amazonIcon.setAttributeNS(null, "height", "13.35px");
				amazonIcon.appendChild(amazonUse);
				link.appendChild(amazonIcon);
				link.setAttribute("title", "Amazonへのリンクです");
			}

			// アイコンを追加
			const icon = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"svg"
			);
			icon.classList.add("icon_external-link", "insert");
			const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			use.setAttributeNS(null, "href", "#icon_external-link");
			icon.setAttributeNS(null, "role", "img");
			icon.setAttributeNS(null, "width", "13.35px");
			icon.setAttributeNS(null, "height", "13.35px");
			icon.appendChild(use);
			wrapper.appendChild(icon);

		}

		document.querySelectorAll(".icon_external-link.insert").forEach((icon) => {
			icon.classList.remove("insert");
		});
	});
}

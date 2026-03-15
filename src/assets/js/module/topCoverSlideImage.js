// module/topCoverSlideImage.js
export async function topCoverSlideImage() {
	const bodyCopy = document.querySelector(".body-copy");
	if (!bodyCopy.classList.contains("index")) return;

	const menuCheck = document.querySelector(".checkbox input");
	const eyeCatch = document.querySelector(".cover");

	if (!menuCheck || !eyeCatch) {
		console.error("Required elements not found");
		return;
	}

	// メニューテキスト
	function checkboxText() {
		const checkboxSpan = document.querySelector(
			".checkbox .spanContainer span"
		);

		if (checkboxSpan) {
			checkboxSpan.textContent = menuCheck.checked ? "CloseMenu" : "OpenMenu";
		}
	}

	// 画像形式のサポートチェック
	const imageSupportCache = {};

	async function checkImageSupport(format) {
		if (format in imageSupportCache) return imageSupportCache[format];

		const result = await new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src =
				format === "avif"
					? "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWY="
					: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//8=";
		});
		imageSupportCache[format] = result;
		return result;
	}

	// 背景画像を設定
	async function setBackgroundImage(containerClass, avifUrl, webpUrl) {
		const container = document.querySelector(containerClass);
		if (!container) {
			console.error(`Container ${containerClass} not found`);
			return;
		}
		const divNum = 16;
		let imageSrc;
		try {
			imageSrc = (await checkImageSupport("avif")) ? avifUrl : webpUrl;
		} catch (error) {
			console.error("Image support check failed:", error);
			imageSrc = webpUrl;
		}

		for (let i = 0; i < divNum; i++) {
			const split = 100 / divNum;
			let correctValue = i === 0 ? 0 : 1;
			let xstart = split * i - correctValue;
			let xend = split * (i + 1);
			const divElement = document.createElement("div");
			divElement.style.backgroundImage = `url('${imageSrc}')`;
			divElement.style.clipPath = `polygon(0% ${xstart}%, 100% ${xstart}%, 100% ${xend}%, 0% ${xend}%)`;
			divElement.style.top = "0px";
			container.append(divElement);
		}
	}

	// 初期化
	checkboxText();
	menuCheck.addEventListener("change", () => {
		checkboxText();
		eyeCatch.classList.toggle("active", menuCheck.checked);
	});

	// 画像設定
	await setBackgroundImage(
		".cover",
		"/assets/images/covertreasure.avif",
		"/assets/images/covertreasure.webp"
	);

	// デバウンス
	function debounce(func, delay) {
		let timeoutId;
		return function () {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(this, arguments), delay);
		};
	}

	function handleResize() {
		if (eyeCatch.clientWidth > 768) {
			if (menuCheck.checked) {
				menuCheck.checked = false;
				menuCheck.dispatchEvent(new Event("change"));
			}
		}
	}

	const debouncedHandleResize = debounce(handleResize, 200);

	// リサイズイベント
	handleResize();
	window.addEventListener("resize", debouncedHandleResize);
}

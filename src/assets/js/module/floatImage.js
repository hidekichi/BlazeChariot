export function floatImage() {
	const refContainer = document.querySelector(".ref-container");
	const links = document.querySelectorAll(".f-img");
	
	links.forEach((fix) => {
		const urls = fix.dataset.target;
		const fileName = urls.split("/").pop();
		const replaceName = fileName.replace(/\_|\./g, "-");
		fix.dataset.target = `img-${replaceName}`;
		fix.title = "画面上部に参照画像を固定表示します";
	});

	links.forEach((fimg) => {
		fimg.addEventListener("click", () => {
			const targetId = fimg.dataset.target;
			const targetElement = document.querySelector(`.sidebar .thumb[data-image="${targetId}"] img`);
			//const imageIndex = link.dataset.imageIndex;
			if (targetElement) {
				// 固定表示
				const fixedImage = targetElement.cloneNode(true);
				refContainer.innerHTML = ""; // コンテナを空にする
				refContainer.appendChild(fixedImage);
				refContainer.classList.add("active");

				// サムネイルのアクティブ状態を更新
				targetElement.classList.add("intoRef");
			}
		});
	});

	const openRefContainer = document.querySelector(".ref-container");
	openRefContainer.addEventListener("click", (e) => {
		const activeElement = e.target.closest(".active");
		if (activeElement) {
			activeElement.classList.remove("active");
		} else {
			return;
		}
	});
}


export function imageModalOpen() {
	const thumbnails = document.querySelectorAll(".thumbnails .thumb");
	const modal = document.getElementById("image-modal");
	const modalClose = document.querySelector(".modal-close");
	const modalContent = document.querySelector(".modal-content");
	
	thumbnails.forEach((thumbnail) => {
		thumbnail.addEventListener("click", () => {
			const thumbImage = thumbnail.dataset.image;
			const image = document.querySelector(`.thumb[data-image="${thumbImage}"] img`);
			const rect = image.getBoundingClientRect();
			modal.style.top = `${rect.top}px`;
			modal.style.left = `${rect.left}px`;
			modalContent.src = image.src;
			modal.classList.remove("close");
			modal.classList.add("open");
		});
	});
	
	modal.addEventListener("click", (e) => {
		const activeModal = e.target.closest(".open");
		const imgElement = modal.querySelector("img");
		modal.classList.remove("open");
		//imgElement.src = '';
		if (activeModal) {
			activeModal.classList.add("close");
		} else {
			return;
		}
	});
}
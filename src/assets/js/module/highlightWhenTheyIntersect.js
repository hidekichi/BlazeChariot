export function highlightWhenTheyIntersect() {
	const fImgs = document.querySelectorAll("span.f-img");
	const thumbs = document.querySelectorAll(".thumbnails .thumb");

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const targetId = entry.target.dataset.target;
			const thumbnail = Array.from(thumbs).find((thumb) => thumb.dataset.image === targetId);
			if (thumbnail) {
				if (entry.isIntersecting) {
					entry.target.classList.add("intersection");
					thumbnail.classList.add("highlight");
				} else {
					entry.target.classList.remove("intersection");
					thumbnail.classList.remove("highlight");
				}
			}
		});
	},{
		root: null, // または、特定の要素を指定
		threshold: 0 // 0〜1 の値を指定 (例: 0.5 = 50%)
	});
	
	fImgs.forEach((fImg) => {
		observer.observe(fImg);
	});
}
import { footnote } from "./module/footnote.js";
import { initPanelSwitch, insertLoadlazy, externalLink } from "./module/utils.js";
import { embbedYoutubePlayer } from "./module/embedYoutubePlayer.js";
import { floatImage } from "./module/floatImage.js";
import { imageModalOpen } from "./module/floatImage.js";
import { toc } from "./module/toc.js";
import { highlightWhenTheyIntersect } from "./module/highlightWhenTheyIntersect.js";
import { topCoverSlideImage } from "./module/topCoverSlideImage.js";

document.addEventListener("DOMContentLoaded", async () => {
	await footnote();

	await topCoverSlideImage();

	embbedYoutubePlayer();

	initPanelSwitch();

	externalLink();

	floatImage();

	toc();

	insertLoadlazy();

	highlightWhenTheyIntersect();

	imageModalOpen();
});

window.addEventListener("load", () => {
	const snsIcon = document.querySelector("ul.sns-share");
	if (snsIcon) {
		snsIcon.classList.add("loaded");
	}
})

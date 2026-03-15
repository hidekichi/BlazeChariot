import "../css/style.css";
import { footnote } from "./module/footnote.js";
import { initPanelSwitch, insertLoadlazy, externalLink } from "./module/utils.js";
import { embbedYoutubePlayer } from "./module/embedYoutubePlayer.js";
import { floatImage } from "./module/floatImage.js";
import { imageModalOpen } from "./module/floatImage.js";
// import { toc } from "./module/toc.js";
import { highlightWhenTheyIntersect } from "./module/highlightWhenTheyIntersect.js";
import { topCoverSlideImage } from "./module/topCoverSlideImage.js";
import { copyButton } from "./module/copyButton.js";
import { updateMarkLast2weeks } from "./module/utils.js";
import { credit } from "./module/utils.js";
import { stickyTable } from "./module/utils.js";
import { toc } from "./module/tocAutoOpen.js";

document.addEventListener("DOMContentLoaded", async () => {
	await footnote();

	await topCoverSlideImage();

	await copyButton();

	embbedYoutubePlayer();

	initPanelSwitch();

	updateMarkLast2weeks();

	externalLink();

	floatImage();

	toc();

	insertLoadlazy();

	highlightWhenTheyIntersect();

	imageModalOpen();

	credit();

	stickyTable();
});

window.addEventListener("load", () => {
	const snsIcon = document.querySelector("ul.sns-share");
	if (snsIcon) {
		snsIcon.classList.add("loaded");
	}
})

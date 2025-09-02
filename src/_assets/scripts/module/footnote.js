//Convert paragraph text

async function replaceInTextNodes(root, patterns) {
	const walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);
	const nodes = [];
	while (walker.nextNode()) {
		nodes.push(walker.currentNode);
	}

	nodes.forEach((node) => {
		// <code>, <pre>, <table> の中は無視
		if (node.parentNode.closest("code, pre, table")) return;

		let html = node.textContent;
		patterns.forEach(([regex, replacement]) => {
			html = html.replace(regex, replacement);
		});

		if (html !== node.textContent) {
			const span = document.createElement("span");
			span.innerHTML = html;
			node.replaceWith(...span.childNodes);
		}
	});
}

async function convertParagraphText() {
	const patterns = [
		[/\[\@(.*?)\](?:\((.*?)\))?/g, `<div class='ytp $2'>$1</div>`],
		[/\[hs\((.+?)\)\]/g, `<div style='display:block; height:$1;'></div>`],
		[
			/\[(a)\((.+?)\)\](?:(.+)\[\/a\])?/g,
			`<a class='anchor' href='#$2' title='クリックでページスクロール'>$3</a>`,
		],
		[
			/\[(t)\((.+?)\)\](?:(.+)\[\/t\])?/g,
			`<span id='$2' class='anchorTarget'>$3</span>`,
		],
		[/\(\(([^\)]+)\)\)/g, `<sup class='footnote'>$1</sup>`],
		[
			/\[(info)(?:\s+([\w\s]+))?\]([\s\S]*?)\[\/info\]/g,
			`<div class='$1 $2'>$3</div>`,
		],
	];

	replaceInTextNodes(document.querySelector(".body-copy"), patterns);
}


export async function footnote() {
	
	await convertParagraphText();
	
	const postContent = document.querySelector('.body-copy');
	const sups = postContent.querySelectorAll('.footnote');

	if (sups) {
		//リストを入れるコンテナを用意
		const makeFootnoteList = document.createElement('div');
		makeFootnoteList.classList.add('footnotes-list');
		makeFootnoteList.id = 'footnoteList';
		postContent.insertBefore(makeFootnoteList, null);

		const footnotesList = document.querySelector('.footnotes-list');

		sups.forEach((sup, i) => {
			let number = i + 1;
			let supText = sup.textContent;

			sup.id = `ht` + number;
			//sup.dataset.foot = number;
			sup.title = supText;
			sup.textContent = number;

			//元の位置へのリンク
			const backLink = document.createElement('div');
			backLink.classList.add('foot');
			backLink.dataset.foot = number;
			
			const spanInBackLink = document.createElement('span');
			spanInBackLink.textContent = `注${number}`;
			
			const spanElement = document.createElement('span');
			spanElement.href = `#ht${number}`;
			spanElement.title = `クリック/タップで元の番号( [${number}] )に戻ります`;
			spanElement.textContent = sup.title;

			backLink.appendChild(spanInBackLink);
			backLink.appendChild(spanElement);

			footnotesList.appendChild(backLink);
		});
	}

	const footnotesList = document.querySelector('.footnotes-list');
	const foots = footnotesList.querySelectorAll('.foot');

	foots.forEach((foot) => {
		let fot = foot.dataset.foot;
		foot.href = `#ht${fot}`;
		foot.dataset.foot = fot;
	});
	
	document.addEventListener("click", (e) => {
		if (!e.target.closest('.footnote, .foot')) {
			return; // ターゲット以外のクリックは無視
		}
		
		if (e.target.classList.contains("footnote")) {
			e.preventDefault();
			
			let footNumber = e.target.textContent;
			const footnotesList = document.querySelector(".footnotes-list");
			const findFootnote = footnotesList.querySelector(`[data-foot="${footNumber}"]`);
			
			const observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					findFootnote.classList.add('footnoteblink');
					
					findFootnote.addEventListener('animationend', function onAnimationEnd() {
						findFootnote.classList.remove('blink');
						findFootnote.removeEventListener('animationend', onAnimationEnd);
						observer.unobserve(findFootnote);
					});
				}
			});

			observer.observe(findFootnote);
			findFootnote.scrollIntoView({ block: "start", inline: "nearest" });
		}

		const footElement = e.target.closest('.foot');
		if (footElement) {
			let linkdata = footElement.dataset.foot
			let supBacklink = document.getElementById(`ht${linkdata}`);

			if (supBacklink) {
				e.preventDefault();
				supBacklink.scrollIntoView({ block: "start", inline: "nearest" });
			}
		}	
	});
}
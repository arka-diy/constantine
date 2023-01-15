function initAnimator() {
	var framesHTML = "";
	for (var i = 0; i < 30; i++) {
		framesHTML += '<div class="frame"></div>';
	}
	document.querySelectorAll("main .panel .timeline .frames").forEach(frames => {
		frames.innerHTML = framesHTML;
	});
}

function animatorOpen() {
	initAnimator();
	initPainter();
	initPalette();

	context.UI.infoView.classList.add("transparent");
	context.UI.timelineView.classList.remove("transparent");
	context.UI.toolbarView.classList.remove("transparent");
	context.UI.headerView.classList.add("dimmed");
	context.UI.cornerPanelView.classList.remove("transparent");
}

function animatorSave() {
	animatorClose();
}

function animatorClose() {
	context.painter.active = false;

	context.UI.infoView.classList.remove("transparent");
	context.UI.timelineView.classList.add("transparent");
	context.UI.toolbarView.classList.add("transparent");
	context.UI.headerView.classList.remove("dimmed");
	context.UI.cornerPanelView.classList.add("transparent");
}

function animatorShare() {
	context.UI.sharerView.classList.remove("transparent");

	var save = "";

	for (var i = 0; i < context.painter.frame.length; i++) {
		for (var j = 0; j < context.painter.frame[i].length; j++) {
			save += context.painter.frame[i][j];
		}
	}

	context.UI.sharerTextView.innerText = save;
}

function animatorShareClose() {
	context.UI.sharerView.classList.add("transparent");
}

function animatorShareCopy() {
	navigator.clipboard.writeText(context.UI.sharerTextView.innerText);
}

// Internal


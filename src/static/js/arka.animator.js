function animatorOpen() {
	loadAnimator();
	animatorStop();

	initPainter();
	initPalette();

	context.UI.infoView.classList.add("transparent");
	context.UI.timelineView.classList.remove("transparent");
	context.UI.toolbarView.classList.remove("transparent");
	context.UI.headerView.classList.add("dimmed");
	context.UI.cornerPanelView.classList.remove("transparent");
}

function animatorPlay() {
	if(context.animator.playTimer) {
		animatorStop();
	} else {
		context.UI.timelinePlayButton.style.backgroundImage = "url(/images/pause.svg)";

		context.animator.playIndex = 0;
		context.animator.playTimer = setInterval(() => {
			combineFrameAnimator(context.animator.playIndex);

			context.animator.playIndex++;
			if(context.animator.playIndex >= Math.max(...Object.values(context.animator.layers).flat().map(l => l.index))) context.animator.playIndex = 0;
		}, 40);
	}
}

function animatorStop() {
	context.UI.timelinePlayButton.style.backgroundImage = "url(/images/play.svg)";

	clearInterval(context.animator.playTimer);
	context.animator.playTimer = null;
}

function animatorSave() {
	animatorClose();

	var animations = [{
		identificator: "main",
		layers: { top: [], middle: [], bottom: [] }
	}];

	["top", "middle", "bottom"].forEach((layer) => {
		for (var i = 0; i < context.animator.layers[layer].length; i++) {
			animations[0].layers[layer].push(zip(context.animator.layers[layer][i]));
		}
	});

	context.slider.arkas[context.slider.slides[context.slider.index].getAttribute("data-arka")].animations = animations;

	xhrSave(context.slider.arkas[context.slider.slides[context.slider.index].getAttribute("data-arka")].identificator, animations);
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

function animatorInsertFrame(keyframe) {
	keyframe = keyframe === true ? true : false;

	closeMenuAnimator();

	var frameView = context.UI.timelineFrameView;
	var index = Array.prototype.indexOf.call(frameView.parentElement.children, frameView);
	var layer = context.animator.layers[getFrameLayerAnimator(frameView)];

	var action;

	for (var i = 0; i < layer.length; i++) {
		if(layer[i].index >= index) {
			var previous = layer[i - 1] ? layer[i - 1].type : null;
			var current = layer[i].type;

			if(previous === null && current === "key") action = "keyframe";
			if(previous === "key" && current === "cut") action = frameView.parentElement.children[index - 1].classList.contains("key") ? (frameView.parentElement.children[index + 1].classList.contains("between") ? "keyframe" : "removecut+keyframe") : "cutleft+keyframe";

			break
		} 
	}

	if(!action && layer.length === 0) action = "keyframe";
	if(!action) action = keyframe ? (!frameView.classList.contains("key") && !frameView.classList.contains("between") && !frameView.classList.contains("cut") ? "keyframe" : "movecutleft+keyframe") : (layer[i - 1] && layer[i - 1].type === "cut" ? "movecut" : "cut");

	switch(action) {
	case "keyframe":
		layer.push({ index, type: "key", frame: makeEmptyFramePainter() });
		break
	case "cut":
		layer.push({ index, type: "cut" });
		break
	case "cutleft+keyframe":
		layer.push({ index: index-1, type: "cut" });
		layer.push({ index, type: "key", frame: makeEmptyFramePainter() });
		break
	case "removecut+keyframe":
		layer.splice(layer.indexOf(layer[i]), 1);
		layer.push({ index, type: "key", frame: makeEmptyFramePainter() });
		break
	case "movecutleft+keyframe":
		layer[i - 1].index -= 1;
		layer.push({ index, type: "key", frame: makeEmptyFramePainter() });
		break
	case "movecut":
		layer[i - 1].index = index;
		break
	}

	redrawTimelineAnimator();
}

function animatorInsertKeyframe() {
	animatorInsertFrame(true);
}

function animatorRemoveFrame() {
	closeMenuAnimator();

	var frameView = context.UI.timelineFrameView;
	var index = Array.prototype.indexOf.call(frameView.parentElement.children, frameView);
	var layer = context.animator.layers[getFrameLayerAnimator(frameView)];

	var action;

	for (var i = 0; i < layer.length; i++) {
		if(layer[i].index >= index) {
			var previous = layer[i - 1] ? layer[i - 1] : null;
			var current = layer[i];
			var next = layer[i + 1] ? layer[i + 1] : null;

			if(current.type === "key") {
				action = next && next.type === "cut" ? "movekeyframeright" : "removekeyframe";
				if(action === "movekeyframeright" && (next.index - 1) === index) action = "removecutright+movekeyframeright";
			}

			if(current.type === "cut") {
				action = previous && previous.type === "key" && (previous.index + 1) === index ? "removecut" : "movecutleft";
				if(current.index !== index) action = previous && previous.type === "key" && (previous.index + 1) === index ? "keyframeright" : "cutleft+keyframeright";
				if(action === "cutleft+keyframeright") action = (current.index - 1) === index ? "removecutright+cutleft+keyframeright" : "cutleft+keyframeright";
			}

			break
		}
	}

	switch(action) {
	case "movekeyframeright":
		layer[i].index += 1;
		break
	case "removekeyframe":
	case "removecut":
		layer.splice(layer.indexOf(layer[i]), 1);
		break
	case "removecutright+movekeyframeright":
		layer.splice(layer.indexOf(layer[i]) + 1, 1);
		layer[i].index += 1;
		break
	case "movecutleft":
		layer[i].index -= 1;
		break
	case "keyframeright":
		layer.push({ index: index + 1, type: "key", frame: JSON.parse(JSON.stringify(layer[i - 1].frame)) });
		break
	case "cutleft+keyframeright":
		layer.push({ index: index - 1, type: "cut" });
		layer.push({ index: index + 1, type: "key", frame: JSON.parse(JSON.stringify(layer[i - 1].frame)) });
		break
	case "removecutright+cutleft+keyframeright":
		layer.splice(layer.indexOf(layer[i]), 1);
		layer.push({ index: index - 1, type: "cut" });
		layer.push({ index: index + 1, type: "key", frame: JSON.parse(JSON.stringify(layer[i - 1].frame)) });
	}

	redrawTimelineAnimator();
}

// Internal

function initAnimator() {
	document.querySelectorAll("main .panel .timeline .frames").forEach(framesView => {
		for (var i = 0; i < 30; i++) {
			var frameView = document.createElement("div");
			frameView.classList.add("frame");

			if(framesView.parentElement.classList.contains("layer")) {
				frameView.addEventListener("contextmenu", openMenuAnimator);

				frameView.addEventListener("touchstart", frameDownAnimator);
				frameView.addEventListener("touchend", frameUpAnimator);
				frameView.addEventListener("touchcancel", frameUpAnimator);
				frameView.addEventListener("mousedown", frameDownAnimator);
				frameView.addEventListener("mouseup", frameUpAnimator);
			}
			
			framesView.appendChild(frameView);
		}
	});

	for (var i = 0; i < 30; i++) {
		var frameView = document.createElement("div");
		frameView.classList.add("frame");
		frameView.addEventListener("mouseover", indicatorShowAnimator);
		frameView.addEventListener("mouseleave", indicatorHideAnimator);
		
		document.querySelector("main .panel .timeline .header .buttons").appendChild(frameView);
	}
}

function loadAnimator(create) {
	create = create || false;

	context.animator.layers = {
		top: create ? [{ index: 0, type: "key", frame: JSON.parse(JSON.stringify(context.painter.frame)) }] : [],
		middle: [], bottom: []
	};

	var animation = context.slider.arkas[context.slider.slides[context.slider.index].getAttribute("data-arka")].animations.filter(animation => { return animation.identificator === "main" })[0];
	if(!animation) return alert("Error");

	["Top", "Middle", "Bottom"].forEach((layer) => {
		for (var i = 0; i < animation["layer" + layer].length; i++) {
			context.animator.layers[layer.toLowerCase()].push(unzip(animation["layer" + layer][i]));
		}
	});

	context.animator.selectedLayer = "top";
	context.animator.selectedIndex = 0;

	redrawTimelineAnimator();

	renderScreen(combinedFrameAnimator(context.animator.selectedIndex));
}

function indicatorShowAnimator() {
	var index = Array.prototype.indexOf.call(this.parentElement.children, this);

	combineFrameAnimator(index);
}

function indicatorHideAnimator() {
	var index = Array.prototype.indexOf.call(this.parentElement.children, this);

	context.UI.timelineIndicatorView.style.opacity = 0;

	renderScreen(combinedFrameAnimator(context.animator.selectedIndex));
}

function combineFrameAnimator(index) {
	context.UI.timelineIndicatorView.style.opacity = 0.5;
	context.UI.timelineIndicatorView.style.left = (114 + 10 * index) + "px";

	renderScreen(combinedFrameAnimator(index));
}

function combinedFrameAnimator(index) {
	var combinedFrame = [];

	["bottom", "middle", "top"].forEach((layer) => {
		var lastKeyFrame, currentFrame;

		for (var i = 0; i < context.animator.layers[layer].length; i++) {
			var frame = context.animator.layers[layer][i];
			if(frame.index >= index) {
				if(frame.type === "key" && frame.index === index) currentFrame = frame;
				else if(frame.type === "cut" && lastKeyFrame) currentFrame = lastKeyFrame;
				break;
			} else if(frame.type === "key") lastKeyFrame = frame;
		}
		
		if(currentFrame) {
			if(combinedFrame.length) {
				for (var i = 0; i < combinedFrame.length; i++) {
					for (var j = 0; j < combinedFrame[i].length; j++) {
						var newColor = currentFrame.frame[i][j];
						if(newColor !== "0000") combinedFrame[i][j] = newColor;
					}
				}
			} else combinedFrame = JSON.parse(JSON.stringify(currentFrame.frame));
		}
	});

	return combinedFrame;
}

function redrawTimelineAnimator() {
	context.animator.layers.top = context.animator.layers.top.sort((f1, f2) => { return f1.index > f2.index });
	context.animator.layers.middle = context.animator.layers.middle.sort((f1, f2) => { return f1.index > f2.index });
	context.animator.layers.bottom = context.animator.layers.bottom.sort((f1, f2) => { return f1.index > f2.index });

	document.querySelectorAll("main .panel .timeline .frame").forEach((frameView) => {
		frameView.classList.remove("key");
		frameView.classList.remove("between");
		frameView.classList.remove("cut");
		frameView.classList.remove("empty");
		frameView.classList.remove("top");
		frameView.classList.remove("selected");
	});
	
	["top", "middle", "bottom"].forEach((layer) => {
		var frames = document.querySelectorAll("main .panel .timeline .layer." + layer + " .frame");

		var between = false;
		var empty = false;
		var selected = false;

		for (var i = 0; i < frames.length; i++) {
			var frameView = frames[i];

			if(layer === context.animator.selectedLayer && i === context.animator.selectedIndex) {
				selected = true;

				frameView.classList.add("selected");
			} else {
				if(selected) frameView.classList.add("selected");
			}

			var frame = context.animator.layers[layer].filter(frame => { return frame.index === Array.prototype.indexOf.call(frameView.parentElement.children, frameView) })[0];
			if(frame) {
				frameView.classList.add(frame.type);

				if(layer === context.animator.selectedLayer && i === context.animator.selectedIndex) {
					if(frame.frame) {
						renderScreen(frame.frame);
						context.painter.frame = frame.frame;
					} else {
						painterClear();
					}
				}

				var frameEmpty = checkEmptyFramePainter(frame.frame);

				if((frame.type !== "cut" && frameEmpty) || (frame.type === "cut" && empty)) frameView.classList.add("empty");

				if(between) {
					between = false;
					selected = false;
				} else {
					var nextIndex = context.animator.layers[layer].indexOf(frame) + 1;
					var nextFrame = context.animator.layers[layer][nextIndex];
					if(nextFrame && nextFrame.type === "cut") {
						between = true;
						empty = frameEmpty;
					} else {
						selected = false;
					}
				}
			} else {
				if(between) {
					frameView.classList.add("between");
					if(empty) frameView.classList.add("empty");
				} else {
					between = false;
					selected = false;

					frameView.classList.remove("selected");
				}
			}
		}
	});

	document.querySelectorAll("main .panel .timeline .layer:not(.top) .frame:not(.key):not(.between):not(.cut)").forEach((frameView) => {
		var index = Array.prototype.indexOf.call(frameView.parentElement.children, frameView);
		var layer = frameView.parentElement.parentElement.classList.contains("middle") ? "top" : "middle";

		var classList = document.querySelector("main .panel .timeline ." + layer + " .frames .frame:nth-of-type(" + (index + 1) + ")").classList;

		if(classList.contains("key") || classList.contains("between") || classList.contains("cut")) frameView.classList.add("top");
	});
}

function frameDownAnimator(event) {
	closeMenuAnimator();
	frameUpAnimator();

	frameSelectAnimator(event.target);

	context.animator.menuTimer = setTimeout(() => {
		openMenuAnimator(null, event.target);
	}, 500);
}

function frameUpAnimator() {
	if(context.animator.menuTimer) clearTimeout(context.animator.menuTimer);
}

function frameSelectAnimator(frameView) {
	if(!frameView.classList.contains("key") && !frameView.classList.contains("between") && !frameView.classList.contains("cut")) return;

	var index = Array.prototype.indexOf.call(frameView.parentElement.children, frameView);
	var existing = -1;

	for (var i = index; i >= 0; i--) {
		if(frameView.parentElement.children[i].classList.contains("key")) {
			existing = i;
			break;
		}
	}

	if(existing >= 0) {
		context.animator.selectedIndex = existing;
		context.animator.selectedLayer = getFrameLayerAnimator(frameView);

		redrawTimelineAnimator();
	}
}

function animatorDeleteSelectedFrame() {
	var index = context.animator.layers[context.animator.selectedLayer].findIndex(frame => { return frame.index === context.animator.selectedIndex && frame.type === "key" });

	if(index >= 0) {
		if(checkEmptyFramePainter(context.animator.layers[context.animator.selectedLayer][index].frame)) {
			context.animator.layers[context.animator.selectedLayer].splice(index, 1);

			if(context.animator.layers[context.animator.selectedLayer][index] && context.animator.layers[context.animator.selectedLayer][index].type === "cut") {
				context.animator.layers[context.animator.selectedLayer].splice(index, 1);
			}
		} else {
			context.animator.layers[context.animator.selectedLayer][index].frame = makeEmptyFramePainter();
		}

		renderScreen(combinedFrameAnimator(context.animator.selectedIndex));
		redrawTimelineAnimator();
	}
}

function getFrameLayerAnimator(frameView) {
	if(frameView.parentElement.parentElement.classList.contains("top")) {
		return "top";
	} else if(frameView.parentElement.parentElement.classList.contains("middle")) {
		return "middle";
	} else if(frameView.parentElement.parentElement.classList.contains("bottom")) {
		return "bottom";
	}
}

function openMenuAnimator(event, target) {
	context.UI.timelineFrameView = target || event.target;

	if(event) event.preventDefault();
	closeMenuAnimator();

	var timelineViewBounds = context.UI.timelineView.getBoundingClientRect();
	var frameBounds = context.UI.timelineFrameView.getBoundingClientRect();

	var classList = context.UI.timelineFrameView.classList;

	if(classList.contains("key")) {
		context.UI.animatorInsertKeyframeButton.classList.add("displaynone");
		context.UI.animatorInsertFrameButton.classList.add("displaynone");
	} else {
		context.UI.animatorInsertKeyframeButton.classList.remove("displaynone");
		context.UI.animatorInsertFrameButton.classList.remove("displaynone");
	}

	if(classList.contains("between") || classList.contains("cut")) context.UI.animatorInsertFrameButton.classList.add("displaynone");
	else if(!classList.contains("key")) context.UI.animatorInsertFrameButton.classList.remove("displaynone");

	if(classList.contains("key") || classList.contains("between") || classList.contains("cut")) context.UI.animatorRemoveFrameButton.classList.remove("displaynone");
	else context.UI.animatorRemoveFrameButton.classList.add("displaynone");

	context.UI.timelineFrameView.classList.add("contexted");

	context.UI.timelineMenuView.classList.remove("transparent");
	context.UI.timelineMenuView.style.left = (frameBounds.right - timelineViewBounds.left - 8) + "px";
	context.UI.timelineMenuView.style.top = (frameBounds.bottom - timelineViewBounds.top - 8) + "px";
}

function closeMenuAnimator() {
	context.UI.timelineMenuView.classList.add("transparent");

	document.querySelectorAll("main .panel .timeline .frame.contexted").forEach((contexted) => {
		contexted.classList.remove("contexted");
	});
}

function saveFrameAnimator() {
	var frames = context.animator.layers[context.animator.selectedLayer];
	var frameIndex = frames.findIndex((frame) => { return frame.index === context.animator.selectedIndex });

	if(frameIndex >= 0) {
		context.animator.layers[context.animator.selectedLayer][frameIndex].frame = JSON.parse(JSON.stringify(context.painter.frame));
	}

	redrawTimelineAnimator();
}
var context = {

	UI: {
		screenView: null,

		timelineFrameView: null,

		headerView: document.querySelector("header"),

		sliderView: document.querySelector("main .slider"),

		infoView: document.querySelector("main .panel .info"),
		editButton: document.querySelector("main .panel .info .edit"),

		timelineView: document.querySelector("main .panel .timeline"),
		timelineMenuView: document.querySelector("main .panel .timeline .menu"),

		animatorInsertFrameButton: document.querySelector("main .panel .timeline .menu .insert-frame"),
		animatorInsertKeyframeButton: document.querySelector("main .panel .timeline .menu .insert-keyframe"),
		animatorRemoveFrameButton: document.querySelector("main .panel .timeline .menu .remove-frame"),

		toolbarView: document.querySelector("main .toolbar"),

		paletteView: document.querySelector("main .toolbar .palette"),
		paletteCurrentColorsView: document.querySelector("main .toolbar .palette .current-colors"),
		paletteAddColorsView: document.querySelector("main .toolbar .palette .add-colors"),

		cornerPanelView: document.querySelector(".draw-corner-panel"),
		
		sharerView: document.querySelector(".draw-sharer"),
		sharerTextView: document.querySelector(".draw-sharer .text")
	},

	slider: {
		slides: null,
		timer: null,

		index: 0
	},

	screen: {
		canvas: null,
		context: null,
		loop: null,

		magnifyFactor: 2,

		pixelSize: 8,
		pixelOffset: 2,

		frames: [],
		frame: 0
	},

	painter: {
		frame: null,
		x: null,
		y: null,

		color: "ffff",

		active: false,
		drawing: false
	},

	animator: {
		menuTimer: null,
		layers: null,
		selectedLayer: null,
		selectedIndex: null
	}

}

context.UI.editButton.addEventListener("click", animatorOpen);

document.querySelector("main .panel .info .preview").addEventListener("click", xhrPreview);

document.querySelector("main .panel .magnifier .magnify1x").addEventListener("click", () => { screenMagnify(1) });
document.querySelector("main .panel .magnifier .magnify2x").addEventListener("click", () => { screenMagnify(2) });
document.querySelector("main .panel .magnifier .magnify3x").addEventListener("click", () => { screenMagnify(3) });

context.UI.animatorInsertFrameButton.addEventListener("click", animatorInsertFrame);
context.UI.animatorInsertKeyframeButton.addEventListener("click", animatorInsertKeyframe);
context.UI.animatorRemoveFrameButton.addEventListener("click", animatorRemoveFrame);

document.querySelector("main .toolbar .clear").addEventListener("click", painterClear);
document.querySelector("main .toolbar .palette .add").addEventListener("click", painterPaletteAddColor);

document.querySelector(".draw-corner-panel .cancel").addEventListener("click", animatorClose);
document.querySelector(".draw-corner-panel .save").addEventListener("click", animatorSave);
document.querySelector(".draw-corner-panel .share").addEventListener("click", animatorShare);

document.querySelector(".draw-sharer .close").addEventListener("click", animatorShareClose);
document.querySelector(".draw-sharer .copy").addEventListener("click", animatorShareCopy);

// Init

initSlider();
initAnimator();
screenLoad();
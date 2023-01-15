var context = {

	UI: {
		screenView: null,

		headerView: document.querySelector("header"),

		sliderView: document.querySelector("main .slider"),

		infoView: document.querySelector("main .panel .info"),
		timelineView: document.querySelector("main .panel .timeline"),

		toolbarView: document.querySelector("main .toolbar"),

		paletteView: document.querySelector("main .toolbar .palette"),
		paletteCurrentColorsView: document.querySelector("main .toolbar .palette .current-colors"),
		paletteAddColorsView: document.querySelector("main .toolbar .palette .add-colors"),

		editButton: document.querySelector("main .panel .info .edit"),

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
		
	}

}

context.UI.editButton.addEventListener("click", animatorOpen);

document.querySelector(".draw-corner-panel .cancel").addEventListener("click", animatorClose);
document.querySelector(".draw-corner-panel .save").addEventListener("click", animatorSave);
document.querySelector(".draw-corner-panel .share").addEventListener("click", animatorShare);

document.querySelector(".draw-sharer .close").addEventListener("click", animatorShareClose);
document.querySelector(".draw-sharer .copy").addEventListener("click", animatorShareCopy);

document.querySelector("main .toolbar .clear").addEventListener("click", painterClear);
document.querySelector("main .toolbar .palette .add").addEventListener("click", painterPaletteAddColor);

document.querySelector("main .panel .info .preview").addEventListener("click", xhrPreview);

document.querySelector("main .panel .magnifier .magnify1x").addEventListener("click", () => { screenMagnify(1) });
document.querySelector("main .panel .magnifier .magnify2x").addEventListener("click", () => { screenMagnify(2) });
document.querySelector("main .panel .magnifier .magnify3x").addEventListener("click", () => { screenMagnify(3) });

// Init

initSlider();

screenLoad();
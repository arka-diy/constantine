// Slider

var slides, slideTimer;

var activeIndex = 0;

// Canvas

var screen, canvas, canvasContext, arka, loop;

var drawFrame, drawX, drawY;
var drawColor = "ffff";
var drawMode = false;
var drawing = false;

var frame = 0;
var frames = [];
var magnifyFactor = 2;

var pixelSize = 8;
var pixelOffset = 2;

// Binding

var header = document.querySelector("header");
var info = document.querySelector("main .panel .info");
var timeline = document.querySelector("main .panel .timeline");
var palette = document.querySelector("main .panel .palette");
var paletteCurrentColors = document.querySelector("main .panel .palette .current-colors");
var paletteAddColors = document.querySelector("main .panel .palette .add-colors");
var drawClose = document.querySelector(".draw-close");
var editButton = document.getElementById("edit");

document.getElementById("draw-cancel").addEventListener("click", drawCancel);
document.getElementById("draw-save").addEventListener("click", drawSave);

document.querySelector("main .panel .palette .add").addEventListener("click", drawPaletteAdd);

document.getElementById("preview").addEventListener("click", preview);
editButton.addEventListener("click", edit);

document.getElementById("magnify1x").addEventListener("click", () => { magnify(1) });
document.getElementById("magnify2x").addEventListener("click", () => { magnify(2) });
document.getElementById("magnify3x").addEventListener("click", () => { magnify(3) });

// Init

initSlider();
loadArka();

initAnimator();

// Animator

function initAnimator() {
	var framesHTML = "";
	for (var i = 0; i < 30; i++) {
		framesHTML += '<div class="frame"></div>';
	}
	document.querySelectorAll("main .panel .timeline .frames").forEach(frames => {
		frames.innerHTML = framesHTML;
	});
}

// Slider

function initSlider() {
	var slider = document.getElementById("slider");

	slides = slider.children;

	for (var i = 0; i < slides.length; i++) {
		slides[i].style.width = document.body.clientWidth + "px";
	}

	slider.style.width = document.body.clientWidth * slides.length + "px";

	window.addEventListener("scroll", handleSlide);
}

function handleSlide() {
	if(slideTimer) clearTimeout(slideTimer);
	slideTimer = setTimeout(stickSlide, 100);
}

function stickSlide() {
	var width = document.body.clientWidth;
	var stickedPosition = parseInt((window.scrollX + width / 2) / width, 10) * width;

	slides[activeIndex].classList.remove("active");
	activeIndex = parseInt(stickedPosition / width, 10);
	slides[activeIndex].classList.add("active");

	loadArka();
	
	window.scrollTo({
		top: 0,
		left: stickedPosition,
		behavior: "smooth"
	});
}

// Screen

function loadArka() {
	info.classList.add("transparent");

	setTimeout(() => {
		switch(slides[activeIndex].getAttribute("data-arka")) {
		case "noise":
			arka = loadNoiseArka();
			break
		case "standby":
			arka = loadStandbyArka();
			break
		case "torrent":
			arka = loadTorrentArka();
			break
		}
		
		frames = arka.preview;

		document.querySelector("main .panel .info h1").innerText = arka.title;
		document.querySelector("main .panel .info h3").innerText = arka.author;
		document.querySelector("main .panel .info .description").innerText = arka.description;

		if(arka.editable) {
			editButton.classList.remove("displaynone");
		} else {
			editButton.classList.add("displaynone");
		}
		
		screen = document.querySelector("#slider .slide.active .screen");

		document.querySelectorAll(".screen canvas").forEach((c) => c.remove());

		canvas = document.createElement("canvas");
		canvasContext = canvas.getContext("2d");

		canvas.addEventListener("mousedown", drawStart);
		canvas.addEventListener("mouseup", drawEnd);
		canvas.addEventListener("mousemove", drawMove);
		canvas.addEventListener("touchstart", drawStart);
		canvas.addEventListener("touchend", drawEnd);
		canvas.addEventListener("touchcancel", drawEnd);
		canvas.addEventListener("touchmove", drawMove);

		screen.appendChild(canvas);

		resetScreen();
	}, 200);
}

function edit() {
	initDraw();
	initPalette();

	info.classList.add("transparent");
	timeline.classList.remove("transparent");
	palette.classList.remove("transparent");
	header.classList.add("dimmed");
	drawClose.classList.remove("transparent");
}

function drawCancel() {
	drawMode = false;

	info.classList.remove("transparent");
	timeline.classList.add("transparent");
	palette.classList.add("transparent");
	header.classList.remove("dimmed");
	drawClose.classList.add("transparent");
}

function drawSave() {
	drawCancel();
}

function drawStart(event) {
	if(!drawMode) return;

	drawing = true;

	draw(event.layerX, event.layerY);
}

function drawEnd(event) {
	drawing = false;
}

function drawMove(event) {
	if(!drawing) return;

	draw(event.layerX, event.layerY);
}

function draw(x, y) {
	switch(magnifyFactor) {
	case 1:
		x = x * 2;
		y = y * 2;
		break
	case 3:
		x = parseInt(x / 3 * 2, 10);
		y = parseInt(y / 3 * 2, 10);
		break
	}

	var newX = parseInt(x / 10, 10);
	var newY = parseInt(y / 10, 10);

	if(newX !== drawX || newY !== drawY) drawPixel(newX, newY);

	drawX = newX;
	drawY = newY;
}

function drawPixel(x, y) {
	drawFrame[x][y] = drawColor;

	drawScreen(drawFrame);
}

function drawPaletteAdd() {
	if(!palette.classList.contains("add")) {
		palette.classList.add("add");
	}
	
	drawRefreshColors();
}

function randomH() {
    return Math.floor(Math.random() * 360);
}
function randomS() {
    return Math.floor((Math.random() * 81) + 10);
}
function randomL() {
    return Math.floor((Math.random() * 81) + 10);
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function drawRefreshColors() {
	var randomHue = randomH();
    var randomSat = randomS();
    var randomLight = randomL();

    function correctiveHue(x) {
        if ((randomHue + x) > 360) {
            return (randomHue + x) - 360;
        } else {
            return (randomHue + x);
        }
    }

    function correctiveSat(x) {
        if ((randomSat + x) > 100) {
            return (randomSat + x) - 100;
        } else {
            return (randomSat + x);
        }
    }

    function correctiveLight(x) {
        if ((randomLight + x) > 100) {
            return (randomLight - x);
        } else {
            return (randomLight + x);
        }
    }

	var color1 = document.createElement("div");
	color1.classList.add("color");
	var color2 = document.createElement("div");
	color2.classList.add("color");
	var color3 = document.createElement("div");
	color3.classList.add("color");

	color1.style.backgroundColor = "hsl(" + correctiveHue(-60) + ", " + correctiveSat(-15) + "%, " + correctiveLight(10) + "%)";
    color2.style.backgroundColor = "hsl(" + randomHue + ", " + randomSat + "%, " + randomLight + "%)";
    color3.style.backgroundColor = "hsl(" + correctiveHue(60) + ", " + correctiveSat(15) + "%, " + correctiveLight(10) + "%)";

    color1.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color1.style.backgroundColor)));
    color2.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color2.style.backgroundColor)));
    color3.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color3.style.backgroundColor)));

    color1.setAttribute("data-color", convert24to16(rgb2hex(color1.style.backgroundColor)));
    color2.setAttribute("data-color", convert24to16(rgb2hex(color2.style.backgroundColor)));
    color3.setAttribute("data-color", convert24to16(rgb2hex(color3.style.backgroundColor)));

    paletteAddColors.replaceChildren();
    paletteAddColors.appendChild(color1);
    paletteAddColors.appendChild(color2);
    paletteAddColors.appendChild(color3);

    initPalette();
}

function convert24to16(input) {
	var RGB888 = parseInt(input.replace(/^#/, ""), 16);
	var r = (RGB888 & 0xFF0000) >> 16;
	var g = (RGB888 & 0xFF00) >> 8;
	var b = RGB888 & 0xFF;

	r = (r * 249 + 1014) >> 11;
	g = (g * 253 + 505) >> 10;
	b = (b * 249 + 1014) >> 11;

	var RGB565 = 0;
	RGB565 = RGB565 | (r << 11);
	RGB565 = RGB565 | (g << 5);
	RGB565 = RGB565 | b;

	return RGB565.toString(16).padStart(4, "0");
}

function convert16to24(input) {
	var RGB565 = parseInt(input.replace(/^#/, ""), 16);
	var r = (RGB565 & 0xF800) >> 11;
	var g = (RGB565 & 0x07E0) >> 5;
	var b = RGB565 & 0x1F;

	r = (r * 527 + 23) >> 6;
	g = (g * 259 + 33) >> 6;
	b = (b * 527 + 23) >> 6;

	var RGB888 = 0;
	RGB888 = RGB888 | (r << 16);
	RGB888 = RGB888 | (g << 8);
	RGB888 = RGB888 | (b);

	return "#" + RGB888.toString(16).padStart(6, "0");
}

function initDraw() {
	drawMode = true;
	drawFrame = [];

	for (var i = 0; i < 24; i++) {
		drawFrame.push([]);
		for (var j = 0; j < 24; j++) {
			drawFrame[i].push("0000");
		}
	}
}

function initPalette() {
	var savedPalette = window.localStorage.getItem("palette");

	if(savedPalette) {
		savedPalette = savedPalette.split(",");

		paletteCurrentColors.replaceChildren();

		for (var i = 0; i < savedPalette.length; i++) {
			var color = document.createElement("div");
			color.classList.add("color");

			color.setAttribute("data-color", savedPalette[i]);

			paletteCurrentColors.appendChild(color);
		}
	}

	document.querySelectorAll("main .panel .palette .color").forEach(color => {
		color.style.backgroundColor = convert16to24(color.getAttribute("data-color"));
		color.removeEventListener("click", pickColor);
		color.addEventListener("click", pickColor);
	})
}

function pickColor() {
	drawColor = this.getAttribute("data-color");

	if(this.parentNode.classList.contains("add-colors")) {
		paletteAddColors.replaceChildren();
		palette.classList.remove("add");
	}

	if(drawColor === "0000" || drawColor === "ffff") return;

	var existing = -1;
	var savedPalette = [];

	for (var i = 0; i < paletteCurrentColors.children.length; i++) {
		var childrenColor = paletteCurrentColors.children[i].getAttribute("data-color");
		if(childrenColor === drawColor) {
			existing = i;
		} else {
			savedPalette.push(childrenColor);
		}
	}

	if(existing < 0) {
		paletteCurrentColors.children[paletteCurrentColors.children.length - 1].remove();
		savedPalette.pop();
	} else {
		paletteCurrentColors.children[existing].remove();
	}

	savedPalette = [drawColor].concat(savedPalette);

	window.localStorage.setItem("palette", savedPalette);

	var color = document.createElement("div");
	color.classList.add("color");

	color.setAttribute("data-color", drawColor);

	paletteCurrentColors.prepend(color);

	initPalette();
}

function resetScreen() {
	canvas.style.opacity = 0;

	switch(magnifyFactor) {
	case 1:
		pixelSize = 4;
		pixelOffset = 1;

		canvas.width = 120;
		canvas.height = 120;
		break
	case 2:
		pixelSize = 8;
		pixelOffset = 2;

		canvas.width = 240;
		canvas.height = 240;
		break
	case 3:
		pixelSize = 12;
		pixelOffset = 3;

		canvas.width = 360;
		canvas.height = 360;
		break
	}

	setTimeout(() => {
		canvas.style.display = "block";
	}, 300);

	setTimeout(() => {
		canvas.style.opacity = 1;
		if(!drawMode) info.classList.remove("transparent");
	}, 500);

	if(drawMode) {
		drawScreen(drawFrame);
	} else {
		frame = 0;
		nextFrame();
	}
}

function drawScreen(drawFrame) {
	var drawing = drawFrame ? true : false;
	drawFrame = drawFrame || frames[frame];

	canvasContext.clearRect(0, 0, canvas.width, canvas.height);

	if(!drawFrame) return;

	for (var i = 0; i < drawFrame.length; i++) {
		for (var j = 0; j < drawFrame[i].length; j++) {
			if(drawFrame[i][j]) {
				canvasContext.fillStyle = convert16to24(drawFrame[i][j]);
				canvasContext.fillRect(pixelOffset + (pixelSize + pixelOffset) * i, pixelOffset + (pixelSize + pixelOffset) * j, pixelSize, pixelSize);
			}
		}
	}

	if(drawing) return;

	frame += 1;
	if(frames.length <= frame) frame = 0;
	nextFrame();
}

function nextFrame() {
	if(loop) clearTimeout(loop);
	loop = setTimeout(drawScreen, 40);
}

// Magnifier

function magnify(factor) {
	canvas.style.display = "none";

	document.querySelectorAll(".magnifier .button").forEach(button => { button.classList.remove("active") });
	document.getElementById("magnify" + factor + "x").classList.add("active");

	switch(factor) {
	case 1:
		document.querySelector("main").classList.remove("x3");
		document.querySelector("main").classList.add("x1");
		break
	case 2:
		document.querySelector("main").classList.remove("x3");
		document.querySelector("main").classList.remove("x1");
		break
	case 3:
		document.querySelector("main").classList.remove("x1");
		document.querySelector("main").classList.add("x3");
		break
	}

	magnifyFactor = factor;
	resetScreen();
}

// Preview

function preview() {
	XHR("/api/preview", null, (data) => {
		console.log(data);
	}, (error) => {
		console.log(error);
	}, "POST", { frames })
}
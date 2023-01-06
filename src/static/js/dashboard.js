// Canvas

var screen = document.getElementById("screen");
var canvas = document.createElement("canvas");
var canvasContext = canvas.getContext("2d");

var loop, arka;

var frame = 0;
var frames = [];
var magnifyFactor = 2;

var pixelSize = 8;
var pixelOffset = 2;

function loadCurrentArka() {
	arka = loadNoiseArka();
	
	frames = arka.frames;

	document.querySelector("main .info h1").innerText = arka.title;
	document.querySelector("main .info h3").innerText = arka.author;
	document.querySelector("main .info .description").innerText = arka.description;
}

function initScreen() {
	document.querySelector("main .info .preview").addEventListener("click", preview)

	screen.appendChild(canvas);

	loadCurrentArka();

	resetScreen();
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
	}, 300)

	setTimeout(() => {
		canvas.style.opacity = 1;
	}, 500)

	frame = 0;
	nextFrame();
}

function drawScreen() {
	canvasContext.clearRect(0, 0, canvas.width, canvas.height)
	canvasContext.fillStyle = "white";

	for (var i = 0; i < frames[frame].length; i++) {
		for (var j = 0; j < frames[frame][i].length; j++) {
			if(frames[frame][i][j]) canvasContext.fillRect(pixelOffset + (pixelSize + pixelOffset) * i, pixelOffset + (pixelSize + pixelOffset) * j, pixelSize, pixelSize);
		}
	}

	frame += 1;
	if(frames.length <= frame) frame = 0;
	nextFrame();
}

function nextFrame() {
	if(loop) clearTimeout(loop);
	loop = setTimeout(drawScreen, 20);
}

initScreen();

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

document.getElementById("magnify1x").addEventListener("click", () => { magnify(1) })
document.getElementById("magnify2x").addEventListener("click", () => { magnify(2) })
document.getElementById("magnify3x").addEventListener("click", () => { magnify(3) })

// Preview

function preview() {
	XHR("/api/preview", null, (data) => {
		console.log(data);
	}, (error) => {
		console.log(error);
	}, "POST", { frames })
}
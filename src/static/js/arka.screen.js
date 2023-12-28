function screenMagnify(factor) {
	context.screen.canvas.style.display = "none";

	document.querySelectorAll("main .panel .magnifier .button").forEach(button => { button.classList.remove("active") });
	document.querySelector("main .panel .magnifier .magnify" + factor + "x").classList.add("active");

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

	context.screen.magnifyFactor = factor;

	resetScreen();
}

function screenLoad() {
	context.UI.infoView.classList.add("transparent");

	setTimeout(() => {
		var arka

		if(context && context.slider && context.slider.slides && context.slider.slides.length) {
			arka = context.slider.arkas[context.slider.slides[context.slider.index].getAttribute("data-arka")];
		}
		
		context.screen.frames = [makeEmptyFramePainter()]; // TODO: preview

		if(arka) {
			document.querySelector("main .panel .info h1").innerText = arka.title;
			document.querySelector("main .panel .info h3").innerText = arka.author;
			document.querySelector("main .panel .info .description").innerText = arka.description;

			if(arka.editable) {
				context.UI.editButton.classList.remove("displaynone");
			} else {
				context.UI.editButton.classList.add("displaynone");
			}
		}
		
		context.UI.screenView = document.querySelector("main .slider .slide.active .screen");

		document.querySelectorAll(".screen canvas").forEach((c) => c.remove());

		context.screen.canvas = document.createElement("canvas");
		context.screen.context = context.screen.canvas.getContext("2d");

		context.screen.canvas.addEventListener("mousedown", startDrawingPainter);
		context.screen.canvas.addEventListener("mouseup", endDrawingPainter);
		context.screen.canvas.addEventListener("mousemove", moveDrawingPainter);
		context.screen.canvas.addEventListener("touchstart", startDrawingPainter);
		context.screen.canvas.addEventListener("touchend", endDrawingPainter);
		context.screen.canvas.addEventListener("touchcancel", endDrawingPainter);
		context.screen.canvas.addEventListener("touchmove", moveDrawingPainter);

		context.UI.screenView.appendChild(context.screen.canvas);

		resetScreen();
	}, 200);
}

// Internal

function resetScreen() {
	context.screen.canvas.style.opacity = 0;

	switch(context.screen.magnifyFactor) {
	case 1:
		context.screen.pixelSize = 4;
		context.screen.pixelOffset = 1;

		context.screen.canvas.width = 120;
		context.screen.canvas.height = 120;
		break
	case 2:
		context.screen.pixelSize = 8;
		context.screen.pixelOffset = 2;

		context.screen.canvas.width = 240;
		context.screen.canvas.height = 240;
		break
	case 3:
		context.screen.pixelSize = 12;
		context.screen.pixelOffset = 3;

		context.screen.canvas.width = 360;
		context.screen.canvas.height = 360;
		break
	}

	setTimeout(() => {
		context.screen.canvas.style.display = "block";
	}, 300);

	setTimeout(() => {
		context.screen.canvas.style.opacity = 1;
		if(!context.painter.active) context.UI.infoView.classList.remove("transparent");
	}, 500);

	if(context.painter.active) {
		renderScreen(context.painter.frame);
	} else {
		frame = 0;
		nextFrameScreen();
	}
}

function renderScreen(drawFrame) {
	var drawing = drawFrame ? true : false;
	drawFrame = drawFrame || context.screen.frames[context.screen.frame];

	if(!context.screen.context) return;

	context.screen.context.clearRect(0, 0, context.screen.canvas.width, context.screen.canvas.height);

	if(!drawFrame) return;

	for (var i = 0; i < drawFrame.length; i++) {
		for (var j = 0; j < drawFrame[i].length; j++) {
			if(drawFrame[i][j]) {
				context.screen.context.fillStyle = convert16to24(drawFrame[i][j]);
				context.screen.context.fillRect(context.screen.pixelOffset + (context.screen.pixelSize + context.screen.pixelOffset) * i, context.screen.pixelOffset + (context.screen.pixelSize + context.screen.pixelOffset) * j, context.screen.pixelSize, context.screen.pixelSize);
			}
		}
	}

	if(context.painter.active) return;

	context.screen.frame += 1;
	if(context.screen.frames.length <= context.screen.frame) context.screen.frame = 0;
	nextFrameScreen();
}

function nextFrameScreen() {
	if(context.screen.loop) clearTimeout(context.screen.loop);
	context.screen.loop = setTimeout(renderScreen, 40);
}
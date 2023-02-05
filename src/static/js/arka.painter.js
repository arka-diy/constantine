function painterClear() {
	context.painter.frame = makeEmptyFramePainter();

	renderScreen(context.painter.frame);
}

function painterPaletteAddColor() {
	if(!context.UI.paletteView.classList.contains("add")) {
		context.UI.paletteView.classList.add("add");
	}
	
	paletteRefreshPainter();
}

// Internal

function initPainter() {
	context.painter.active = true;

	painterClear();

	screenLoad();
}

function initPalette() {
	var savedPalette = window.localStorage.getItem("palette");

	if(savedPalette) {
		savedPalette = savedPalette.split(",");

		context.UI.paletteCurrentColorsView.replaceChildren();

		for (var i = 0; i < savedPalette.length; i++) {
			var color = document.createElement("div");
			color.classList.add("color");
			color.classList.add("button");

			color.setAttribute("data-color", savedPalette[i]);

			context.UI.paletteCurrentColorsView.appendChild(color);
		}
	}

	paletteUpdatePainter();
}

function makeEmptyFramePainter() {
	var frame = [];

	for (var i = 0; i < 24; i++) {
		frame.push([]);
		for (var j = 0; j < 24; j++) {
			frame[i].push("0000");
		}
	}

	return frame;
}

function checkEmptyFramePainter(frame) {
	if(!frame) return true;

	for (var i = 0; i < frame.length; i++) {
		for (var j = 0; j < frame[i].length; j++) {
			if(frame[i][j] !== "0000") return false;
		}
	}

	return true;
}

function startDrawingPainter(event) {
	if(!context.painter.active) return;

	context.painter.drawing = true;

	drawPainter(event.layerX, event.layerY);
}

function endDrawingPainter(event) {
	context.painter.drawing = false;
}

function moveDrawingPainter(event) {
	if(!context.painter.drawing) return;

	drawPainter(event.layerX, event.layerY);
}

function drawPainter(x, y) {
	switch(context.screen.magnifyFactor) {
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

	if(newX !== context.painter.x || newY !== context.painter.y) drawPixelPainter(newX, newY);

	context.painter.x = newX;
	context.painter.y = newY;

	saveFrameAnimator();
}

function drawPixelPainter(x, y) {
	context.painter.frame[x][y] = context.painter.color;

	renderScreen(context.painter.frame);
}

function paletteRefreshPainter() {
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
	color1.classList.add("button");

	var color2 = document.createElement("div");
	color2.classList.add("color");
	color2.classList.add("button");

	var color3 = document.createElement("div");
	color3.classList.add("color");
	color3.classList.add("button");

	color1.style.backgroundColor = "hsl(" + correctiveHue(-60) + ", " + correctiveSat(-15) + "%, " + correctiveLight(0) + "%)";
    color2.style.backgroundColor = "hsl(" + randomHue + ", " + randomSat + "%, " + randomLight + "%)";
    color3.style.backgroundColor = "hsl(" + correctiveHue(60) + ", " + correctiveSat(15) + "%, " + correctiveLight(0) + "%)";

    color1.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color1.style.backgroundColor)));
    color2.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color2.style.backgroundColor)));
    color3.style.backgroundColor = "#" + convert16to24(convert24to16(rgb2hex(color3.style.backgroundColor)));

    color1.setAttribute("data-color", convert24to16(rgb2hex(color1.style.backgroundColor)));
    color2.setAttribute("data-color", convert24to16(rgb2hex(color2.style.backgroundColor)));
    color3.setAttribute("data-color", convert24to16(rgb2hex(color3.style.backgroundColor)));

    context.UI.paletteAddColorsView.replaceChildren();
    
    context.UI.paletteAddColorsView.appendChild(color1);
    context.UI.paletteAddColorsView.appendChild(color2);
    context.UI.paletteAddColorsView.appendChild(color3);

    paletteUpdatePainter();
}

function paletteUpdatePainter() {
	document.querySelectorAll("main .toolbar .palette .color").forEach(color => {
		color.style.backgroundColor = convert16to24(color.getAttribute("data-color"));
		color.removeEventListener("click", pickColorPainter);
		color.addEventListener("click", pickColorPainter);
	});

	var colorPicked = document.querySelectorAll("main .toolbar .current-colors .color")[0].style.backgroundColor;

	switch(context.painter.color) {
	case "ffff":
		colorPicked = "rgba(255,255,255,1)";
		break
	case "0000":
		colorPicked = "rgba(0,0,0,1)";
		break
	}

	document.querySelector("main .toolbar .tool .pixel").style.setProperty("--color", colorPicked);
}

function pickColorPainter() {
	context.painter.color = this.getAttribute("data-color");

	if(this.parentNode.classList.contains("add-colors")) {
		context.UI.paletteAddColorsView.replaceChildren();
		context.UI.paletteView.classList.remove("add");
	}

	if(context.painter.color === "0000" || context.painter.color === "ffff") return paletteUpdatePainter();

	var existing = -1;
	var savedPalette = [];

	for (var i = 0; i < context.UI.paletteCurrentColorsView.children.length; i++) {
		var childrenColor = context.UI.paletteCurrentColorsView.children[i].getAttribute("data-color");
		if(childrenColor === context.painter.color) {
			existing = i;
		} else {
			savedPalette.push(childrenColor);
		}
	}

	if(existing < 0) {
		context.UI.paletteCurrentColorsView.children[context.UI.paletteCurrentColorsView.children.length - 1].remove();
		savedPalette.pop();
	} else {
		context.UI.paletteCurrentColorsView.children[existing].remove();
	}

	savedPalette = [context.painter.color].concat(savedPalette);

	window.localStorage.setItem("palette", savedPalette);

	var color = document.createElement("div");
	color.classList.add("color");
	color.classList.add("button");

	color.setAttribute("data-color", context.painter.color);

	context.UI.paletteCurrentColorsView.prepend(color);

	paletteUpdatePainter();
}
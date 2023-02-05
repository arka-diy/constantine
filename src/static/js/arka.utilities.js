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

function zip(frame) {
	const shared = frame.type + ":" + frame.index;
	return shared + (frame.frame ? (":" + frame.frame.map((line) => { return line.map((pixel) => { return pixel.toString() }).join("") }).join("")) : "");
}

function unzip(string) {
	var split = string.split(":");

	var frame = {
		index: parseInt(split[1], 10),
		type: split[0]
	}

	if(split.length > 2) {
		var chunks = split[2].match(/.{1,4}/g);
		if (chunks.length !== 576) {
			console.error('Unexpected number of chunks');
		} else {
			frame.frame = [];
			for (let i = 0; i < chunks.length; i += 24) {
				frame.frame.push(chunks.slice(i, i + 24));
			}
		}
	}

	return frame;
}

var alphabet5px = {
	"A": [[1,2],[0,3],[0,1,2,3],[0,3],[0,3]],
	"B": [[0,1,2],[0,3],[0,1,2],[0,3],[0,1,2]], //?
	"C": [[1,2],[0],[0],[0],[1,2]],
	"D": [[0,1,2],[0,3],[0,3],[0,3],[0,1,2]], //?
	"E": [[0,1,2],[0],[0,1,2],[0],[0,1,2]],
	"F": [[0,1,2],[0],[0,1],[0],[0]],
	"G": [[1,2,3],[0],[0],[0,3],[1,2,3]],
	"H": [[0,3],[0,3],[0,1,2,3],[0,3],[0,3]],
	"I": [[0,1,2],[1],[1],[1],[0,1,2]],
	"J": [[3],[3],[3],[0,3],[1,2]],
	"K": [[0,3],[0,2],[0,1,2],[0,3],[0,3]],
	"L": [[0],[0],[0],[0],[0,1,2]],
	"M": [[0,1,2,3],[0,1,3],[0,3],[0,3],[0,3]],
	"N": [[0,3],[0,3],[0,1,3],[0,2,3],[0,3]],
	"O": [[1,2],[0,3],[0,3],[0,3],[1,2]],
	"P": [[0,1,2],[0,3],[0,1,2],[0],[0]],
	"Q": [[1,2],[0,3],[0,3],[0,3],[1,2,3]],
	"R": [[0,1,2],[0,3],[0,1,2],[0,3],[0,3]],
	"S": [[1,2,3],[0],[0,1,2,3],[3],[0,1,2]],
	"T": [[0,1,2],[1],[1],[1],[1],[1]],
	"U": [[0,3],[0,3],[0,3],[0,3],[1,2]],
	"V": [[0,2],[0,2],[0,2],[0,2],[1]],
	"W": [[0,3],[0,3],[0,3],[0,1,2,3],[1,2]],
	"X": [[0,3],[0,3],[1,2],[0,3],[0,3]],
	"Y": [[0,2],[0,2],[1],[1],[1]],
	"Z": [[0,1,2,3],[3],[1,2],[0],[0,1,2,3]],
	"0": [[0,1,2],[0,2],[0,2],[0,2],[0,1,2]],
	"1": [[1],[0,1],[1],[1],[1]],
	"2": [[0,1,2],[2],[0,1,2],[0],[0,1,2]],
	"3": [[0,1,2],[2],[0,1,2],[2],[0,1,2]],
	"4": [[0,2],[0,2],[0,1,2],[2],[2]],
	"5": [[0,1,2],[0],[0,1,2],[2],[0,1,2]],
	"6": [[0,1,2],[0],[0,1,2],[0,2],[0,1,2]],
	"7": [[0,1,2],[2],[2],[2],[2]],
	"8": [[0,1,2],[0,2],[0,1,2],[0,2],[0,1,2]],
	"9": [[0,1,2],[0,2],[0,1,2],[2],[0,1,2]]
}
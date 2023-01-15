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
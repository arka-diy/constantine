function loadNoiseArka() {
	var arka = new Arka();

	arka.setAnimation("noise", (parameters) => {
		var frames = [];

		// Generating 30 random frames
		for (var f = 0; f < 30; f++) {
			// 24x24 pixels:
			var matrix = [];
			for (var i = 0; i < 24; i++) {
				var line = [];
				for (var j = 0; j < 24; j++) {
					const random = Math.random();
					line.push(random < 0.75 ? (random < 0.5 ? (random < 0.25 ? "ffff" : "cccc") : "9999") : "0000");
				}
				matrix.push(line);
			}
			frames.push(matrix);
		}

		return frames;
	});

	return {
		preview: arka.preview(),
		title: "Noise",
		author: "Aleksei Pugachev",
		description: "Generates random noise",
		editable: false
	}
}
function loadNoiseArka() {
	var frames = [];
	for (var f = 0; f < 24; f++) {
		var frame = [];
		for (var i = 0; i < 24; i++) {
			var line = [];
			for (var j = 0; j < 24; j++) {
				line.push(Math.random() < 0.5 ? 1 : 0);
			}
			frame.push(line);
		}
		frames.push(frame);
	}

	return {
		frames,
		title: "Noise",
		author: "Aleksei Pugachev",
		description: "Generates random noise",
		editable: false
	}
}
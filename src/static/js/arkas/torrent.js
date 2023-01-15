function loadTorrentArka() {
	var arka = new Arka();

	arka.setAnimation("torrent.add", (parameters) => {
		var frames = [];

		

		return frames;
	});

	arka.setAnimation("torrent.complete", (parameters) => {
		var frames = [];

		

		return frames;
	});

	return {
		preview: arka.preview(),
		title: "Torrent",
		author: "Aleksei Pugachev",
		description: "Torrent events to notify",
		editable: false
	}
}


function xhrPreview() {
	XHR("/api/preview", null, (data) => {
		console.log(data);
	}, (error) => {
		console.log(error);
	}, "POST", { frames: context.screen.frames })
}
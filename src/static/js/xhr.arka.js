function xhrPreview() {
	XHR("/api/preview", null, (data) => {
		console.log(data);
	}, (error) => {
		console.log(error);
	}, "POST", { frames: context.screen.frames })
}

function xhrSave(identificator, animations, base, title) {
	var parameters = { identificator, animations }

	if(base && title) {
		parameters.base = base
		parameters.title = title
	}

	XHR("/api/save", null, (data) => {
		console.log(data);
	}, (error) => {
		console.log(error);
	}, "POST", parameters)
}
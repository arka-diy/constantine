const mongoose = require("mongoose"),
	  fs = require("fs")

module.exports = (config, utilities) => {
	mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })

	var models = {}

	const files = fs.readdirSync(__dirname)

	for (var i = 0; i < files.length; i++) {
		const file = files[i]

		if(file !== "index.js") {
			const model = require(__dirname + "/" + file)(mongoose, config, utilities)

			models[model.name] = model.model
		}
	}

	return models
}
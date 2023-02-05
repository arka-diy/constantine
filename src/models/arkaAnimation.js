const name = "ArkaAnimation"

module.exports = function(mongoose) {
	const schema = new mongoose.Schema({

		identificator: { type: String },

		layerTop: [{ type: String }],
		layerMiddle: [{ type: String }],
		layerBottom: [{ type: String }],

		code: { type: String },

		createdAt: { type: Date, default: Date.now }

	})

	return { name: name, model: mongoose.model(name, schema) }
}
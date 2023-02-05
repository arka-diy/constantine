const name = "Arka"

module.exports = function(mongoose) {
	const schema = new mongoose.Schema({

		identificator: { type: String },
		type: { type: String },

		title: { type: String },
		author: { type: String },
		description: { type: String },

		editable: { type: Boolean, default: false },

		animations: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArkaAnimation" }],

		// TODO: animations triggers (code?)

		createdAt: { type: Date, default: Date.now }

	})

	return { name: name, model: mongoose.model(name, schema) }
}
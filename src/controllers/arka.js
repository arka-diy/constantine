const net = require("net")

module.exports = (LIT) => {

	var client
	var reconnect
	var reconnectDelay = 1000

	function connect() {
		client = new net.Socket()

		client.connect(8080, "192.168.1.101", function() {
			console.log("C: CONNECTED")

			reconnectDelay = 1000
		})
		.on("error", (error) => {
			console.log("C: ERR " + error)
		})
		.on("data", (data) => {
			console.log("C: RX " + data)
			// client.destroy()
		})
		.on("close", () => {
			client = null
			reconnectDelay = parseInt(reconnectDelay * 1.5, 10)
			
			if(reconnectDelay > 60000) reconnectDelay = 60000

			console.log("C: CLOSED, RECONNECT IN " + reconnectDelay + "ms...")

			clearTimeout(reconnect)
			reconnect = setTimeout(connect, reconnectDelay)
		})
	}

	connect()

	// Arka (/)

	LIT.app.get("/", arka)

	async function arka(req, res) {
		const arkas = await LIT.models.Arka.find().populate("animations")

		res.render("arka.twig", {
			arkas: JSON.stringify(arkas)
		})
	}

	// API: Arka Save (/api/save)

	LIT.app.post("/api/save", save)

	async function save(req, res) {
		const { identificator, base, title } = req.body

		var rawAnimations = req.body.animations
		if(!rawAnimations) return res.status(401).send({ error: "animations_required" })

		// TODO: raw animations parse check

		var arka

		if(!identificator) return res.status(401).send({ error: "identificator_required" })
		else {
			if(base) {
				const baseArka = await LIT.models.Arka.findOne({ identificator: base })
				if(!baseArka) return res.status(403).send({ error: "base_arka_not_found" })

				var animations = []

				// TODO: create animations

				arka = new LIT.models.Arka.create({
					identificator,
					type: baseArka.type,
					title: title || "Untitled",
					author: baseArka.author, // TODO
					description: baseArka.description, // TODO
					editable: true,
					animations
				})
			} else {
				arka = await LIT.models.Arka.findOne({ identificator }).populate("animations")
				if(!arka) return res.status(403).send({ error: "arka_not_found" })

				for (var i = 0; i < arka.animations.length; i++) {
					const animation = arka.animations[i]
					
					const raw = rawAnimations.filter(raw => { return animation.identificator === raw.identificator })[0]
					if(!raw) continue
					
					animation.layerTop = raw.layers.top
					animation.layerMiddle = raw.layers.middle
					animation.layerBottom = raw.layers.bottom
					
					await animation.save()
				}
			}
		}

		res.send({ ok: true })
	}

	// API: Arka Preview (/api/preview)

	LIT.app.post("/api/preview", preview)

	async function preview(req, res) {
		const frames = req.body.frames
		const packed = frames.map((frame) => { return frame.map((line) => { return line.map((pixel) => { return pixel.toString() }).join("") }).join("") }).join("")
		
		if(client) {
			client.write(packed + ".")
			res.send({ ok: true })
		} else {
			res.send({ ok: false })
		}
	}

}
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

	LIT.app.get("/", dashboard)

	async function dashboard(req, res) {
		res.render("dashboard.twig", {
			
		})
	}

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
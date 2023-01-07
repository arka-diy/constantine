const net = require("net")

module.exports = (LIT) => {

	const client = new net.Socket()
	var reconnect

	client.on("data", function(data) {
		console.log("Received: " + data)
		// client.destroy()
	})

	client.on("close", function() {
		console.log("Connection closed")
		clearTimeout(reconnect)
		reconnect = setTimeout(connect, 3000)
	})

	function connect() {
		client.connect(8080, "192.168.1.101", function() {
			console.log("Connected")
		})
		.on("error", (err) => console.log("not connected"))
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
		
		client.write(packed + ".")

		res.send({ ok: true })
	}

}
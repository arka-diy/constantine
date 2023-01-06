const net = require("net")

module.exports = (LIT) => {

	LIT.app.get("/", dashboard)

	async function dashboard(req, res) {
		res.render("dashboard.twig", {
			
		})
	}

	LIT.app.post("/api/preview", preview)

	async function preview(req, res) {
		const frames = req.body.frames

		var client = new net.Socket()

		client.connect(8080, "127.0.0.1", function() {
			console.log("Connected")
			client.write("Hello, server! Love, Client.")
		})

		client.on("data", function(data) {
			console.log("Received: " + data)
			client.destroy()
		})

		client.on("close", function() {
			console.log("Connection closed")
		})

		res.send({ ok: true })
	}

}
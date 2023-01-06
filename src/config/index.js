var config = require("./config." + (process.env.NODE_ENV ? process.env.NODE_ENV : "dev"))

Object.assign(config, require("./config"))

module.exports = config
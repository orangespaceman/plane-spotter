const config = require('../config')
let io = null

function log () {
    if (config.debug) {
        console.log.apply(console, arguments)
        io.emit.call(io, 'debug', Array.prototype.slice.call(arguments))
    }
}

function storeSocketReference (ioReference) {
    io = ioReference
}

module.exports = {
    log: log,
    storeSocketReference: storeSocketReference
}
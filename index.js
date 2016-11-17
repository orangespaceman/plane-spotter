const fs = require('fs')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const exec = require('child_process').exec

const config = require('./config')
const debug = require('./lib/debug')

debug.storeSocketReference(io)

const updateCsvFiles = require('./lib/update-csv-files')
const getIp = require('./lib/get-ip')
const findClosestPlane = require('./lib/find-closest-plane')
const findPlaneRoute = require('./lib/find-plane-route')
const findImage = require('./lib/find-image')

let state = {}
let lastState = {}

init()

function init () {
    updateCsvFiles()

    app.use(express.static('client'))

    app.get('/', (req, res) => {
        res.sendFile('index.html', {root: `${__dirname}/client/`})
    })

    http.listen(config.port, () => {
        if (config.launch.application && config.launch.flags) {
            exec(`${config.launch.application} ${state.url} ${config.launch.flags}`, () => { debug.log(arguments) })
        }
        debug.log(`Server running: ${state.url}`)
    })

    io.on('connection', (socket) => {
      socket.emit('state', state)
    })

    updateState()
}

function updateState () {
    lastState = state
    state = {}
    state.url = `http://${getIp()}:${config.port}`

    findPlane(state)
        .then(findRoute)
        .then(retrieveImage)
        .catch(displayPlaceholderImage)
        .then(updateDisplay)
        .then(() => {
            setTimeout(updateState, config.timeout)
        })
}

function findPlane (state) {
    return new Promise((resolve, reject) => {
        state.planes = JSON.parse(fs.readFileSync(config.planeData))
        debug.log(`${state.planes.aircraft.length} planes found`)

        let {plane, distance} = findClosestPlane(state.planes.aircraft)
        state.plane = plane
        state.distance = distance

        if (!state.plane) {
            debug.log('No nearby plane found')
            reject(state)
        } else {
            debug.log('Nearby plane found:', state.plane.flight)
            resolve(state)
        }
    })
}

function findRoute (state) {
    return new Promise((resolve, reject) => {
        state.route = findPlaneRoute({plane: state.plane})
        if (!state.route) {
            debug.log('No route found')
            reject(state)
        } else {
            debug.log('Route found:', state.route.description)
            resolve(state)
        }
    })
}

function retrieveImage (state) {
    return new Promise((resolve, reject) => {
        const imagePromise = findImage(state.route.feature.municipality, state.route.feature.iso_country)
        imagePromise.then(imagePath => {
            state.imagePath = imagePath
            resolve(state)
        }).catch((err) => {
            reject(state)
        })
    })
}

function displayPlaceholderImage (state) {
    return new Promise((resolve, reject) => {
        delete state.plane
        delete state.distance
        state.route = {}

        const path = 'client/images/placeholder/'
        const files = fs.readdirSync(path)
        const image = files[Math.floor(Math.random() * files.length)]

        state.imagePath = path.replace('client/', '') + image
        state.route.description = image.replace('.jpg', '').replace('-', ' ') + ' (placeholder)'

        debug.log('Displaying placeholder image', state.route.description)
        resolve(state)
    })
}

function updateDisplay (state) {
    io.emit('state', state)
    debug.log(`---`)
}

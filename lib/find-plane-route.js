const config = require ('../config')
const debug = require('./debug')
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const _ = require('lodash')
const haversine = require('haversine')

debug.log(`parsing flight data`)
const flightData = parse(fs.readFileSync('data/flights.csv'), {columns: true})
debug.log(`parsing airport data`)
const airportData = parse(fs.readFileSync('data/airports.csv'), { columns: true})
debug.log(`parsing data complete`)

function findPlaneRoute ({plane}) {
    const routeName = findRoute(plane)
    if (!routeName) return

    const [origin, destination] = routeName.Route.split('-')
    const route = {}

    route.origin = findAirport(origin)
    route.destination = findAirport(destination)

    const distanceFromOrigin = haversine(config.position, {latitude: route.origin.latitude_deg, longitude: route.origin.longitude_deg})
    const distanceFromDestination = haversine(config.position, {latitude: route.destination.latitude_deg, longitude: route.destination.longitude_deg})

    debug.log(`Origin distance: ${distanceFromOrigin.toFixed(2)}mi, destination distance: ${distanceFromDestination.toFixed(2)}mi`)

    if (distanceFromDestination < distanceFromOrigin) {
        route.feature = route.origin
    } else {
        route.feature = route.destination
    }

    route.description = `${route.origin.municipality}, ${route.origin.iso_country} - ${route.destination.municipality}, ${route.destination.iso_country}`

    return route
}

function findRoute (plane) {
    const airlineCode = plane.flight.trim().slice(0, 3)
    const flightNumber = plane.flight.trim().slice(3)

    return _.find(flightData, {'AirlineCode': airlineCode, 'FlightNumber': flightNumber})
}

function findAirport (ident) {
    return _.find(airportData, {'ident': ident})
}

module.exports = findPlaneRoute

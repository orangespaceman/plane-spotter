const config = require ('../config')
const debug = require('./debug')
const haversine = require('haversine')

function findClosestPlane (planes) {
    let closestPlane
    let closestDistance
    let mostRecentlySeenPlane
    let mostRecentlySeenPlaneTime

    planes.forEach(plane => {
        if (!plane.flight || !'seen' in plane) return
        if (!mostRecentlySeenPlaneTime || plane.seen < mostRecentlySeenPlaneTime) {
            mostRecentlySeenPlane = plane
            mostRecentlySeenPlaneTime = plane.seen
        }
        if (plane.lat && plane.lon) {
            let distance = haversine(config.position, {
                latitude: plane.lat,
                longitude: plane.lon
            })
            debug.log(`Plane: ${plane.flight.trim()}, Distance: ${distance.toFixed(2)}mi`)
            if (!closestDistance || distance < closestDistance) {
                closestDistance = distance
                closestPlane = plane
            }
        }
    })
    if (closestPlane) {
        return {plane: closestPlane, distance: closestDistance}
    } else if (mostRecentlySeenPlane) {
        return {plane: mostRecentlySeenPlane}
    } else {
        return {}
    }
}

module.exports = findClosestPlane
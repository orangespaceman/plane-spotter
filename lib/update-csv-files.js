const debug = require('./debug')
const config = require('../config')
const request = require('request')
const fs = require('fs')

const files = [
    {
        path: 'data/airports.csv',
        location: 'http://ourairports.com/data/airports.csv'
    },
    {
        path: 'data/flights.csv',
        location: 'http://www.virtualradarserver.co.uk/Files/FlightNumbers.csv'
    }
]

function updateCsvFiles () {
    files.forEach(file => {
        fs.stat(file.path, (err, stat) => {
            if (err) {
                debug.log('ERROR: updateCsvFiles', err)
                return
            }
            const fileAge = new Date(stat.ctime).getTime()
            if (fileAge < config.maxAge) {
                debug.log(`${file.path} is older than one month, updating`)
                request(file.location).pipe(fs.createWriteStream(file.path))
            }
        })
    })
}

module.exports = updateCsvFiles
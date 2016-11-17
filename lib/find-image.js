const config = require('../config')
const debug = require('./debug')
const fs = require('fs')
const googleImages = require('google-images')
const request = require('request')
const gm = require('gm').subClass({imageMagick: true})
const smartcrop = require('smartcrop-gm')

function findImage (municipality, country) {
    const location = `${municipality}, ${country}`
    const locationFile = location.replace(/[^a-z0-9]/gi, '-').toLowerCase()

    const imagePath = `./client/images/routes/${locationFile}.jpg`
    const imagePathPublic = `images/routes/${locationFile}.jpg`

    return new Promise((resolve, reject) => {
        fs.access(imagePath, fs.F_OK, err => {
            if (err) {
                debug.log(`Image doesn't exist:`, imagePath)
                return requestImage(location, imagePath, imagePathPublic)
                    .then(image => {
                        if (image) {
                            return resolve(image)
                        } else {
                            return reject()
                        }
                    })
                    .catch(reject)
            }
            fs.stat(imagePath, (err, stat) => {
                if (new Date(stat.ctime).getTime() < config.maxAge) {
                    debug.log(`Image is too old:`, imagePath)
                    return requestImage(location, imagePath, imagePathPublic)
                        .then(image => {
                            if (image) {
                                return resolve(image)
                            } else {
                                return reject()
                            }
                        })
                        .catch(reject)
                } else {
                    debug.log(`Image already exists:`, imagePath)
                    return resolve(imagePathPublic)
                }
            })
        })
    })
}

function requestImage (location, imagePath, imagePathPublic) {
    return searchForImage(location)
            .then(src => {
                debug.log('Downloading image:', src)
                return downloadCropImage({
                    src,
                    dest: imagePath
                })
            })
            .then(image => {
                debug.log('Image created:', image)
                return imagePathPublic
            })
            .catch(err => {
                debug.log('Image download error:', err)
                return
            })
}

function searchForImage (location) {
    return new Promise((resolve, reject) => {
        debug.log('Searching for:', location)
        const client = googleImages(config.googleCseId, config.googleApiKey)
        client
            .search(location, {size: 'large'})
            .then(images => {
                debug.log(`Found ${images.length} images`)
                let src = images[0].url
                resolve(src)
            })
            .catch(err => {
                reject(err)
            })
    })
}

function downloadCropImage ({src, dest}) {
    return new Promise((resolve, reject) => {
        request(src, {encoding: null}, (error, response, body) => {
            if (error) reject(error)
            smartcrop
                .crop(body, {width: config.screen.width, height: config.screen.height})
                .then(result => {
                    var crop = result.topCrop
                    gm(body)
                        .crop(crop.width, crop.height, crop.x, crop.y)
                        .resize(config.screen.width, config.screen.height)
                        .write(dest, (error) => {
                            if (error) reject(error)
                            resolve(dest)
                        })
                }).catch(err => {
                    reject(err)
                })
        })
    })
}

module.exports = findImage
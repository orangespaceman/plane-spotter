const config = {
    // planeData: './example-plane-data.json',
    planeData: '/run/dump1090-mutability/aircraft.json',
    debug: false,
    port: 3000,
    position: {
        latitude: 50.829,
        longitude: -0.141
    },
    screen: {
        width: 480,
        height: 320
    },
    maxAge: new Date().getTime() - (1000 * 60 * 60 * 24 * 30),
    timeout: 10000,
    launch: {
        application: 'chromium-browser',
        flags: '--noerrdialogs --kiosk --incognito --display=:0 &'
    },
    googleCseId: '',
    googleApiKey: ''
}

module.exports = config
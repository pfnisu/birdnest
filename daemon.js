require('dotenv').config()
const fs = require('fs')
const xml = require('xml-js')
const URL = process.env.URL
const TT = process.env.TIMEOUT
const DB = process.env.DB
const interval = 1000
const origo = 250000
const zone = 100000
let running = false

// Calculate distance from birdnest
const radius = (x, y) =>
    Math.sqrt((x - origo) * (x - origo) + (y - origo) * (y - origo))

// Fetch xml and return array of drones inside no-fly zone
const getDrones = async () => {
    try {
        let resp = await fetch(`${URL}drones`)
        let json = xml.xml2js(await resp.text(), {compact: true})
        return json.report.capture.drone.filter(drone => {
            drone.timestamp = json.report.capture._attributes.snapshotTimestamp
            drone.radius = radius(drone.positionX._text, drone.positionY._text)
            return drone.radius < zone
        })
    } catch (e) {
        console.log(e)
    }
}

// Add new offenders to db every second
// TODO remove duplicates and old entries
// TODO use proper datastore
const updateList = async (timeout) => {
    running = true
    console.log(`Daemon started for ${timeout} seconds`)

    // Fetch every second until timeout hits 0
    const id = setInterval(async () => {
        // Open a stream for writing
        let stream = fs.createWriteStream(DB, {flags:'a'})
        if (--timeout < 0) {
            clearInterval(id)
            running = false
            console.log('Daemon stopped')
        }
        for (const drone of await getDrones()) {
            const sn = drone.serialNumber._text
            let resp = await fetch(`${URL}pilots/${sn}`)
            let json = await resp.json()
            // Format data for frontend
            const data = {
                id: json.pilotId,
                name: `${json.firstName} ${json.lastName}`,
                sn: sn,
                radius: drone.radius,
                date: drone.timestamp,
            }
            stream.write(`,\n${JSON.stringify(data)}`)
        }
        stream.end()
    }, interval)
}

// Start daemon if not running
module.exports = (timeout = TT) => {
    !running
        ? updateList(timeout)
        : console.log('Daemon already running')
}

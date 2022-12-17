require('dotenv').config()
const fs = require('fs')
const xml = require('xml-js')
const db = require('./db.js')
const interval = 2000
const origo = 250000
const zone = 100000
let running = false

// Calculate distance from birdnest
const radius = (x, y) =>
    Math.sqrt((x - origo) * (x - origo) + (y - origo) * (y - origo))

// Fetch xml and return array of drones inside no-fly zone
const getDrones = async () => {
    try {
        let resp = await fetch(`${process.env.URL}drones`)
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
        if (--timeout < 0) {
            clearInterval(id)
            running = false
            console.log('Daemon stopped')
        }
        for (const drone of await getDrones()) {
            const sn = drone.serialNumber._text
            // TODO handle random 404
            let resp = await fetch(`${process.env.URL}pilots/${sn}`)
            let json = await resp.json()
            await db.add({
                id: json.pilotId,
                name: `${json.firstName} ${json.lastName}`,
                phone: json.phoneNumber,
                email: json.email,
                // TODO map view needs coords: do a separate query
                //x: drone.positionX,
                //y: drone.positionY,
                radius: drone.radius,
                dt: drone.timestamp,
            })
        }
    }, interval)
}

// Start daemon if not running
module.exports = (timeout = process.env.TIMEOUT) => {
    !running
        ? updateList(timeout)
        : console.log('Daemon already running')
}

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
    Math.sqrt((x - origo) ** 2 + (y - origo) ** 2)

// Fetch xml and return array of drones inside no-fly zone
const getDrones = async () => {
    let resp = await fetch(`${process.env.URL}drones`)
    let json = xml.xml2js(await resp.text(), {compact: true})
    return json.report.capture.drone.filter(drone => {
        drone.timestamp = json.report.capture._attributes.snapshotTimestamp
        drone.radius = radius(drone.positionX._text, drone.positionY._text)
        return drone.radius < zone
    })
}

// Add new offenders to db every interval until timeout hits 0
const update = async (timeout) => {
    running = true
    console.log(`Daemon started for ${timeout} seconds`)
    timeout = interval / timeout / 10
    // Purge old entries when starting daemon
    await db.purge()

    const id = setInterval(async () => {
        if (--timeout < 0) {
            clearInterval(id)
            running = false
            console.log('Daemon stopped')
        }
        try {
            for (const drone of await getDrones()) {
                const sn = drone.serialNumber._text
                let resp = await fetch(`${process.env.URL}pilots/${sn}`)
                let json = await resp.json()
                await db.add({
                    id: json.pilotId,
                    name: `${json.firstName} ${json.lastName}`,
                    phone: json.phoneNumber,
                    email: json.email,
                    x: drone.positionX._text,
                    y: drone.positionY._text,
                    radius: drone.radius,
                    dt: drone.timestamp,
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, interval)
}

// Start daemon if not running
module.exports = (timeout = process.env.TIMEOUT) => {
    if (!running) update(timeout)
}

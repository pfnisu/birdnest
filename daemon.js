require('dotenv').config()
const fs = require('fs')
const xml = require('xml-js')
const db = require('./db/write.js')

// Calculate distance from birdnest
const radius = (x, y, origo = 250000) =>
    Math.sqrt((x - origo) ** 2 + (y - origo) ** 2)

// Fetch xml and return array of drones inside no-fly zone
const getDrones = async (zone = 100000) => {
    let resp = await fetch(`${process.env.URL}drones`)
    let json = xml.xml2js(await resp.text(), {compact: true})
    return json.report.capture.drone.filter(drone => {
        // Add all detected drones to db
        const data = {
            sn: drone.serialNumber._text,
            x: drone.positionX._text,
            y: drone.positionY._text,
            radius: radius(drone.positionX._text, drone.positionY._text),
            dt: json.report.capture._attributes.snapshotTimestamp,
        }
        db.addDrone(data)
        // Filter to violating drones
        return data.radius < zone
    })
}

// Start daemon
module.exports = async (timeout = process.env.TIMEOUT, interval = 2000) => {
    // Purge old entries when starting daemon
    await db.onStart(process.pid)
    console.log(`Daemon started for ${timeout} seconds`)
    timeout = interval / timeout / 10
    // Add new offenders to db every interval until timeout hits 0
    const id = setInterval(async () => {
        if (--timeout < 0) {
            clearInterval(id)
            await db.onStop(process.pid)
            console.log('Daemon stopped')
            return
        }
        try {
            for (const drone of await getDrones()) {
                const sn = drone.serialNumber._text
                let resp = await fetch(`${process.env.URL}pilots/${sn}`)
                let json = await resp.json()
                await db.addPilot({
                    id: json.pilotId,
                    name: `${json.firstName} ${json.lastName}`,
                    phone: json.phoneNumber,
                    email: json.email,
                    sn: sn,
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, interval)
}

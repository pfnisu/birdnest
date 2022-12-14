require('dotenv').config()
const port = process.env.PORT
const db = process.env.DB
const express = require('express')
const fs = require('fs')
const xml = require('xml-js')

// Calculate distance from birdnest
const getRadius = (x, y) => {
    const origo = 250000
    return Math.sqrt((x - origo) * (x - origo) + (y - origo) * (y - origo))
}

// Fetch xml and return array of drones inside no-fly zone
const getDrones = async () => {
    let resp = await fetch('https://assignments.reaktor.com/birdnest/drones')
    let json = xml.xml2js(await resp.text(), {compact: true})
    return json.report.capture.drone.filter(drone =>
        getRadius(drone.positionX._text, drone.positionY._text) < 100000)
}

// Add new offenders to db
const updateList = async () => {
    for (const drone of await getDrones()) {
        const sn = drone.serialNumber._text
        let resp = await fetch('https://assignments.reaktor.com/birdnest/pilots/' + sn)
        let json = await resp.json()
        console.log(json)
    }
}

const main = async () => {
    updateList()
    try {
        const app = express()
        app.use(express.json())
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            next()
        })
        app.use(express.static('frontend/'))

        app.get('/api', (req, res) => {
            fs.readFile(db, async (err, file) => {
                res.status(200).json(await JSON.parse(file))
            })
        })

        const server = app.listen(port, () => {
            console.log('Listening on port ' + port)
        })
        process.on('SIGINT', async () => {
            server.close(() => {
                console.log('Server closed')
                process.exit(1)
            })
        })
    } catch (err) {
        console.log(err)
    }
}
main()

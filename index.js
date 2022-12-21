require('dotenv').config()
const express = require('express')
const fs = require('fs')
const daemon = require('./daemon.js')
const db = require('./db/read.js')

const main = async () => {
    try {
        const app = express()
        app.use(express.json())
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*')
            next()
        })
        app.use(express.static('frontend/'))

        // API request starts daemon (if not running) and sends json
        app.get('/api/:query?', async (req, res) => {
            if (!await db.instances()) daemon()
            let json = req.params.query === 'coords'
                ? await db.getCoords()
                : await db.getPilots()
            res.status(200).json(json.rows)
        })

        const server = app.listen(process.env.PORT, process.env.HOST, () => {
            console.log(`Listening ${process.env.HOST}:${process.env.PORT}`)
        })
        process.on('SIGINT', async () => {
            server.close(() => {
                console.log('Server closed')
                process.exit(1)
            })
        })
    } catch (e) {
        console.log(e)
    }
}
main()

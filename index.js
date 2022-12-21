require('dotenv').config()
const express = require('express')
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
        const exit = async (sig) => {
            // Delete leftover pid
            await require('./db/write.js').onStop(process.pid)
            console.log(`Server closed with ${sig}`)
            server.close(() => process.exit(1))
        }
        process.on('SIGINT', exit)
        process.on('SIGHUP', exit)
        process.on('SIGTERM', exit)
    } catch (e) {
        console.log(e)
    }
}
main()

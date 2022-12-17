require('dotenv').config()
const express = require('express')
const fs = require('fs')
const daemon = require('./daemon.js')
const db = require('./db.js')

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
        app.get('/api', async (req, res) => {
            daemon()
            let json = await db.get()
            res.status(200).json(json.rows)
        })

        const server = app.listen(process.env.PORT, () => {
            console.log('Listening on port ' + process.env.PORT)
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

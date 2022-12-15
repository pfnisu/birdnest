require('dotenv').config()
const express = require('express')
const fs = require('fs')
const daemon = require('./daemon.js')
const PORT = process.env.PORT
const DB = process.env.DB

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
        app.get('/api', (req, res) => {
            daemon()
            fs.readFile(DB, async (err, file) => {
                res.status(200).json(await JSON.parse(`{"pilots":[${file}]}`))
            })
        })

        const server = app.listen(PORT, () => {
            console.log('Listening on port ' + PORT)
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

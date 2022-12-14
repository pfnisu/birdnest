require('dotenv').config()
const port = process.env.PORT
const db = process.env.DB
const express = require('express')
const fs = require('fs')
const xml = require('xml-js')

const main = async () => {
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

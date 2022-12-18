require('dotenv').config()
const { Pool } = require('pg')
const db = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PW,
    database: process.env.DB,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})
const timespan = 10

module.exports = {
    // Unique add, return the new id if insert succeeded
    // TODO error handling
    // TODO use internal timestamps (db)
    add: async (pilot) => {
        try {
            await db.query(
                `insert into pilots values ($1, $2, $3, $4, $5::decimal, $6::timestamp)
                    on conflict (id)
                    do update set radius = $5
                    where pilots.radius > $5`,
                [pilot.id, pilot.name, pilot.phone, pilot.email, pilot.radius, pilot.dt])
            console.log('DB insert ok')
        } catch (e) {
            console.log(e)
        }
    },
    // Get all rows newer than current time - limit
    get: async (limit = timespan) => {
        try {
            let since = new Date()
            since.setMinutes(since.getMinutes() - limit)
            let res = await db.query(
                `select name, phone, email, radius from pilots
                where pilots.dt > $1`,
                [since.toISOString()])
            console.log(`DB select since ${since} ok`)
            return res
        } catch (e) {
            console.log(e)
        }
    },
    // Delete all rows older than current time - limit
    purge: async (limit = timespan) => {
        try {
            let before = new Date()
            before.setMinutes(before.getMinutes() - limit)
            let res = await db.query(
                `delete from pilots where dt < $1`,
                [before.toISOString()])
            console.log(`DB delete before ${before} ok`)
            return res
        } catch (e) {
            console.log(e)
        }
    },
}

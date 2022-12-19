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

// Calculate timestamp with limit as minutes before current time
const timespan = (limit = 10) => {
    let ts = new Date()
    ts.setMinutes(ts.getMinutes() - limit)
    return ts.toISOString()
}

module.exports = {
    // Add unique pilots and update with closest radius
    add: async (pilot) => {
        try {
            await db.query(
                `insert into pilots values
                    ($1, $2, $3, $4, $5::decimal, $6::decimal,
                        $7::decimal, $8::timestamp)
                    on conflict (id)
                    do update set x = $5, y = $6, radius = $7
                    where pilots.radius > $7`,
                [pilot.id, pilot.name, pilot.phone, pilot.email,
                    pilot.x, pilot.y, pilot.radius, pilot.dt])
        } catch (e) {
            console.log(e)
        }
    },
    // Get coordinates from rows newer than start of timespan
    coords: async () => {
        try {
            let res = await db.query(
                `select name, x, y from pilots
                where pilots.dt > $1`,
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
    // Get pilot info from rows newer than start of timespan
    pilots: async () => {
        try {
            let res = await db.query(
                `select name, phone, email, radius from pilots
                where pilots.dt > $1`,
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
    // Delete all rows older than timespan
    purge: async () => {
        try {
            let res = await db.query(
                `delete from pilots where dt < $1`,
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
}

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

module.exports = {
    // Unique add, return the new id if insert succeeded
    // TODO error handling
    add: async (pilot) => {
        try {
            await db.query(
                `insert into pilots values ($1, $2, $3, $4::decimal, $5::date)
                    on conflict (id)
                    do update set radius = $4
                    where pilots.radius > $4`,
                [pilot.id, pilot.name, pilot.sn, pilot.radius, pilot.dt])
            console.log('DB insert ok')
        } catch (e) {
            console.log(e)
        }
    },
    // Get all rows newer than timestamp 'since'
    get: async (since = 0) => {
        try {
            let res = await db.query('select * from pilots')
            console.log('DB select ok')
            return res
        } catch (e) {
            console.log(e)
        }
    },
}

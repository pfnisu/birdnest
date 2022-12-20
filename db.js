require('dotenv').config()
const { Pool } = require('pg')
const db = new Pool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPW,
    database: process.env.DBNAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DBSSL === 'true' ? true : false,
})

// Calculate timestamp with limit as minutes before current time
const timespan = (limit = 10) => {
    let ts = new Date()
    ts.setMinutes(ts.getMinutes() - limit)
    return ts.toISOString()
}

module.exports = {
    // Add unique drones, update latest timestamp and closest radius
    addDrone: async (drone) => {
        try {
            await db.query(
                `with _ as (
                    update drones set dt = $5 where sn = $1)
                insert into drones values (
                    $1, $2::decimal, $3::decimal, $4::decimal, $5::timestamp)
                    on conflict (sn)
                        do update set x = $2, y = $3, radius = $4
                        where drones.radius > $4`,
                [drone.sn, drone.x, drone.y, drone.radius, drone.dt])
        } catch (e) {
            console.log(e)
        }
    },
    // Add unique pilots
    addPilot: async (pilot) => {
        try {
            await db.query(
                `insert into pilots values ($1, $2, $3, $4, $5)
                on conflict (id) do nothing`,
                [pilot.id, pilot.name, pilot.phone, pilot.email, pilot.sn])
        } catch (e) {
            console.log(e)
        }
    },
    // Get coordinates from rows newer than start of timespan
    getCoords: async () => {
        try {
            let res = await db.query(
                `select name, drones.x, drones.y from pilots
                inner join drones on drones.sn = pilots.sn
                where drones.dt > $1`,
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
    // Get pilot info from rows newer than start of timespan
    getPilots: async () => {
        try {
            let res = await db.query(
                `select name, phone, email, drones.radius from pilots
                inner join drones on drones.sn = pilots.sn
                where drones.dt > $1`,
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
    // Delete all data older than timespan
    purge: async () => {
        try {
            let res = await db.query(
                `delete from drones where dt < $1`, // Cascades to pilots
                [timespan()])
            return res
        } catch (e) {
            console.log(e)
        }
    },
}

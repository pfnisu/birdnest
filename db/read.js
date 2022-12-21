const { db, timespan } = require('./db.js')

module.exports = {
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
    // Get count of running instances
    instances: async () => {
        try {
            let res = await db.query('select * from instances')
            return res.rows.length
        } catch (e) {
            console.log(e)
        }
    },
}

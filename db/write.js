const { db, timespan } = require('./db.js')

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
    // Delete all data older than timespan and add process to instances
    onStart: async (pid) => {
        try {
            // Deleting drones cascades to pilots
            await db.query(
                `with _ as (
                    delete from drones where dt < $1)
                insert into instances values ($2)`,
                [timespan(), pid])
        } catch (e) {
            console.log(e)
        }
    },
    // Delete process from instances
    onStop: async (pid) => {
        try {
            await db.query(
                'delete from instances where id = $1',
                [pid])
        } catch (e) {
            console.log(e)
        }
    },
}

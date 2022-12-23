require('dotenv').config()
const { Pool } = require('pg')

// Create connection pool to db
const db = new Pool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPW,
    database: process.env.DBNAME,
    max: 30,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.DBSSL === 'true' ? true : false,
})

// Get timestamp for minutes before current time
const timespan = (minutes = 10) => {
    let ts = new Date()
    ts.setMinutes(ts.getMinutes() - minutes)
    return ts.toISOString()
}

module.exports = { db, timespan }

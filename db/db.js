require('dotenv').config()
const { Pool } = require('pg')

// Create connection pool to db
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

module.exports = { db, timespan }

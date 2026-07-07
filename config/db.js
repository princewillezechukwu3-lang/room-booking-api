require('dotenv').config();
const { Pool } = require('pg')
const logger = require('./logger')

const connectionStringSetting = process.env.NODE_ENV === 'development' ? process.env.LOCAL_DATABASE_URL
: process.env.DATABASE_URL;

const sslSetting = process.env.NODE_ENV === "development" ? false 
: {rejectUnauthorized: false}

const pool = new Pool({
    connectionString: connectionStringSetting,
    ssl: sslSetting
})

logger.info(`Database Engine initialized in [${process.env.NODE_ENV || 'development'}] mode.`);

module.exports = pool
const pool = require('../config/db')

const createRoom = async(name, hourlyRate, minRole) => {
    try{
        const result = await pool.query('INSERT INTO rooms (name, hourly_rate, min_role_requirement) VALUES ($1, $2, $3) RETURNING *;', [name, hourlyRate, minRole])
        return result.rows[0]
    } catch(error){
        throw error
    }
}

module.exports = {
    createRoom
}
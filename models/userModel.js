const pool = require('../config/db')

const createUser = async(name, role, balance) => {
    try{
        const result = await pool.query('INSERT INTO users (name, role, balance) VALUES ($1, $2, $3) RETURNING *;', [name, role, balance])
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}

module.exports = {
    createUser
}
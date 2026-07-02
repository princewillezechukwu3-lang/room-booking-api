const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const createUser = async(name, email, password, role, balance) => {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await pool.query('INSERT INTO users (name, role, balance, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [name, role, balance, email, hashedPassword])
        const user = result.rows[0];
        delete user.password
        return user
    } catch(error){
        console.error(error);
        throw error
    }
}

const getUserByEmail = async(email) => {
    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1;', [email])
        if (result.rows.length === 0){
            return null
        }
        return result.rows[0]
    } catch(error){
        console.error(error)
        throw error
    }
}

module.exports = {
    createUser,
    getUserByEmail
}
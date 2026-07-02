const pool = require('../config/db')

const ROLE_RANK = {
    'employee': 1,
    'manager': 2,
    'admin': 3
};

const createBooking = async(user_id, room_id, booking_date, start_hour, end_hour) => {
    try{
        const userData = await pool.query('SELECT * FROM users where id = $1;',[user_id])
        if (userData.rows.length === 0){
            throw new Error ('Invalid User')
        }
        const user = userData.rows[0]

        const roomData = await pool.query('SELECT * FROM rooms where id = $1;',[room_id])
        if (roomData.rows.length === 0){
            throw new Error ('Invalid room')
        }
        const room = roomData.rows[0]

        const user_role = ROLE_RANK[user.role];
        const room_min_role = ROLE_RANK[room.min_role_requirement]

        if (room_min_role > user_role){
            throw new Error (`Access denied. This room requires a minimum role of '${room.min_role_requirement}'`)
        }

        const overlapCheck = await pool.query (`SELECT * FROM bookings where room_id = $1
            AND booking_date = $2
            AND start_hour < $3
            AND end_hour > $4;`, [room_id, booking_date, end_hour, start_hour])

        if (overlapCheck.rows.length > 0){
            const error = new Error ('Room is already booked within these hours')
            error.statusCode = 409
            throw error 
        }

        const total_cost = (end_hour - start_hour) * parseFloat(room.hourly_rate)

        if (parseFloat(user.balance) < total_cost){
            const error = new Error ('Insufficient wallet balance')
            error.statusCode=400
            throw error
        }

        const client = await pool.connect();

        try{
            await client.query('BEGIN');

            await client.query(`UPDATE users SET balance = balance - $1 WHERE id = $2;`, [total_cost, user_id])

            const bookingRes = await client.query('INSERT INTO bookings (user_id, room_id, booking_date, start_hour, end_hour, total_cost) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;', [user_id, room_id, booking_date, start_hour, end_hour, total_cost])

            await client.query('COMMIT')

            return bookingRes.rows[0]
        } catch(error){
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    } catch(error) {
        throw error
    }
}


module.exports = {
    createBooking
}
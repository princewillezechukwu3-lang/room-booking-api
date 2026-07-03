const bookingModel = require('../models/bookingModel')

const createBooking = async(req, res, next) => {
    try{
        const {room_id, booking_date, start_hour, end_hour} = req.body

        if (!room_id || !booking_date || !start_hour || !end_hour){
            const err = new Error ('Missing Input')
            err.statusCode=400
            return next(err)
        }

        const user_id = req.user.id

        const createB = await bookingModel.createBooking(user_id, room_id, booking_date, start_hour, end_hour)
        res.status(201).json(createB)
    } catch(error){
        next (error)
    }
}


module.exports = {
    createBooking
}
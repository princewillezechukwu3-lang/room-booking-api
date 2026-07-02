const bookingModel = require('../models/bookingModel')

const createBooking = async(req, res, next) => {
    try{
        const {user_id, room_id, booking_date, start_hour, end_hour} = req.body

        if (!user_id || !room_id || !booking_date || !start_hour || !end_hour){
            const err = new Error ('Missing Input')
            err.statusCode=400
            return next(err)
        }

        const createB = await bookingModel.createBooking(user_id, room_id, booking_date, start_hour, end_hour)
        res.status(201).json(createB)
    } catch(error){
        next (error)
    }
}


module.exports = {
    createBooking
}
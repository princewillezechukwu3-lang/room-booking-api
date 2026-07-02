const roomModel = require('../models/roomModel')

const createRoom = async(req, res, next) => {
    try{
        const {name, hourly_rate, min_role_reqirement} = req.body
        if(!name || !hourly_rate || !min_role_reqirement){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }
        const createR = await roomModel.createRoom(name, hourly_rate, min_role_reqirement)
        res.status(201).json(createR)
    } catch(error){
        next(error)
    }
}


module.exports = {
    createRoom
}
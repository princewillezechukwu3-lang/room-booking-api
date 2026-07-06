const roomModel = require('../models/roomModel')

const createRoom = async(req, res, next) => {
    try{
        const {name, hourly_rate, min_role_requirement} = req.body
        if(!name || !hourly_rate || !min_role_requirement){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }
        const createR = await roomModel.createRoom(name, hourly_rate, min_role_requirement)
        res.status(201).json(createR)
    } catch(error){
        next(error)
    }
}


module.exports = {
    createRoom
}
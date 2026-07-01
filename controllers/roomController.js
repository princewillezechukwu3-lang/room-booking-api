const roomModel = require('../models/roomModel')

const createRoom = async(req, res) => {
    try{
        const {name, hourly_rate, min_role_reqirement} = req.body
        if(!name || !hourly_rate || !min_role_reqirement){
            return res.status(400).json({error:'Missing Input'})
        }
        const createR = await roomModel.createRoom(name, hourly_rate, min_role_reqirement)
        res.status(201).json(createR)
    } catch(error){
        res.status(500).json({error:'Internal error creating room'})
    }
}


module.exports = {
    createRoom
}
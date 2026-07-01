const userModel = require('../models/userModel')

const createUser = async(req, res) => {
    try{
        const {name, role, balance} = req.body;
        if (!name || !role || !balance){
            return res.status(400).json({error:'Misssing Input'})
        }
        const createU = await userModel.createUser(name, role, balance)
        res.status(201).json(createU)
    } catch(error){
        res.status(500).json({error:'Internal Error Creating User'})
    }
}


module.exports = {
    createUser
}
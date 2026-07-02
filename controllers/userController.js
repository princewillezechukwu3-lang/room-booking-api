const userModel = require('../models/userModel')

const createUser = async(req, res) => {
    try{
        const {name, role, balance} = req.body;
        if (!name || !role || !balance){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }
        const createU = await userModel.createUser(name, role, balance)
        res.status(201).json(createU)
    } catch(error){
        next(error)
    }
}


module.exports = {
    createUser
}
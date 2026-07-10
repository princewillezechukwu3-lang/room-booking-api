const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const createUser = async(req, res, next) => {
    try{
        const {name, role, balance, email, password} = req.body;
        if (!name || !role || !email || !password){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }

        if (balance === undefined || balance === null){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }

        const createU = await userModel.createUser(name, email, password, role, balance)
        res.status(201).json(createU)
    } catch(error){
        next(error)
    }
}

const loginUser = async(req, res, next) => {
    try{
        const {email, password} = req.body
        if (!email || !password){
            const err = new Error('Missing Input')
            err.statusCode=400
            return next(err)
        }

        const user = await userModel.getUserByEmail(email)
        if (user === null){
            const err = new Error('Invalid Credentials')
            err.statusCode=401
            return next(err)
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword){
            const err = new Error ('Invalid Credentials')
            err.statusCode=401
            return next(err)
        }

        const tokenPayload = {
            id:user.id,
            role:user.role
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )
         delete user.password
        res.status(200).json({token, user})
    } catch(error){
        next(error)
    }
}

module.exports = {
    createUser,
    loginUser
}
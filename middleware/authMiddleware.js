const jwt = require('jsonwebtoken');
const logger = require('../config/logger')

const verifyToken = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('Not authorized to access this route, token missing');
            err.statusCode = 401; 
            return next(err);
        }

        const token = authHeader.split(' ')[1];

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedPayload;

        next();

    } catch (error) {
        const err = new Error('Token verification failed, access denied');
        err.statusCode = 401;
        logger.warn(error, 'Token verification failed, access denied')
        next(err);
    }
};

module.exports = verifyToken;
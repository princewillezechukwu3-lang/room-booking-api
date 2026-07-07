const logger = require('../config/logger')

const errorHandler = (err, req, res, next) => {
    logger.error(err)

    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Error'
    res.status(statusCode).json({error: errorMessage});
}

module.exports = errorHandler
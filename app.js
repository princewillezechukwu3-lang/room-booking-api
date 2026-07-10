require('dotenv').config()
const express = require('express');
const app = express()
app.use(express.json())
const logger = require('./config/logger')

const userRoute = require('./routes/userRoute');
const roomRoute = require('./routes/roomRoute');
const errorHandler = require('./middleware/errorHandler')
const bookingRoute = require('./routes/bookingRoute')

app.use('/rooms', roomRoute)
app.use('/users', userRoute)
app.use('/bookings', bookingRoute)

app.use(errorHandler)


module.exports = app
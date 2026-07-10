const request = require('supertest')
const app = require('../app')
const pool = require('../config/db')
const { password } = require('pg/lib/defaults')


describe('Booking API Endpoints', () => {
    
    afterAll(async () => {
        await pool.query('DELETE FROM bookings;');
        await pool.query('DELETE FROM users WHERE email LIKE \'%test.com\';');
        await pool.end(); 
    });

    test('Should successfully create a booking for an authenticated user', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'Test Engineer',
                email: 'engineer@test.com',
                password: 'Password123',
                balance: 500,
                role: 'employee'
            })

        const loginTest = await request(app)
            .post('/users/login')
            .send({
                email:'engineer@test.com',
                password: 'Password123'
            })

        const token = loginTest.body.token

        const bookingRes = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: 1,
                booking_date: '2026-10-12',
                start_hour: 12,
                end_hour: 14
            })

        expect(bookingRes.statusCode).toBe(201);
        expect(bookingRes.body).toHaveProperty('id');

    });

    test('Should fail to book a  room if the user has insuffucient balance', async() => {
        await request(app)
            .post('/users')
            .send({
                name: 'Test Engineer 2',
                email: 'engineer2@test.com',
                password: 'Password123',
                balance: 0,
                role: 'employee'
            })

        const loginTest = await request(app)
            .post('/users/login')
            .send({
                email:'engineer2@test.com',
                password: 'Password123'
            })

        const token = loginTest.body.token

        const bookingFail = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: 1,
                booking_date: '2026-10-12',
                start_hour: 15,
                end_hour: 19
            })

        expect(bookingFail.statusCode).toBe(400);
    })

    test('Should completely rollback database changes if a database crash occurs mid-transaction', async () => {
    
        await request(app)
            .post('/users')
            .send({
                name: 'Rollback Test User',
                email: 'rollback@test.com',
                password: 'Password123',
                balance: 500,
                role: 'employee'
            });

        const loginRes = await request(app)
            .post('/users/login')
            .send({
                email: 'rollback@test.com',
                password: 'Password123'
            });

        const token = loginRes.body.token;

        const bookingModel = require('../models/bookingModel');
        jest.spyOn(bookingModel, 'createBooking').mockImplementationOnce(() => {
            throw new Error('Database transaction crash simulation');
        });

        const response = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: 1,
                booking_date: '2026-10-12',
                start_hour: 10,
                end_hour: 12
            });

        jest.restoreAllMocks();

        expect(response.statusCode).toBe(500);

        const userCheck = await pool.query('SELECT balance FROM users WHERE email = $1;', ['rollback@test.com']);
        expect(parseFloat(userCheck.rows[0].balance)).toBe(500);
    });
});

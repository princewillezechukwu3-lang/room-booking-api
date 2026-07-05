const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    console.log('Starting database seeding...');
    
    try {
        // 1. Generate encrypted password hashes for our default profiles
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('AdminSecure2026!', salt);
        const employeePassword = await bcrypt.hash('EmployeeSecure2026!', salt);

        // 2. Insert Default Users (Using ON CONFLICT to prevent crashes if rerun)
        await pool.query(`
            INSERT INTO users (name, email, password, role, balance)
            VALUES 
                ('System Admin', 'admin@workspace.com', $1, 'admin', 1000.00),
                ('John Employee', 'john@workspace.com', $2, 'employee', 150.00)
            ON CONFLICT (email) DO NOTHING;
        `, [adminPassword, employeePassword]);
        
        console.log('Users seeded successfully.');

        // 3. Insert Default Rooms
        // 3. Clear existing rooms or check for existence to prevent duplicate key violations
        const existingRooms = await pool.query('SELECT name FROM rooms;');
        const roomNames = existingRooms.rows.map(r => r.name);

        if (!roomNames.includes('Huddle Room Alpha') && !roomNames.includes('Executive Boardroom')) {
            await pool.query(`
                INSERT INTO rooms (name, hourly_rate, min_role_requirement)
                VALUES 
                    ('Huddle Room Alpha', 25.00, 'employee'),
                    ('Executive Boardroom', 75.00, 'manager');
            `);
            console.log('🏢 Rooms seeded successfully.');
        } else {
            console.log('🏢 Rooms already populated. Skipping room seed.');
        }
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Cut the connection pool clean so the script exits automatically in terminal
        await pool.end();
        process.exit();
    }
};

seedDatabase();
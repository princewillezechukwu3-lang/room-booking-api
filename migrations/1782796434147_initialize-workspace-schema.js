/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    // 1. Build the users table
    pgm.createTable('users', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        balance: { type: 'numeric(10, 2)', notNull: true, default: 0.00 }, // 🪙 Upgraded for decimals
        role: {
            type: 'varchar(100)',
            notNull: true,
            default: 'employee',
        },
    }, { ifNotExists: true });

    // 2. Build the rooms table
    pgm.createTable('rooms', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        hourly_rate: { type: 'numeric(10, 2)', notNull: true }, // 🪙 Upgraded for decimals
        min_role_requirement: { type: 'varchar(50)', notNull: true, default: 'employee' },
    }, { ifNotExists: true });

    // 3. Build the bookings join table
    pgm.createTable('bookings', {
        id: 'id',
        user_id: { 
            type: 'integer', 
            references: 'users(id)', 
            onDelete: 'SET NULL' 
        },
        room_id: { 
            type: 'integer', 
            references: 'rooms(id)', 
            onDelete: 'SET NULL' 
        },
        booking_date: { type: 'date', notNull: true },
        start_hour: { type: 'integer', notNull: true },
        end_hour: { type: 'integer', notNull: true },
        total_cost: { type: 'numeric(10, 2)', notNull: true } // 🪙 Upgraded for decimals
    }, { ifNotExists: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('bookings', { ifExists: true });
    pgm.dropTable('rooms', { ifExists: true });
    pgm.dropTable('users', { ifExists: true });
};
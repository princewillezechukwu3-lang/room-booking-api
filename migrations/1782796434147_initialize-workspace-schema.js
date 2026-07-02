exports.up = (pgm) => {
    // 1. Create the ENUM types first
    pgm.createType('user_role', ['employee', 'manager', 'admin']);
    pgm.createType('room_role_requirement', ['employee', 'manager', 'admin']);

    // 2. Build the users table
    pgm.createTable('users', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        balance: { type: 'numeric(10, 2)', notNull: true, default: 0.00 },
        role: {
            type: 'user_role',
            notNull: true,
            default: 'employee',
        },
    }, { ifNotExists: true });

    // 3. Build the rooms table
    pgm.createTable('rooms', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        hourly_rate: { type: 'numeric(10, 2)', notNull: true },
        min_role_requirement: { 
            type: 'room_role_requirement', 
            notNull: true, 
            default: 'employee' 
        },
    }, { ifNotExists: true });

    // 4. Build the bookings table
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
        total_cost: { type: 'numeric(10, 2)', notNull: true }
    }, { ifNotExists: true });
};

exports.down = (pgm) => {
    pgm.dropTable('bookings', { ifExists: true });
    pgm.dropTable('rooms', { ifExists: true });
    pgm.dropTable('users', { ifExists: true });
    // Drop types after tables
    pgm.dropType('room_role_requirement', { ifExists: true });
    pgm.dropType('user_role', { ifExists: true });
};
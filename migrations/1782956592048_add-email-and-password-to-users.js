/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.addColumns('users', {
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true
        },
        password: {
            type: 'varchar(255)',
            notNull: true
        }
    }, { ifNotExists: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropColumns('users', ['email', 'password'], { ifExists: true });
};
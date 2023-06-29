exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(100)',
        },
        body: {
            type: 'TEXT',
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        username: {
            type: 'VARCHAR(100)',
            notNull: true,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('threads');
};

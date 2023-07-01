exports.up = pgm => {
    pgm.createTable('likes_comment', {
        id: {
            type: 'VARCHAR(100)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('likes_comment');
};

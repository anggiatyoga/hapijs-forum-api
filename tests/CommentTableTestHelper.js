/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const NotFoundError = require('../src/Commons/exceptions/NotFoundError');

const CommentTableTestHelper = {
    async insertComment({
                         id= 'comment-123',
                         threadId= 'thread-123',
                         content= 'sample content',
                         username= 'anggiat',
                         isDelete= false,
                         date= '2021-08-08T07:19:09.775Z' }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, threadId, content, username, isDelete, new Date(date)],
        };

        await pool.query(query);
    },

    async deleteComment(commentId) {
        const query = {
            text: 'DELETE FROM comments WHERE id = $1',
            values: [commentId]
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('comment gagal dihapus. Id tidak ditemukan');
        }
    },

    async getCommentById(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await pool.query(query);

        return result.rows[0];
    },

    async getCommentsByIdThread(threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [threadId],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments')
    },
};

module.exports = CommentTableTestHelper;

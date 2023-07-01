/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
    async insertLikeComment({
                                id = 'likes_comment-123-123',
                                userId = 'user-123',
                                commentId = 'comment-123',
                                threadId = 'thread-123'}) {
        const query = {
            text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4)',
            values: [id, userId, commentId, threadId],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes_comment WHERE 1=1');
    },

    async getLikesCommentId(payload) {

        const { userId, threadId, commentId } = payload;

        const query = {
            text: 'SELECT * FROM likes_comment WHERE user_id = $1 AND comment_id = $2 AND thread_id = $3',
            values: [userId, commentId, threadId]
        };

        const result = await pool.query(query);

        return result.rows[0];
    },
};

module.exports = LikesCommentTableTestHelper;

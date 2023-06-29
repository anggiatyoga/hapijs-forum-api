/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async insertReplies({
                            id = 'replies-123',
                            threadId = 'thread-123',
                            commentId = 'comment-123',
                            content= 'sample content',
                            username= 'anggiat',
                            isDelete= false,
                            date= '2021-08-08T00:19:09.775Z'
    }) {
        const query = {

            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, username',
            values: [id, threadId, commentId, content, username, isDelete, new Date(date)],
        };

        await pool.query(query);
    },

    async deleteReplies(repliesId) {
        const query = {
            text: 'DELETE FROM replies WHERE id = $1',
            values: [repliesId]
        };

        const result = await pool.query(query);
    },

    async getRepliesByCommentId(commentId) {
        const query = {
            text: 'SELECT * FROM replies WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async getReplyById(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await pool.query(query);

        return result.rows[0];
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE replies')
    },
};

module.exports = RepliesTableTestHelper;

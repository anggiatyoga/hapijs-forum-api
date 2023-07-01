const LikesCommentRepository = require('../../Domains/likes/LikesCommentRepository');

class LikesCommentRepositoryPostgres extends LikesCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async insertLikeComment(payload) {
        const { userId, threadId, commentId } = payload;
        const id = `likes_${commentId}-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4)',
            values: [id, userId, commentId, threadId],
        };

        await this._pool.query(query);
        // console.log('result ', result);
    }

    async deleteLikeComment(likeId) {
        const query = {
            text: 'DELETE FROM likes_comment WHERE id = $1',
            values: [likeId]
        };

        await this._pool.query(query);
    }

    async getLikesCommentId(payload) {
        const { userId, threadId, commentId } = payload;

        const query = {
            text: 'SELECT id FROM likes_comment WHERE user_id = $1 AND comment_id = $2 AND thread_id = $3',
            values: [userId, commentId, threadId]
        };

        const result = await this._pool.query(query);

        return result.rows[0] === undefined? '': result.rows[0].id;
    }

    async getLikesComments(threadId, commentIds) {
        const query = {
            text: 'SELECT * FROM likes_comment WHERE thread_id = $1 AND comment_id = ANY($2::text[])',
            values: [threadId, commentIds],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = LikesCommentRepositoryPostgres;

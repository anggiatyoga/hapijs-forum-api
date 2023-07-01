const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const pool = require("../database/postgres/pool");
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async insertReply(threadId, commentId, content, username) {
        const id = `reply-${this._idGenerator()}`;


        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, username',
            values: [id, threadId, commentId, content, username, false, new Date()],
        };

        const result = await pool.query(query);

        return result.rows[0];
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1 RETURNING id',
            values: [replyId],
        };

        const resultId = await this._pool.query(query);

        if (!resultId.rows.length) {
            throw new NotFoundError('REPLY_USE_CASE.INVALID_ID');
        }

        return resultId.rows[0].id;
    }

    async getRepliesByCommentId(commentId) {
        const query = {
            text: 'SELECT r.id, r.thread_id, r.comment_id, r.content, u.username, r.is_delete, r.date FROM replies r LEFT OUTER JOIN users u on r.username = u.id WHERE r.comment_id = $1 ORDER BY r.date ASC',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getRepliesByListCommentId(commentIds) {
        const query = {
            text: 'SELECT r.id, r.thread_id, r.comment_id, r.content, u.username, r.is_delete, r.date FROM replies r LEFT OUTER JOIN users u on r.username = u.id WHERE r.comment_id = ANY($1::text[]) ORDER BY r.date',
            values: [commentIds],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async verifyIsThreadOrCommentExist(threadId, commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount <= 0) {
            throw new NotFoundError('REPLY_USE_CASE.INVALID_ID');
        }
    }
    async verifyIsReplyOwner(replyId, username) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length || username !== result.rows[0].username) {
            throw new AuthorizationError('REPLY_USE_CASE.MISSING_AUTHENTICATION');
        }
    }

    async verifyIsReplyExist(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('REPLY_USE_CASE.INVALID_ID');
        }
    }
}

module.exports = ReplyRepositoryPostgres;

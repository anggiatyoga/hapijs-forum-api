const Comment = require('../../Domains/comment/entities/Comment');
const CommentRepository = require('../../Domains/comment/CommentRepository');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async insertComment(threadId, content, username) {
        const id = `comment-${this._idGenerator()}`;
        // const timeNow = new Date().toISOString();

        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread_id, content, username, is_delete, date",
            values: [id, threadId, content, username, false, new Date()],
        };

        const result = await this._pool.query(query);
        return new Comment(result.rows[0])
    };

    async deleteComment(commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query)

        if (result.rowCount === 0) {
            throw new NotFoundError('COMMENT_USE_CASE_DELETE.INVALID_ID');
        }
    };
    async getCommentsByIdThread(threadId) {
        const query = {
            text: 'SELECT c.id, c.thread_id, c.content, u.username, c.is_delete, c.date FROM comments c JOIN threads t ON t.id = c.thread_id JOIN users u on c.username = u.id WHERE t.id = $1 ORDER BY c.date ASC',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    };

    async verifyCommentOwner(commentId, username) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('THREAD_REQUEST.INVALID_ID');
        }

        if (username !== result.rows[0].username) {
            throw new AuthorizationError('COMMENT_USE_CASE.MISSING_AUTHENTICATION');
        }
    }

}

module.exports = CommentRepositoryPostgres;

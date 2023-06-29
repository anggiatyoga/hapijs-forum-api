const Thread = require('../../Domains/thread/entities/Thread');
const ThreadRepository = require('../../Domains/thread/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(threadRequest, username) {
        const { title, body } = threadRequest;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING *',
            values: [id, title, body, new Date(), username],
        };

        const result = await this._pool.query(query);
        return new Thread(result.rows[0]);
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t LEFT JOIN users u on t.username = u.id WHERE t.id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('THREAD_REQUEST.INVALID_ID');
        }

        return result.rows[0];
    }

    async verifyThreadExist(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount <= 0) {
            throw new NotFoundError('THREAD_REQUEST.INVALID_ID');
        }
    }
}

module.exports = ThreadRepositoryPostgres;

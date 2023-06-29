/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
    async addThread({
                        id = 'thread-123',
                        title= 'title sample',
                        body= 'body sample',
                        date= '2023-05-26T07:19:09.775Z',
                        username= 'anggiat'}) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
            values: [id, title, body, new Date(date), username],
        };

        await pool.query(query);
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE threads');
    },
};

module.exports = ThreadTableTestHelper;

const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadRequest = require('../../../Domains/thread/entities/ThreadRequest');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const Thread = require('../../../Domains/thread/entities/Thread');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should save and return thread correctly', async () => {
            const threadRequest = new ThreadRequest({
                title: 'title sample',
                body: 'body sample',
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            const fakeUsername = 'anggiat';

            // Action
            const thread = await threadRepositoryPostgres.addThread(threadRequest, fakeUsername);

            // Assert

            const expectThread = new Thread({
                id: 'thread-123',
                title: threadRequest.title,
                body: threadRequest.body,
                date: new Date(thread.date),
                username: fakeUsername,
            });

            expect(thread).toStrictEqual(expectThread);
        });
    });

    describe('getThreadById', () => {
        it('should thrown error when thread not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Asert
            await expect(threadRepositoryPostgres.getThreadById('thread-000'))
                .rejects
                .toThrowError('THREAD_REQUEST.INVALID_ID');
        });

        it('should get detail thread correctly', async () => {
            const thread = {
                id: 'thread-test-123',
                title: 'title 123',
                body: 'body 123',
                date: '2023-05-26T07:19:09.775Z',
                username: 'user-123'
            };

            const user = {
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            }

            await ThreadTableTestHelper.addThread(thread);
            await UsersTableTestHelper.addUser(user);
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            const threadDetail = await threadRepositoryPostgres.getThreadById(thread.id);

            const expectThread = {
                id: thread.id,
                title: thread.title,
                body: thread.body,
                date: new Date(thread.date),
                username: user.username,
            };

            // Asert
            expect(threadDetail).toStrictEqual(expectThread);
        });
    });

    describe('verifyThreadExist', () => {
        it('should thrown error when thread not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Asert
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-000'))
                .rejects
                .toThrowError('THREAD_REQUEST.INVALID_ID');
        });

        it('should not thrown when thread exist', async () => {
            const thread = {
                id: 'thread-test-123',
                title: 'title 123',
                body: 'body 123',
                date: '2023-05-26T07:19:09.775Z',
                username: 'user-123'
            };

            const user = {
                id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia',
            }

            await ThreadTableTestHelper.addThread(thread);
            await UsersTableTestHelper.addUser(user);
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            await expect(threadRepositoryPostgres.verifyThreadExist(thread.id))
                .resolves
                .not
                .toThrowError();
        });
    });


})

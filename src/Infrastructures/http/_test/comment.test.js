const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            expect(comment.statusCode).toEqual(201);
            expect(responseComment.data).toBeDefined();
            expect(responseComment.data.addedComment).toBeDefined();
        });

        it('should response 401 when request without authentication', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.id}/comments`,
                payload: {content: 'sample content comment'},
            });
            const responseComment = JSON.parse(comment.payload);

            expect(comment.statusCode).toEqual(401);
            expect(responseComment.error).toEqual('Unauthorized');
            expect(responseComment.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload not contain needed', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.id}/comments`,
                payload: {},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            expect(comment.statusCode).toEqual(400);
            expect(responseComment.status).toEqual('fail');
            expect(responseComment.message).toEqual('tidak dapat menambahkan comment dengan content kosong');
        });

        it('should response 404 when thread NA', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/thread-invalid/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            expect(comment.statusCode).toEqual(404);
            expect(responseComment.status).toEqual('fail');
            expect(responseComment.message).toEqual('thread tidak ditemukan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and delete comment', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            /** Delete Comment */
            const commentDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const response = JSON.parse(commentDeleted.payload);

            expect(commentDeleted.statusCode).toEqual(200);
            expect(response.status).toEqual('success');
        });

        it('should response 401 when request without authentication', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.id}/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            /** Delete Comment */
            const commentDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.id}/comments/${responseComment.id}`,
                payload: {content: 'sample content comment'},
            });
            const response = JSON.parse(commentDeleted.payload);

            expect(commentDeleted.statusCode).toEqual(401);
            expect(response.error).toEqual('Unauthorized');
            expect(response.message).toEqual('Missing authentication');
        });

        it('should response 404 when thread or comment NA', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            /** Delete Comment */
            const commentDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/comments-invalid`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const response = JSON.parse(commentDeleted.payload);

            expect(commentDeleted.statusCode).toEqual(404);
            expect(response.status).toEqual('fail');
            expect(response.message).toEqual('thread tidak ditemukan');
        });

        it('should response 403 when not owner', async () => {
            const server = await createServer(container);

            /** Add User */
            const requestAddUser = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestOtherUser = {
                username: 'invalid',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUser.username,
                    password: requestAddUser.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestOtherUser.username,
                    password: requestOtherUser.password,
                    fullname: 'Invalid user',
                },
            });

            /** Auth Login */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUser,
            });
            const responseToken = JSON.parse(responseAuth.payload);

            /** Add Thread */
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: { title: 'title-sample', body: 'body sample' },
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseThread = JSON.parse(thread.payload);

            /** Add Comment */
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments`,
                payload: {content: 'sample content comment'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseComment = JSON.parse(comment.payload);

            /** Auth Login */
            const responseAuthOther = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestOtherUser,
            });
            const responseTokenOther = JSON.parse(responseAuthOther.payload);

            /** Delete Comment */
            const commentDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
                headers: { 'Authorization': `Bearer ${responseTokenOther.data.accessToken}` }
            });
            const response = JSON.parse(commentDeleted.payload);

            expect(commentDeleted.statusCode).toEqual(403);
            expect(response.status).toEqual('fail');
            expect(response.message).toEqual('tidak diizinkan untuk menghapus comment ini');
        });
    });
});


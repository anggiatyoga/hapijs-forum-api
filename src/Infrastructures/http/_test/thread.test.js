const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const container = require('../../container');
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');

describe('/thread endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    describe('when POST /thread', () => {
        it('should response 201 and persisted thread', async () => {
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
            expect(responseToken.data.accessToken).toBeDefined();

            /** Add Thread */
            const requestPayload = {
                title: 'title-sample',
                body: 'body sample',
            };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 401 when request without authentication', async () => {
            // Arrange
            const requestPayload = {
                title: 'title-sample',
                body: 'body sample',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload not contain needed property', async () => {
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
            const requestPayload = {
                title: 'title-sample',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 200 and data correctly when request get thread detail', async () => {
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

            /** Get Detail */
            const threadDetail = await server.inject({
                method: 'GET',
                url: `/threads/${responseThread.data.addedThread.id}`,
            });
            const response = JSON.parse(threadDetail.payload);

            expect(threadDetail.statusCode).toEqual(200);
            expect(response.status).toEqual('success');
            expect(response.data.thread.id).toEqual(responseThread.data.addedThread.id);
            expect(response.data.thread.comments).toHaveLength(1);
            expect(response.data.thread.comments[0].id).toEqual(responseComment.data.addedComment.id);
        });
    });
});

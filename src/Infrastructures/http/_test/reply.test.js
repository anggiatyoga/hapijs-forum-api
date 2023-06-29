const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe('/replies', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and response correctly', async () => {
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

            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {content: 'sample content reply'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseReply = JSON.parse(reply.payload);

            expect(reply.statusCode).toEqual(201);
            expect(responseReply.status).toEqual('success');
            expect(responseReply.data).toBeDefined();
            expect(responseReply.data.addedReply).toBeDefined();
            expect(responseReply.data.addedReply.content).toEqual('sample content reply');
            expect(responseReply.data.addedReply.owner).not.toBeNull();
        });

        it('should response 404 when request threadId or commentId not found', async () => {
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


            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/xxx/replies`,
                payload: {content: 'sample content reply'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReply = JSON.parse(reply.payload);

            expect(reply.statusCode).toEqual(404);
            expect(responseReply.status).toEqual('fail');
            expect(responseReply.message).not.toBeNull();
        });

        it('should response 400 when request content is empty', async () => {
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

            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {content: ''},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReply = JSON.parse(reply.payload);

            expect(reply.statusCode).toEqual(400);
            expect(responseReply.status).toEqual('fail');
            expect(responseReply.message).not.toBeNull();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}',  () => {
        it('should response 200 and response status success', async () => {
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

            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {content: 'sample content reply'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReply = JSON.parse(reply.payload);

            /** Delete Reply */
            const replyDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReplyDeleted = JSON.parse(replyDeleted.payload);

            expect(replyDeleted.statusCode).toEqual(200);
            expect(responseReplyDeleted.status).toEqual('success');
        });

        it('should response 403 when other user want to remove reply', async () => {
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

            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {content: 'sample content reply'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReply = JSON.parse(reply.payload);

            /** Add Other User */
            const requestAddUserOther = {
                username: 'anggiat',
                password: 'secret',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAddUserOther.username,
                    password: requestAddUserOther.password,
                    fullname: 'Anggiat yoga',
                },
            });

            /** Auth Login */
            const responseAuthOther = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAddUserOther,
            });
            const responseTokenOther = JSON.parse(responseAuthOther.payload);

            /** Delete Reply */
            const replyDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${responseReply.data.addedReply.id}`,
                headers: { 'Authorization': `Bearer ${responseTokenOther.data.accessToken}` }
            });
            const responseReplyDeleted = JSON.parse(replyDeleted.payload);

            expect(replyDeleted.statusCode).toEqual(403);
            expect(responseReplyDeleted.status).toEqual('fail');
            expect(responseReplyDeleted.message).not.toBeNull();
        });

        it('should response 404 when replyId not found', async () => {
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

            /** Add Reply */
            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
                payload: {content: 'sample content reply'},
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReply = JSON.parse(reply.payload);

            /** Delete Reply */
            const replyDeleted = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/xxx`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });
            const responseReplyDeleted = JSON.parse(replyDeleted.payload)

            expect(replyDeleted.statusCode).toEqual(404);
            expect(responseReplyDeleted.status).toEqual('fail');
            expect(responseReplyDeleted.message).not.toBeNull();
        });
    });
});

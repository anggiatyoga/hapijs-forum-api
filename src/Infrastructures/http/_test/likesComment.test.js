const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const LikesCommentRequest = require("../../../Domains/likes/entities/LikesCommentRequest");

describe('/likes', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await LikesCommentTableTestHelper.cleanTable();
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 and response correctly when like comment', async () => {
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
                    fullname: 'Anggiat Yoga',
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

            /** Like Comment */
            const likeComment = await server.inject({
                method: 'PUT',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseLikeComment = JSON.parse(likeComment.payload);

            expect(likeComment.statusCode).toEqual(200);
            expect(responseLikeComment.status).toEqual("success");
        });

        it('should response 200 and response correctly when unlike comment', async () => {
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
                    fullname: 'Anggiat Yoga',
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

            /** Like Comment */
            const likeComment = await server.inject({
                method: 'PUT',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            /** Unlike Comment */
            const unlikeComment = await server.inject({
                method: 'PUT',
                url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseLikeComment = JSON.parse(likeComment.payload);
            expect(likeComment.statusCode).toEqual(200);
            expect(responseLikeComment.status).toEqual("success");
        });

        it('should response 404 when request invalid threadId', async () => {
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
                    fullname: 'Anggiat Yoga',
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

            /** Like Comment */
            const likeComment = await server.inject({
                method: 'PUT',
                url: `/threads/xxx/comments/${responseComment.data.addedComment.id}/likes`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseLikeComment = JSON.parse(likeComment.payload);

            expect(likeComment.statusCode).toEqual(404);
            expect(responseLikeComment.status).toEqual("fail");
            expect(responseLikeComment.message).not.toBeNull();
        });

        it('should response 404 when request invalid commentId', async () => {
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
                    fullname: 'Anggiat Yoga',
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

            /** Like Comment */
            const likeComment = await server.inject({
                method: 'PUT',
                url: `/threads/${responseThread.data.addedThread.id}/comments/xxx/likes`,
                headers: { 'Authorization': `Bearer ${responseToken.data.accessToken}` }
            });

            const responseLikeComment = JSON.parse(likeComment.payload);

            expect(likeComment.statusCode).toEqual(404);
            expect(responseLikeComment.status).toEqual("fail");
            expect(responseLikeComment.message).not.toBeNull();
        });
    });
});

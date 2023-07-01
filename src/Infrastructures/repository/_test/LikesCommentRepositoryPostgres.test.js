const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikesCommentRequest = require('../../../Domains/likes/entities/LikesCommentRequest');
const LikesCommentRepositoryPostgres = require('../LikesCommentRepositoryPostgres');

describe('LikesCommentRepositoryPostgres', () => {
    afterEach(async () => {
        await LikesCommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('insertLikeComment actions', function () {
        it('should persist when insertLikeComment action', async () => {
            const payload = new LikesCommentRequest({
                userId: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123'
            });

            const fakeIdGenerator = () => '123';
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

            await likesCommentRepositoryPostgres.insertLikeComment(payload);

            const likesComment = await LikesCommentTableTestHelper.getLikesCommentId(payload);

            const expectLikesComment = {
                id: 'likes_comment-123-123',
                user_id: 'user-123',
                comment_id: 'comment-123',
                thread_id: 'thread-123',
            };

            expect(likesComment).toStrictEqual(expectLikesComment);
        });
    });

    describe('deleteLikeComment', function () {
        it('should deleteLikeComment correctly', async () => {
            const likesCommentId = 'likes_comment-123-111';

            const payload = new LikesCommentRequest({
                userId: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123'
            });

            await LikesCommentTableTestHelper.insertLikeComment({
                id: 'likes_comment-123-222',
                userId: payload.userId,
                commentId: payload.threadId,
                threadId: payload.commentId,
            });

            const fakeIdGenerator = () => '123';
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

            await likesCommentRepositoryPostgres.deleteLikeComment(likesCommentId);

            const likesComment = await LikesCommentTableTestHelper.getLikesCommentId(payload);

            expect(likesComment).toBeUndefined();
        });
    });

    describe('getLikesCommentId actions', function () {
        it('should return likesCommentId if data exist', async () => {
            const payload = new LikesCommentRequest({
                userId: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
            });

            await LikesCommentTableTestHelper.insertLikeComment({
                id: 'likes_comment-123-222',
                userId: payload.userId,
                commentId: payload.commentId,
                threadId: payload.threadId,
            });

            const fakeIdGenerator = () => '123';
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

            const likesComments = await likesCommentRepositoryPostgres.getLikesCommentId(payload);

            expect(likesComments).toEqual('likes_comment-123-222');
        });

        it('should return empty string if data not exist', async () => {
            const payload = new LikesCommentRequest({
                userId: 'user-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
            });

            const fakeIdGenerator = () => '123';
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

            const likesComments = await likesCommentRepositoryPostgres.getLikesCommentId(payload);

            expect(likesComments).toBe('');
        });
    });

    describe('getLikesComments action', function () {
        it('should return collection of likesComment correctly', async () => {
            const threadId = 'thread-123'
            const commentIds = ['comment-111', 'comment-222'];

            await LikesCommentTableTestHelper.insertLikeComment({
                id: 'likes_comment-123-333',
                userId: 'user-111',
                commentId: commentIds[0],
                threadId: threadId,
            });

            await LikesCommentTableTestHelper.insertLikeComment({
                id: 'likes_comment-123-444',
                userId: 'user-222',
                commentId: commentIds[0],
                threadId: threadId,
            });

            await LikesCommentTableTestHelper.insertLikeComment({
                id: 'likes_comment-123-555',
                userId: 'user-222',
                commentId: commentIds[1],
                threadId: threadId,
            });

            const fakeIdGenerator = () => '123';
            const likesCommentRepositoryPostgres = new LikesCommentRepositoryPostgres(pool, fakeIdGenerator);

            const likesComments = await likesCommentRepositoryPostgres.getLikesComments(threadId, commentIds);

            const expectLikesComments = [
                {
                    id: 'likes_comment-123-333',
                    user_id: 'user-111',
                    comment_id: commentIds[0],
                    thread_id: threadId,
                },
                {
                    id: 'likes_comment-123-444',
                    user_id: 'user-222',
                    comment_id: commentIds[0],
                    thread_id: threadId,
                },
                {
                    id: 'likes_comment-123-555',
                    user_id: 'user-222',
                    comment_id: commentIds[1],
                    thread_id: threadId,
                }
            ];

            expect(likesComments).toHaveLength(3);
            expect(likesComments).toStrictEqual(expectLikesComments);
        });
    });

});

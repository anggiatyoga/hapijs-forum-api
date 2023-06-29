const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CommentTableTestHelper = require("../../../../tests/CommentTableTestHelper");
const Comment = require("../../../Domains/comment/entities/Comment");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const Thread = require("../../../Domains/thread/entities/Thread");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('ReplyRepositoryPostgres',  () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
        await UserTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('insert reply function', () => {
        it('should persist insert reply and return reply data correctly', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'some content',
                username: 'user',
            };

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const { id } = await replyRepositoryPostgres.insertReply(payload.threadId, payload.commentId, payload.content, payload.username);

            const replyAdded = await RepliesTableTestHelper.getReplyById(id);

            const expectReply = {
                id: 'reply-123',
                comment_id: payload.commentId,
                thread_id: payload.threadId,
                content: payload.content,
                username: payload.username,
                is_delete: false,
                date: replyAdded.date
            }

            expect(replyAdded).toStrictEqual(expectReply);
        });
    });
    describe('delete reply function', () => {
        it('should return replyId  if success deleted', async () => {
            const replyId = 'reply-123';

            // Add Reply
            await RepliesTableTestHelper.insertReplies({
                id: replyId,
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'content one',
                username: 'user-111',
                isDelete: false,
                date: '2021-08-08T00:19:09.775Z',
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const replyIdDeleted = await replyRepositoryPostgres.deleteReply(replyId);

            const reply = await RepliesTableTestHelper.getReplyById(replyId);

            const expectReply = {
                id: replyId,
                comment_id: 'comment-123',
                thread_id: 'thread-123',
                content: 'content one',
                username: 'user-111',
                is_delete: true,
                date: new Date('2021-08-08T00:19:09.775Z')
            }

            expect(replyIdDeleted).toEqual(replyId);
            expect(reply).toStrictEqual(expectReply);
        });
        it('should thrown error if fail deleted', async () => {
            const replyId = 'reply-123';

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.deleteReply(replyId))
                .rejects
                .toThrowError('REPLY_USE_CASE.INVALID_ID');
        });
    });
    describe('getRepliesByCommentId function', () => {
        it('should return collection of replies if data exist', async () => {
            const commentId = 'comment-123';
            // Add User
            await UsersTableTestHelper.addUser({id: 'user-111', username: 'anggiat',});
            await UsersTableTestHelper.addUser({id: 'user-222', username: 'yoga',});

            // Add Reply
            await RepliesTableTestHelper.insertReplies({
                id: 'reply-1',
                threadId: 'thread-123',
                commentId: commentId,
                content: 'content one',
                username: 'user-111',
                isDelete: false,
                date: '2021-08-08T00:19:09.775Z'
            });
            await RepliesTableTestHelper.insertReplies({
                id: 'reply-2',
                threadId: 'thread-123',
                commentId: commentId,
                content: 'content two',
                username: 'user-222',
                isDelete: false,
                date: '2021-08-08T00:19:10.775Z'
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const replies = await replyRepositoryPostgres.getRepliesByCommentId(commentId);

            const expectedReplies = [
                {
                    id: 'reply-1',
                    thread_id: 'thread-123',
                    comment_id: commentId,
                    content: 'content one',
                    username: 'anggiat',
                    is_delete: false,
                    date: new Date('2021-08-08T00:19:09.775Z'),
                },
                {
                    id: 'reply-2',
                    thread_id: 'thread-123',
                    comment_id: commentId,
                    content: 'content two',
                    username: 'yoga',
                    is_delete: false,
                    date: new Date('2021-08-08T00:19:10.775Z'),
                }
            ]

            expect(replies).toHaveLength(2);
            expect(replies).toStrictEqual(expectedReplies);
        });
    });
    describe('verifyIsThreadOrCommentExist function', () => {
        it('should not thrown if thread or comment was exist', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            };

            // Add Thread
            await ThreadTableTestHelper.addThread(new Thread({
                id: payload.threadId,
                title: 'title 123',
                body: 'body 123',
                date: new Date(),
                username: 'user-123'
            }));

            // Add Comment
            await CommentTableTestHelper.insertComment(new Comment({
                id: payload.commentId,
                thread_id: payload.threadId,
                content: 'sample content',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T00:19:09.775Z')
            }));

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsThreadOrCommentExist(payload.threadId, payload.commentId))
                .resolves
                .not
                .toThrowError();
        });
        it('should thrown if thread or comment not exist', async () => {
            const payload = {
                threadId: 'thread-invalid',
                commentId: 'comment-invalid',
            };

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsThreadOrCommentExist(payload.threadId, payload.commentId))
                .rejects
                .toThrowError('REPLY_USE_CASE.INVALID_ID');
        });
    });
    describe('verifyIsReplyOwner function', () => {
        it('should not thrown if user is owner reply', async () => {
            const payload = {
                replyId: 'reply-1',
                username: 'user-111',
            };

            // Add reply
            await RepliesTableTestHelper.insertReplies({
                id: payload.replyId,
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'content one',
                username: payload.username,
                isDelete: false,
                date: '2021-08-08T00:19:09.775Z'
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsReplyOwner(payload.replyId, payload.username))
                .resolves
                .not
                .toThrowError();
        });

        it('should thrown if user is owner reply', async () => {
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsReplyOwner('reply-123', 'user-111'))
                .rejects
                .toThrowError('REPLY_USE_CASE.MISSING_AUTHENTICATION');
        });
    });

    describe('verifyIsReplyExist function', () => {
        it('should thrown error if reply not exist', async () => {
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsReplyExist('reply-invalid'))
                .rejects
                .toThrowError('REPLY_USE_CASE.INVALID_ID');
        });

        it('should not thrown if reply exist', async () => {
            const replyId = 'reply-123';
            // Add reply
            await RepliesTableTestHelper.insertReplies({
                id: replyId,
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'content one',
                username: 'user-123',
                isDelete: false,
                date: '2021-08-08T00:19:09.775Z'
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            await expect(replyRepositoryPostgres.verifyIsReplyExist(replyId))
                .resolves
                .not
                .toThrowError();
        });
    });

    describe('getRepliesByListCommentId function', () => {
        it('should return collection of replies if data exist', async () => {
            const commentIds = ['comment-111', 'comment-222'];
            // Add User
            await UsersTableTestHelper.addUser({id: 'user-111', username: 'anggiat',});
            await UsersTableTestHelper.addUser({id: 'user-222', username: 'yoga',});

            // Add Reply
            await RepliesTableTestHelper.insertReplies({
                id: 'reply-1',
                threadId: 'thread-123',
                commentId: commentIds[0],
                content: 'content one',
                username: 'user-111',
                isDelete: false,
                date: '2021-08-08T00:19:09.775Z'
            });
            await RepliesTableTestHelper.insertReplies({
                id: 'reply-2',
                threadId: 'thread-123',
                commentId: commentIds[1],
                content: 'content two',
                username: 'user-222',
                isDelete: false,
                date: '2021-08-08T00:19:10.775Z'
            });

            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const replies = await replyRepositoryPostgres.getRepliesByListCommentId(commentIds);

            const expectedReplies = [
                {
                    id: 'reply-1',
                    thread_id: 'thread-123',
                    comment_id: commentIds[0],
                    content: 'content one',
                    username: 'anggiat',
                    is_delete: false,
                    date: new Date('2021-08-08T00:19:09.775Z'),
                },
                {
                    id: 'reply-2',
                    thread_id: 'thread-123',
                    comment_id: commentIds[1],
                    content: 'content two',
                    username: 'yoga',
                    is_delete: false,
                    date: new Date('2021-08-08T00:19:10.775Z'),
                }
            ]

            expect(replies).toHaveLength(2);
            expect(replies).toStrictEqual(expectedReplies);
        });
    });
});

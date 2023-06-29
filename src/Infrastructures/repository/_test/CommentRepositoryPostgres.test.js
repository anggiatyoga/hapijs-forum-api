const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const Comment = require('../../../Domains/comment/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {

    afterEach(async () => {
        await CommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('AddComment action', () => {
        it('should persist comment with correctly data', async () => {
            const payload = 'sample content';

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const fakeUsername = 'anggiat';
            const fakeThreadId = 'thread-123';

            // Action
            const commentAdded = await commentRepositoryPostgres.insertComment(fakeThreadId, payload, fakeUsername);

            const comment = await CommentTableTestHelper.getCommentById('comment-123');

            // Assert
            const expectComment = {
                id: 'comment-123',
                thread_id: fakeThreadId,
                content: payload,
                username: fakeUsername,
                is_delete: false,
                date: new Date(commentAdded.date),
            }

            expect(comment).toStrictEqual(expectComment);
        });

        it('should delete comment', async () => {
            const commentId = 'comment-123';
            // insert
            await CommentTableTestHelper.insertComment(new Comment({
                id: commentId,
                thread_id: 'thread-123',
                content: 'sample content',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z')
            }));

            // create instance
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // delete
            await commentRepositoryPostgres.deleteComment(commentId);

            // check data was deleted
            const commentDeleted = await CommentTableTestHelper.getCommentById(commentId);

            const expectComment = {
                id: commentId,
                thread_id: 'thread-123',
                content: 'sample content',
                username: 'anggiat',
                is_delete: true,
                date: new Date('2021-08-08T07:19:09.775Z')
            }

            expect(commentDeleted).toStrictEqual(expectComment);
        });

        it('should return rowCount is 0 if commentId invalid when delete comment', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            await expect(commentRepositoryPostgres.deleteComment('comment-invalid'))
                .rejects
                .toThrowError('COMMENT_USE_CASE_DELETE.INVALID_ID');
        });

        it('should get comments ', async () => {
            const threadId = 'thread-123';
            // insert 2 data
            await CommentTableTestHelper.insertComment(new Comment({
                id: 'comment-111',
                thread_id: threadId,
                content: 'sample content',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z')
            }));

            await CommentTableTestHelper.insertComment(new Comment({
                id: 'comment-222',
                thread_id: threadId,
                content: 'sample content',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z')
            }));

            // create instance
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // getComments
            await commentRepositoryPostgres.getCommentsByIdThread(threadId);

            const comments = await CommentTableTestHelper.getCommentsByIdThread(threadId);
            const expectedComments = [
                {
                    id: 'comment-111',
                    thread_id: threadId,
                    content: 'sample content',
                    username: 'anggiat',
                    is_delete: false,
                    date: new Date('2021-08-08T07:19:09.775Z')
                },
                {
                    id: 'comment-222',
                    thread_id: threadId,
                    content: 'sample content',
                    username: 'anggiat',
                    is_delete: false,
                    date: new Date('2021-08-08T07:19:09.775Z')
                }
            ]

            expect(comments).toHaveLength(2);
            expect(comments).toStrictEqual(expectedComments);
        });
    });

    describe('verifyCommentOwner action', () => {
        it('should thrown error if owner wrong', async () => {
            const commentId = 'comment-123';
            await CommentTableTestHelper.insertComment(new Comment({
                id: commentId,
                thread_id: 'thread-123',
                content: 'sample content',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z')
            }));

            // create instance
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'user-invalid'))
                .rejects
                .toThrowError('COMMENT_USE_CASE.MISSING_AUTHENTICATION');
        });

        it('should thrown error 404 when thread not found', async () => {
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
                .rejects
                .toThrowError('THREAD_REQUEST.INVALID_ID');
        });

        it('should return true if owner correct', async () => {
            const commentId = 'comment-123';
            const username = 'anggiat';
            await CommentTableTestHelper.insertComment(new Comment({
                id: commentId,
                thread_id: 'thread-123',
                content: 'sample content',
                username: username,
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z')
            }));

            // create instance
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, username))
                .resolves
                .not
                .toThrowError();
        });
    });
});

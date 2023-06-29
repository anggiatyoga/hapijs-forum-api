const Comment = require('../../../Domains/comment/entities/Comment');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const CommentUseCase = require('../CommentUseCase');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');

describe('CommentUseCase', () => {
    describe('add comment action', () => {
        it('should throw error if add comment payload not contain needed property', async () => {
            const useCasePayload = {
                content: 'anggiat'
            };
            const getCommentUseCase = new CommentUseCase({});

            await expect(getCommentUseCase.addComment(useCasePayload))
                .rejects
                .toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        });

        it('should throw error when request add comment payload not correct type', async () => {
            const useCasePayload = {
                threadId: 'thread-123',
                content: 123,
                username: 'anggiat',
            };

            const getCommentUseCase = new CommentUseCase({});


            await expect(getCommentUseCase.addComment(useCasePayload))
                .rejects
                .toThrowError('COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
        });

        it('should orchestrating the add comment action correctly', async () => {
            const mockComment = new Comment({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'sebuah comment',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z'),
            });

            /** creating dependency of use case */
            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

            mockCommentRepository.insertComment = jest.fn(() => (new Comment({
                id: 'comment-123',
                thread_id: 'thread-123',
                content: 'sebuah comment',
                username: 'anggiat',
                is_delete: false,
                date: new Date('2021-08-08T07:19:09.775Z'),
            })));


            /** creating use case instance */
            const getCommentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });

            /** Action */
            const comment = await getCommentUseCase.addComment({
                threadId: mockComment.threadId,
                content: mockComment.content,
                username: mockComment.username,
            });

            /** Assert */
            expect(comment).toStrictEqual(mockComment);

            expect(mockCommentRepository.insertComment).toHaveBeenCalledWith(mockComment.threadId, mockComment.content, mockComment.username);
            expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(mockComment.threadId);
        });
    });

    describe('delete comment action', () => {
        it('should throw error if delete comment payload not contain needed property', async () => {
            const getCommentUseCase = new CommentUseCase({});

            await expect(getCommentUseCase.removeComment({commentId: ''}))
                .rejects
                .toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
        });

        it('should orchestrating the delete comment action correctly', async () => {
            const payload = {
                commentId: 'anggiat',
                username: 'comment-123'
            };
            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();
            mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
            mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

            const getCommentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });
            /** Action */
            await getCommentUseCase.removeComment(payload);

            /** Assert */
            expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(payload.commentId, payload.username);
            expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(payload.commentId);
        });
    });

    describe('get comment by thread id action', () => {
        it('should throw error if get comment by thread id payload not contain needed property', async () => {
            const getCommentUseCase = new CommentUseCase({});

            await expect(getCommentUseCase.fetchCommentsByIdThread())
                .rejects
                .toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
        });

        it('should orchestrating the get comment by thread id action correctly', async () => {
            const threadId = 'thread-123';

            /** creating dependency of use case */
            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            mockCommentRepository.getCommentsByIdThread = jest.fn(() => ([
                {
                    id: 'comment-123',
                    thread_id: threadId,
                    content: 'sebuah comment 1',
                    username: 'anggiat',
                    is_delete: false,
                    date: '2021-08-08T07:19:09.775Z',
                },
                {
                    id: 'comment-321',
                    thread_id: threadId,
                    content: 'sebuah comment 2',
                    username: 'anggiat',
                    is_delete: false,
                    date: '2021-08-08T07:20:09.775Z',
                }
            ]));

            /** creating use case instance */
            const getCommentUseCase = new CommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            });

            /** Action */
            const comments = await getCommentUseCase.fetchCommentsByIdThread(threadId);
            const expectedComments = [
                {
                    id: 'comment-123',
                    thread_id: threadId,
                    content: 'sebuah comment 1',
                    username: 'anggiat',
                    is_delete: false,
                    date: '2021-08-08T07:19:09.775Z',
                },
                {
                    id: 'comment-321',
                    thread_id: threadId,
                    content: 'sebuah comment 2',
                    username: 'anggiat',
                    is_delete: false,
                    date: '2021-08-08T07:20:09.775Z',
                }
            ]

            /** Assert */
            expect(comments).toHaveLength(2);
            expect(comments).toStrictEqual(expectedComments);

            expect(mockCommentRepository.getCommentsByIdThread).toBeCalledWith(threadId);
        });
    });
});

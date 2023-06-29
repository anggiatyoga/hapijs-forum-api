const Reply = require('../../../Domains/reply/entities/Reply');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');


describe('ReplyUseCase', () => {
    describe('add reply action', () => {
        it('should thrown 400 error invariant when request not match', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: '',
                username: 'user',
            };
            const getReplyUseCase = new ReplyUseCase({});

            await expect(getReplyUseCase.addReply(payload))
                .rejects
                .toThrowError('REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
        });

        it('should throw error 400 when request add reply not correct type data', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: {},
                username: 'user',
            };

            const getReplyUseCase = new ReplyUseCase({});
            await expect(getReplyUseCase.addReply(payload))
                .rejects
                .toThrowError('REPLY_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
        });

        it('should orchestrating the add reply action correctly', async () => {
            const payload = {
                id: 'reply-123',
                threadId: 'thread-123',
                commentId: 'comment-123',
                content: 'some content',
                username: 'user',
            };

            const mockReplyRepository = new ReplyRepository();
            mockReplyRepository.verifyIsThreadOrCommentExist = jest.fn(() => Promise.resolve());
            mockReplyRepository.insertReply = jest.fn(() => ({
                id: payload.id,
                content: payload.content,
                username: payload.username,
            }));

            const getReplyUseCase = new ReplyUseCase({
                replyRepository: mockReplyRepository,
            });

            const reply = await getReplyUseCase.addReply(payload);

            const expectedReplied = {
                id: payload.id,
                content: payload.content,
                username: payload.username,
            }

            expect(reply).toStrictEqual(expectedReplied);
            expect(mockReplyRepository.verifyIsThreadOrCommentExist).toHaveBeenCalledWith(payload.threadId, payload.commentId);
            expect(mockReplyRepository.insertReply).toHaveBeenCalledWith(payload.threadId, payload.commentId, payload.content, payload.username);
        });
    });

    describe('remove reply action',  () => {
        it('should orchestrating the delete reply action correctly', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
                replyId: 'reply-123',
                username: 'user',
            };

            const mockReplyRepository = new ReplyRepository();
            mockReplyRepository.verifyIsThreadOrCommentExist = jest.fn(() => Promise.resolve());
            mockReplyRepository.verifyIsReplyExist = jest.fn(() => Promise.resolve());

            mockReplyRepository.verifyIsReplyOwner = jest.fn(() => Promise.resolve());
            mockReplyRepository.deleteReply = jest.fn(() => (payload.replyId));

            const getReplyUseCase = new ReplyUseCase({
                replyRepository: mockReplyRepository,
            });

            const replyDeleted = await getReplyUseCase.removeReply(payload);

            expect(replyDeleted).toEqual(payload.replyId);
            expect(mockReplyRepository.verifyIsReplyOwner).toHaveBeenCalledWith(payload.replyId, payload.username);
            expect(mockReplyRepository.verifyIsReplyExist).toHaveBeenCalledWith(payload.replyId);
            expect(mockReplyRepository.verifyIsThreadOrCommentExist).toHaveBeenCalledWith(payload.threadId, payload.commentId);
            expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(payload.replyId);
        });
    });

    describe('fetch replies by commentId action',  () => {

        it('should orchestrating the get replies by commentId action correctly', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            }

            const mockReplyRepository = new ReplyRepository();
            mockReplyRepository.verifyIsThreadOrCommentExist = jest.fn(() => Promise.resolve());
            mockReplyRepository.getRepliesByCommentId = jest.fn(() => ([
                {
                    id: 'reply-111',
                    threadId: payload.threadId,
                    commentId: payload.commentId,
                    content: 'first reply',
                    username: 'wawan',
                    isDelete: false,
                    date: '2021-08-08T07:20:09.775Z',
                },
                {
                    id: 'reply-222',
                    threadId: payload.threadId,
                    commentId: payload.commentId,
                    content: 'second reply',
                    username: 'mamat',
                    isDelete: true,
                    date: '2021-08-08T08:20:09.775Z',
                },
            ]));

            const getReplyUseCase = new ReplyUseCase({
                replyRepository: mockReplyRepository,
            });

            const replies = await getReplyUseCase.fetchRepliesByIdComment(payload.threadId, payload.commentId);
            const expectedReplies = [
                {
                    id: 'reply-111',
                    threadId: payload.threadId,
                    commentId: payload.commentId,
                    content: 'first reply',
                    username: 'wawan',
                    isDelete: false,
                    date: '2021-08-08T07:20:09.775Z',
                },
                {
                    id: 'reply-222',
                    threadId: payload.threadId,
                    commentId: payload.commentId,
                    content: 'second reply',
                    username: 'mamat',
                    isDelete: true,
                    date: '2021-08-08T08:20:09.775Z',
                },
            ]

            expect(replies).toHaveLength(2);
            expect(replies).toStrictEqual(expectedReplies);

            expect(mockReplyRepository.verifyIsThreadOrCommentExist).toHaveBeenCalledWith(payload.threadId, payload.commentId);
            expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(payload.commentId);
        });
    });
});

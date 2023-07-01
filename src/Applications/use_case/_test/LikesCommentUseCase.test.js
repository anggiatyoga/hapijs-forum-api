const LikesCommentRequest = require('../../../Domains/likes/entities/LikesCommentRequest');
const LikesCommentRepository = require('../../../Domains/likes/LikesCommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const LikesCommentUseCase = require('../LikesCommentUseCase');

describe('LikesCommentUseCase', () => {
    it('should orchestrating the user likes comment action correctly', async () => {
        const payload = new LikesCommentRequest({
            userId: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
        });

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.verifyIsThreadOrCommentExist = jest.fn(() => Promise.resolve());
        const mockLikesCommentRepository = new LikesCommentRepository();
        mockLikesCommentRepository.getLikesCommentId = jest.fn(() => (''));
        mockLikesCommentRepository.insertLikeComment = jest.fn(() => Promise.resolve());

        const likesCommentUseCase = new LikesCommentUseCase({
            replyRepository: mockReplyRepository,
            likesCommentRepository: mockLikesCommentRepository,
        });

        await expect(likesCommentUseCase.likesComment(payload))
            .resolves
            .not
            .toThrowError();

        expect(mockReplyRepository.verifyIsThreadOrCommentExist).toHaveBeenCalledWith(payload.threadId, payload.commentId);
        expect(mockLikesCommentRepository.getLikesCommentId).toHaveBeenCalledWith(payload);
        expect(mockLikesCommentRepository.insertLikeComment).toHaveBeenCalledWith(payload);
    });

    it('should orchestrating the user unlikes comment action correctly', async () => {
        const likesCommentId = 'likes_comment-123';
        const payload = new LikesCommentRequest({
            userId: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
        });

        const mockReplyRepository = new ReplyRepository();
        mockReplyRepository.verifyIsThreadOrCommentExist = jest.fn(() => Promise.resolve());
        const mockLikesCommentRepository = new LikesCommentRepository();
        mockLikesCommentRepository.getLikesCommentId = jest.fn(() => (likesCommentId));
        mockLikesCommentRepository.deleteLikeComment = jest.fn(() => Promise.resolve());

        const likesCommentUseCase = new LikesCommentUseCase({
            replyRepository: mockReplyRepository,
            likesCommentRepository: mockLikesCommentRepository,
        });

        await expect(likesCommentUseCase.likesComment(payload))
            .resolves
            .not
            .toThrowError();

        expect(mockReplyRepository.verifyIsThreadOrCommentExist).toHaveBeenCalledWith(payload.threadId, payload.commentId);
        expect(mockLikesCommentRepository.getLikesCommentId).toHaveBeenCalledWith(payload);
        expect(mockLikesCommentRepository.deleteLikeComment).toHaveBeenCalledWith(likesCommentId);
    });
});

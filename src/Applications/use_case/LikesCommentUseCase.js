const LikesCommentRequest = require('../../Domains/likes/entities/LikesCommentRequest');

class LikesCommentUseCase {
    constructor({ replyRepository, likesCommentRepository }) {
        this._replyRepository = replyRepository;
        this._likesCommentRepository = likesCommentRepository;
    }

    async likesComment(useCasePayload) {
        const { userId, threadId, commentId } = new LikesCommentRequest(useCasePayload);

        await this._replyRepository.verifyIsThreadOrCommentExist(threadId, commentId);

        const likesCommentId = await this._likesCommentRepository.getLikesCommentId(useCasePayload);

        if (likesCommentId !== '') {
            await this._likesCommentRepository.deleteLikeComment(likesCommentId);
        } else {
            await this._likesCommentRepository.insertLikeComment(useCasePayload);
        }
    }
}

module.exports = LikesCommentUseCase;

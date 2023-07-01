const LikesCommentUseCase = require('../../../../Applications/use_case/LikesCommentUseCase');
const LikesCommentRequest = require('../../../../Domains/likes/entities/LikesCommentRequest');

class LikesCommentHandler {
    constructor(container) {
        this._container = container;

        this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
    }

    async putLikeCommentHandler(request, h) {
        this._likesCommentUseCase = this._container.getInstance(LikesCommentUseCase.name);

        const { id: credentialId } = request.auth.credentials;
        const  { threadId, commentId } = request.params;

        const payload = new LikesCommentRequest({
            userId: credentialId,
            threadId: threadId,
            commentId: commentId,
        });

        await this._likesCommentUseCase.likesComment(payload);

        return h.response( { status: 'success' } );
    }
}

module.exports = LikesCommentHandler;

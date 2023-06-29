const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class ReplyHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        this._replyUseCase = this._container.getInstance(ReplyUseCase.name);

        const { id: credentialId } = request.auth.credentials;
        const  { threadId, commentId } = request.params;
        const { content } = request.payload;

        const payload = {
            threadId: threadId,
            commentId: commentId,
            content: content,
            username: credentialId };
        const reply = await this._replyUseCase.addReply(payload);

        const response = h.response({
            status: 'success',
            data: {
                addedReply: {
                    id: reply.id,
                    content: reply.content,
                    owner: reply.username
                }
            }
        });

        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        this._replyUseCase = this._container.getInstance(ReplyUseCase.name);

        const { id: credentialId } = request.auth.credentials;
        const  { threadId, commentId, replyId } = request.params;
        const payload = {
            threadId: threadId,
            commentId: commentId,
            replyId: replyId,
            username: credentialId};
        await this._replyUseCase.removeReply(payload);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = ReplyHandler;

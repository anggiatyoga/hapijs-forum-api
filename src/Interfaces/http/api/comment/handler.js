const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        this._commentUseCase = this._container.getInstance(CommentUseCase.name);

        const { id: credentialId } = request.auth.credentials;
        const  { threadId } = request.params;
        const { content } = request.payload;
        const comment = await this._commentUseCase.addComment({
            threadId: threadId,
            content: content,
            username: credentialId
        });

        const response = h.response({
            status: 'success',
            data: {
                addedComment: {
                    id: comment.id,
                    content: comment.content,
                    owner: comment.username
                },
            },
        });

        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        this._commentUseCase = this._container.getInstance(CommentUseCase.name);

        const  { commentId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._commentUseCase.removeComment({
            commentId: commentId,
            username: credentialId,
        });

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = CommentHandler;

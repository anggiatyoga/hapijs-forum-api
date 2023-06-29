const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../Domains/comment/entities/AddComment');
const RemoveComment = require('../../Domains/comment/entities/RemoveComment');

class CommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async addComment(useCasePayload) {
        const { threadId, content, username } = new AddComment(useCasePayload);

        await this._threadRepository.verifyThreadExist(threadId);

        return  await this._commentRepository.insertComment(threadId, content, username);
    }

    async removeComment(useCasePayload) {
        const { commentId, username } = new RemoveComment(useCasePayload);

        await this._commentRepository.verifyCommentOwner(commentId, username);

        await this._commentRepository.deleteComment(commentId);
    }

    async fetchCommentsByIdThread(threadId) {
        if (!threadId) {
            throw new Error('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        return await this._commentRepository.getCommentsByIdThread(threadId);
    }
}

module.exports = CommentUseCase;

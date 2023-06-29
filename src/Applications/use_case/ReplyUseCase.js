const AddReply = require('../../Domains/reply/entities/AddReply');

class ReplyUseCase {
    constructor({ replyRepository }) {
        this._replyRepository = replyRepository;
    }

    async addReply(useCasePayload) {
        const { threadId, commentId, content, username } = new AddReply(useCasePayload);

        await this._replyRepository.verifyIsThreadOrCommentExist(threadId, commentId);

        return await this._replyRepository.insertReply(threadId, commentId, content, username);
    }

    async removeReply(payload) {
        const { threadId, commentId, replyId, username } = payload;

        await this._replyRepository.verifyIsThreadOrCommentExist(threadId, commentId);

        await this._replyRepository.verifyIsReplyExist(replyId);

        await this._replyRepository.verifyIsReplyOwner(replyId, username);

        return await this._replyRepository.deleteReply(replyId);
    }

    async fetchRepliesByIdComment(threadId, commentId) {
        await this._replyRepository.verifyIsThreadOrCommentExist(threadId, commentId);

        return await this._replyRepository.getRepliesByCommentId(commentId);
    }
}

module.exports = ReplyUseCase;

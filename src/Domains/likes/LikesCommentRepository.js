class LikesCommentRepository {
    async insertLikeComment({ userId, threadId, commentId }) {
        throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async deleteLikeComment(likeId) {
        throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
    async getLikesCommentId({ userId, threadId, commentId }) {
        throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikesComments(threadId, commentIds) {
        throw new Error('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikesCommentRepository;

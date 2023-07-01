class LikesCommentRequest {
    constructor(payload) {
        this._verifyPayload(payload);

        const { userId, threadId, commentId } = payload;

        this.userId = userId;
        this.threadId = threadId;
        this.commentId = commentId;
    }

    _verifyPayload({ userId, threadId, commentId }) {
        if (!userId || !threadId || !commentId) {
            throw new Error('LIKES_COMMENT_REQUEST.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
            throw new Error('LIKES_COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = LikesCommentRequest;

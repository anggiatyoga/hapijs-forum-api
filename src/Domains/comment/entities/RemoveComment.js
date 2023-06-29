class RemoveComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { commentId, username } = payload;

        this.commentId = commentId;
        this.username = username;
    }

    _verifyPayload({ commentId, username }) {
        if (!commentId || !username) {
            throw new Error('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string' || typeof username !== 'string') {
            throw new Error('COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = RemoveComment;

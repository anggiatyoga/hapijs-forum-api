class AddComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { threadId, content, username } = payload;

        this.threadId = threadId;
        this.content = content;
        this.username = username;
    }

    _verifyPayload({ threadId, content, username }) {
        if (!threadId || !content || !username) {
            throw new Error('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof content !== 'string' || typeof username !== 'string') {
            throw new Error('COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;

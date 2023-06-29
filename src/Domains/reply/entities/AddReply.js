class AddReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const { threadId, commentId, content, username } = payload;

        this.threadId = threadId;
        this.commentId = commentId;
        this.content = content;
        this.username = username;
    }

    _verifyPayload({ threadId, commentId, content, username }) {
        if (!threadId || !commentId || !content || content === '' || !username) {
            throw new Error('REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string' || typeof username !== 'string') {
            throw new Error('REPLY_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddReply;

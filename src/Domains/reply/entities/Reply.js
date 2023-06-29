class Reply {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, threadId, commentId, content, username, isDelete, date } = payload;

        this.id = id;
        this.threadId = threadId;
        this.commentId = commentId;
        this.content = content;
        this.username = username;
        this.isDelete = isDelete;
        this.date = date;
    }

    _verifyPayload({id, threadId, commentId, content, username, isDelete, date}) {
        if (!id || !threadId || !commentId || !content || !username || isDelete == null || !date) {
           throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== "string" || typeof threadId !== "string" || typeof commentId !== "string" || typeof content !== "string" || typeof username !== "string" || typeof isDelete !== "boolean" || typeof date !== "object") {
            throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Reply;

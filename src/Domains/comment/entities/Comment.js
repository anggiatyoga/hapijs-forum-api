class Comment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, thread_id, content, username, is_delete, date } = payload;

        this.id = id;
        this.threadId = thread_id;
        this.content = content;
        this.username = username;
        this.isDelete = is_delete;
        this.date = date;
    }

    _verifyPayload({ id, thread_id, content, username, is_delete, date }) {
        if (id == null || thread_id == null || content == null || username == null || date == null || is_delete == null ){
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof thread_id !== 'string' || typeof content !== 'string' || typeof username !== 'string' || typeof is_delete !== 'boolean' || typeof date !== 'object' ) {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;

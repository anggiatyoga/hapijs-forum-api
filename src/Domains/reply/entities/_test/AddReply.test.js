const AddReply = require('../AddReply');
const {use} = require("bcrypt/promises");

describe('a add reply entities', () => {
    it('should thrown error when payload did not contain needed property',  () => {
        const payload = {
            threadId: '',
            commentId: '',
            username: '',
        };

        expect(() => new AddReply(payload)).toThrowError('REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should thrown error when payload did not meet data type specification',  () => {
        const payload = {
            threadId: 'thread',
            commentId: 'comment',
            content: 123,
            username: 'user',
        };

        expect(() => new AddReply(payload)).toThrowError('REPLY_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        const payload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'some content',
            username: 'user-123',
        };

        const addReply = new AddReply(payload);
        const expected = new AddReply({
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'some content',
            username: 'user-123',
        });

        expect(addReply).toBeInstanceOf(AddReply);
        expect(addReply).toStrictEqual(expected);
    });
});

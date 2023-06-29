const Reply = require('../Reply');

describe('a reply entities', () => {
    it('should thrown error when payload did not contain needed property', () => {
        const payload = {
            id: '',
            threadId: '',
            commentId: '',
            content: '',
            username: '',
            isDelete: false,
        };

        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should thrown error when payload didnot meet data type specification', () => {
        const payload = {
            id: 'reply-123',
            threadId: 111,
            commentId: 'comment-123',
            content: [],
            username: 'user',
            isDelete: 'true',
            date: true,
        };
        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create reply object correctly', () => {
        const payload = {
            id: 'reply-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'some content',
            username: 'user',
            isDelete: false,
            date: new Date('2021-08-08T07:19:09.775Z'),
        };

        const reply = new Reply(payload);
        const expected = new Reply({
            id: 'reply-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'some content',
            username: 'user',
            isDelete: false,
            date: new Date('2021-08-08T07:19:09.775Z'),
        });

        expect(reply).toBeInstanceOf(Reply);
        expect(reply).toStrictEqual(expected);
    });
});

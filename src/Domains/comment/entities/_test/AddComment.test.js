const AddComment = require('../AddComment');

describe('a add comment entities',  () => {
    it('should thrown error when payload did not contain needed property',  () => {
        const payload = {
            threadId: '',
            content: '',
        };

        expect(() => new AddComment(payload)).toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should thrown error when payload didnot meet data type specification', () => {
        const payload = {
            threadId: 123,
            content: [],
            username: 'user-123',
        };

        expect(() => new AddComment(payload)).toThrowError('COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly',  () => {
        const payload = {
            threadId: 'thread-123',
            content: 'content sample',
            username: 'user-123',
        };

        const addComment = new AddComment(payload);

        const expected = new AddComment({
            threadId: 'thread-123',
            content: 'content sample',
            username: 'user-123',
        });

        expect(addComment).toBeInstanceOf(AddComment);
        expect(addComment).toStrictEqual(expected);

    });
});

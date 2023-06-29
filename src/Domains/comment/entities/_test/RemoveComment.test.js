const RemoveComment = require('../RemoveComment');

describe('a remove comment entities',  () => {
    it('should thrown error when payload did not contain needed property', () => {
        const payload = {
            commentId: '',
        };

        expect(() => new RemoveComment(payload)).toThrowError('COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should thrown error when payload did not meet data type specification', () => {
        const payload = {
            commentId: 123,
            username: []
        };

        expect(() => new RemoveComment(payload)).toThrowError('COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        const payload = {
            commentId: 'comment-123',
            username: 'user-123'
        };

        const removeComment = new RemoveComment(payload);
        const expected = new RemoveComment({
            commentId: 'comment-123',
            username: 'user-123'
        });

        expect(removeComment).toBeInstanceOf(RemoveComment);
        expect(removeComment).toStrictEqual(expected);
    });
});

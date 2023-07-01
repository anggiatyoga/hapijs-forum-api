const LikesCommentRequest = require('../LikesCommentRequest');

describe('a LikesCommentRequest entities', () => {
    it('should thrown error when payload did not contain needed property', () => {
        const payload = {
            userId: '',
            threadId: '',
        };

        expect(() => new LikesCommentRequest(payload)).toThrowError('LIKES_COMMENT_REQUEST.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            userId: 'user-123',
            threadId: 'thread-123',
            commentId: 123,
        };

        expect(() => new LikesCommentRequest(payload)).toThrowError('LIKES_COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create threadRequest object correctly', () => {
        const payload = {
            userId: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
        };

        const likesCommentRequest = new LikesCommentRequest(payload);
        const expected = new LikesCommentRequest({
            userId: 'user-123',
            threadId: 'thread-123',
            commentId: 'comment-123',
        });

        expect(likesCommentRequest).toBeInstanceOf(LikesCommentRequest);
        expect(likesCommentRequest).toStrictEqual(expected);
    });
});

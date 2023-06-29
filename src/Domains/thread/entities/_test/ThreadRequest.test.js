const ThreadRequest = require('../ThreadRequest');

describe('a ThreadRequest entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'abc'
        };

        expect(() => new ThreadRequest(payload)).toThrowError('THREAD_REQUEST.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: true,
        };
        // Action and Assert
        expect(() => new ThreadRequest(payload)).toThrowError('THREAD_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when title contains more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghi',
            body: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
        };
        // Action and Assert
        expect(() => new ThreadRequest(payload)).toThrowError('THREAD_REQUEST.TITLE_LIMIT_CHAR');
    });

    it('should create threadRequest object correctly', () => {
        // Arrange
        const payload = {
            title: 'abc',
            body: 'abcdefghijklmnopqrstuvwxyz'
        };

        const threadRequest = new ThreadRequest(payload);
        const expected = new ThreadRequest({
            title: 'abc',
            body: 'abcdefghijklmnopqrstuvwxyz'
        });

        expect(threadRequest).toBeInstanceOf(ThreadRequest);
        expect(threadRequest).toStrictEqual(expected);
    });
});

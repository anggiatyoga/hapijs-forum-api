const Comment = require('../Comment');

describe('a comment entities', () => {
    it('should thrown error when payload did not contain needed property', () => {
        const payload = {
            id: '',
            thread_id: '',
            content: '',
            username: '',
            is_delete: ''
        };

        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should thrown error when payload didnot meet data type specification',  () => {
        const payload = {
            id: '',
            thread_id: '',
            content: '',
            username: '',
            is_delete: '',
            date: '',
        };
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly',  () => {
        const payload = {
            id: 'comment-123',
            thread_id: 'thread-123',
            content: 'sebuah comment',
            username: 'anggiat',
            is_delete: false,
            date: new Date('2021-08-08T07:19:09.775Z'),
        };

        const comment = new Comment(payload);

        const expected = new Comment({
            id: 'comment-123',
            thread_id: 'thread-123',
            content: 'sebuah comment',
            username: 'anggiat',
            is_delete: false,
            date: new Date('2021-08-08T07:19:09.775Z'),
        });
        expect(comment).toBeInstanceOf(Comment);
        expect(comment).toStrictEqual(expected);
    });
});

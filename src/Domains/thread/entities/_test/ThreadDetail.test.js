const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
    it('should thrown error when payload did not contain needed property', function () {
        const payload = {
            id: '',
            title: '',
            body: '',
            date: '',
        };

        expect(() => new ThreadDetail(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            title: 123,
            body: true,
            date: 123,
            username: true,
            comments: 'items'
        };

        expect(() => new ThreadDetail(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create thread object correctly', () => {
        const payload = {
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:19:09.775Z',
            username: 'anggiat',
            comments: [
                {
                    id: 'comment-111',
                    username: 'budi',
                    date: '2021-08-08T08:19:09.775Z',
                    content: 'content pertama',
                },
                {
                    id: 'comment-222',
                    username: 'kuku',
                    date: '2021-08-08T08:19:09.775Z',
                    content: 'content kedua',
                },
            ]
        };

        const threadDetail = new ThreadDetail(payload);
        const expected = new ThreadDetail({
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:19:09.775Z',
            username: 'anggiat',
            comments: [
                {
                    id: 'comment-111',
                    username: 'budi',
                    date: '2021-08-08T08:19:09.775Z',
                    content: 'content pertama',
                },
                {
                    id: 'comment-222',
                    username: 'kuku',
                    date: '2021-08-08T08:19:09.775Z',
                    content: 'content kedua',
                },
            ]
        });

        expect(threadDetail).toBeInstanceOf(ThreadDetail);
        expect(threadDetail).toStrictEqual(expected);
    });
})

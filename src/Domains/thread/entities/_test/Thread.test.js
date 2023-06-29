const Thread = require('../Thread');

describe('a Thread entities', () => {
    it('should thrown error when payload did not contain needed property', function () {
        const payload = {
            id: '',
            title: '',
            body: '',
            date: '',
        };

        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            title: 123,
            body: true,
            date: 123,
            username: true
        };

        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create thread object correctly', () => {
        const payload = {
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'anggiat'
        };

        const thread = new Thread(payload);
        const expected = new Thread({
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'anggiat'
        });

        expect(thread).toBeInstanceOf(Thread);
        expect(thread).toStrictEqual(expected);
    });
})

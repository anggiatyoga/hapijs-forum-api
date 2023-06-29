const ThreadRequest = require('../../../Domains/thread/entities/ThreadRequest');
const Thread = require('../../../Domains/thread/entities/Thread');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'abc',
            body: 'sample content of abc title'
        };

        const mockThread = new Thread({
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: useCasePayload.title,
            body: useCasePayload.body,
            date: new Date('2023-05-26T07:19:09.775Z'),
            username: 'anggiat'
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn(() => (new Thread({
            id: 'thread-h_2FkLZhtgBKY2kh4CC02',
            title: useCasePayload.title,
            body: useCasePayload.body,
            date: new Date('2023-05-26T07:19:09.775Z'),
            username: 'anggiat'
        })));

        /** creating use case instance */
        const getAddThreadUseCase = new AddThreadUseCase({threadRepository: mockThreadRepository});

        /** Action */
        const thread = await getAddThreadUseCase.execute(useCasePayload, mockThread.username);

        /** Assert */
        expect(thread).toStrictEqual(mockThread);

        expect(mockThreadRepository.addThread).toBeCalledWith(new ThreadRequest({
            title: useCasePayload.title,
            body: useCasePayload.body
        }), mockThread.username);
    });
});

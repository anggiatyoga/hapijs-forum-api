const Thread = require('../../../Domains/thread/entities/Thread');
const Comment = require('../../../Domains/comment/entities/Comment');
const Reply = require('../../../Domains/reply/entities/Reply');
const ThreadDetail = require('../../../Domains/thread/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/thread/ThreadRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const {mapReplyToResponse} = require("../../../Commons/utils/Mapper");

describe('GetDetailThreadUseCase', () => {

    it('should get detail thread with zero comment items', async () => {
        const mockThreadId = 'thread-123';

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadById = jest.fn(() => ({
            id: mockThreadId,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:19:09.775Z',
            username: 'anggiat',
            comments: [],
        }));

        mockCommentRepository.getCommentsByIdThread = jest.fn(() => ([]));

        /** creating use case instance */
        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        //Action
        const thread = await getDetailThreadUseCase.execute(mockThreadId);

        const expectResult = new ThreadDetail({
            id: mockThreadId,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: '2021-08-08T07:19:09.775Z',
            username: 'anggiat',
            comments: [],
        });

        // Assert
        expect(thread).toStrictEqual(expectResult);

        expect(thread.comments).toHaveLength(0);

        expect(mockCommentRepository.getCommentsByIdThread).toHaveBeenCalledWith(mockThreadId);
        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(mockThreadId);
    });


    it('should get detail thread with comment and replies items', async () => {
        const mockThreadId = 'thread-123';

        const mockThread = new Thread({
            id: mockThreadId,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'anggiat',
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.getCommentsByIdThread = jest.fn(() => ([
            {
                id: 'comment-111',
                username: 'budi',
                thread_id: mockThreadId,
                date: new Date('2021-08-08T08:19:09.775Z'),
                is_delete: false,
                content: 'content pertama',
            },
            {
                id: 'comment-222',
                username: 'kuku',
                thread_id: mockThreadId,
                date: new Date('2021-08-08T08:19:09.775Z'),
                is_delete: true,
                content: 'content kedua',
            },
        ]));

        mockThreadRepository.getThreadById = jest.fn(() => ({
            id: mockThreadId,
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'anggiat',
        }));

        mockReplyRepository.getRepliesByListCommentId = jest.fn(() => ([
            {
                id: 'reply-111',
                thread_id: mockThreadId,
                comment_id: 'comment-111',
                content: 'first reply',
                username: 'wawan',
                isDelete: false,
                date: new Date('2021-08-08T07:20:09.775Z'),
            }
        ]));


        /** creating use case instance */
        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            replyRepository: mockReplyRepository,
            commentRepository: mockCommentRepository,
        });

        //Action
        const thread = await getDetailThreadUseCase.execute(mockThreadId);

        const expectCommentReplies = [
            new Reply({
                id: 'reply-111',
                threadId: mockThreadId,
                commentId: 'comment-111',
                content: 'first reply',
                username: 'wawan',
                isDelete: false,
                date: new Date('2021-08-08T07:20:09.775Z'),
            }),
        ];

        const expectThreadComments = [
            {
                id: 'comment-111',
                username: 'budi',
                content: 'content pertama',
                date: new Date('2021-08-08T08:19:09.775Z'),
                replies: expectCommentReplies.map(mapReplyToResponse),
            },
            {
                id: 'comment-222',
                username: 'kuku',
                content: '**komentar telah dihapus**',
                date: new Date('2021-08-08T08:19:09.775Z'),
                replies: [],
            },
        ];

        const expectResult = new ThreadDetail({
            id: mockThreadId,
            title: mockThread.title,
            body: mockThread.body,
            date: new Date(mockThread.date).toISOString(),
            username: mockThread.username,
            comments: expectThreadComments
        });

        // Assert
        expect(thread).toStrictEqual(expectResult);
        expect(thread.comments).toHaveLength(2);
        expect(thread.comments).toStrictEqual(expectThreadComments);
        expect(thread.comments[0].replies).toHaveLength(1);
        expect(thread.comments[0].replies).toStrictEqual(expectCommentReplies.map(mapReplyToResponse));
        expect(thread.comments[1].replies).toHaveLength(0);

        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(mockThread.id);
        expect(mockCommentRepository.getCommentsByIdThread).toHaveBeenCalledWith(mockThread.id);
        expect(mockReplyRepository.getRepliesByListCommentId).toHaveBeenCalledWith(['comment-111', 'comment-222']);
    });
})

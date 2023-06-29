const { mapCommentToResponse, mapReplyToResponse } = require('../Mapper');
describe('Mapper test', () => {
    it('should mapping correctly when map with mapCommentToResponse', () => {
        const comments = [
            {
                id: 'comment-111',
                username: 'user-1',
                date: '2021-08-08T07:19:09.775Z',
                content: 'content sample 1',
                is_delete: false,
            },
            {
                id: 'comment-222',
                username: 'user-2',
                date: '2021-08-08T08:19:09.775Z',
                content: 'content sample 2',
                is_delete: true,
            },
        ];
        const commentsMapped = comments.map(mapCommentToResponse);

        const commentsExpect = [
            {
                id: 'comment-111',
                username: 'user-1',
                date: '2021-08-08T07:19:09.775Z',
                content: 'content sample 1',
            },
            {
                id: 'comment-222',
                username: 'user-2',
                date: '2021-08-08T08:19:09.775Z',
                content: '**komentar telah dihapus**',
            },
        ];

        expect(commentsMapped).toHaveLength(2);
        expect(commentsMapped).toStrictEqual(commentsExpect);
    });

    it('should mapping correctly when map with mapReplyToResponse', () => {
        const replies = {
            id: 'reply-111',
            thread_id: 'thread-123',
            comment_id: 'comment-111',
            content: 'first reply',
            username: 'wawan',
            is_delete: false,
            date: '2021-08-08T07:20:09.775Z',
        };

        const repliesDeleted = {
            id: 'reply-222',
            thread_id: 'thread-123',
            comment_id: 'comment-111',
            content: 'first reply',
            username: 'wawan',
            is_delete: true,
            date: '2021-08-08T07:20:09.775Z',
        };

        // const repliesMapped = replies.map(mapReplyToResponse);
        const replyMapped = mapReplyToResponse(replies);
        const replyDeletedMapped = mapReplyToResponse(repliesDeleted);

        const replyExpect = {
            id: 'reply-111',
            content: 'first reply',
            date: '2021-08-08T07:20:09.775Z',
            username: 'wawan',
        };

        const replyDeletedExpect = {
            id: 'reply-222',
            content: '**balasan telah dihapus**',
            date: '2021-08-08T07:20:09.775Z',
            username: 'wawan',
        };

        expect(replyMapped).toStrictEqual(replyExpect);
        expect(replyDeletedMapped).toStrictEqual(replyDeletedExpect);

    });
});

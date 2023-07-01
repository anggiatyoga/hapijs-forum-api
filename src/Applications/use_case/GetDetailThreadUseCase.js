const ThreadDetail = require('../../Domains/thread/entities/ThreadDetail');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const { mapCommentToResponse, mapReplyToResponse } = require('../../Commons/utils/Mapper');

class GetDetailThreadUseCase {
    constructor({ threadRepository, replyRepository, commentRepository, likesCommentRepository }) {
        this._threadRepository = threadRepository;
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._likesCommentRepository = likesCommentRepository;
    }

    async execute(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsByIdThread(threadId);
        const listComment = comments.length !== 0 ? await this._getListCommentReplies(comments, threadId) : [];

        return new ThreadDetail({
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: new Date(thread.date).toISOString(),
            username: thread.username,
            comments: listComment,
        });
    };

    async _getListCommentReplies(comments, threadId) {
        const commentsMapped = comments.map(mapCommentToResponse);

        let listComment = [];
        let listCommentIds = [];

        for (const item of comments) {
            listCommentIds.push(item.id);
        }

        const replies = await this._replyRepository.getRepliesByListCommentId(listCommentIds);
        const likesComment = await this._likesCommentRepository.getLikesComments(threadId, listCommentIds);

        for (const comment of commentsMapped) {
            let totalLikes = 0;
            for (const likes of likesComment) {
                if (comment.id === likes.comment_id) {
                    totalLikes += 1;
                }
            }

            let item  = {
                id: comment.id,
                username: comment.username,
                content: comment.content,
                date: comment.date,
                likeCount: totalLikes,
                replies: [],
            }
            for (const reply of replies) {
                if (comment.id === reply.comment_id) {
                    item.replies.push(mapReplyToResponse(reply));
                }
            }
            listComment.push(item);
        }
        return listComment;
    }
}

module.exports = GetDetailThreadUseCase;

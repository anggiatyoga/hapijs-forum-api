
const LikesCommentRepository = require('../LikesCommentRepository');

describe('LikesCommentRepository',  () => {
    it('should throw error when invoke abstract behavior', async () => {
        const likeCommentRepository = new LikesCommentRepository();

        await expect(likeCommentRepository.insertLikeComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.deleteLikeComment({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.getLikesCommentId({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeCommentRepository.getLikesComments({})).rejects.toThrowError('LIKES_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});

const routes = (handler) => ([
    {
        method: 'PUT',
        path: '/threads/{threadId}/comments/{commentId}/likes',
        handler: handler.putLikeCommentHandler,
        options: {
            auth:process.env.AUTH_NAME
        }
    },
]);

module.exports = routes;

const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth:process.env.AUTH_NAME,
        }
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getThreadHandler,
    },
]);

module.exports = routes;

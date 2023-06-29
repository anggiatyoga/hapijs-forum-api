const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const { id: credentialId } = request.auth.credentials;
        const thread = await addThreadUseCase.execute(request.payload, credentialId);

        const response = h.response({
            status: 'success',
            data: {
                addedThread: {
                    id: thread.id,
                    title: thread.title,
                    owner: thread.username
                }
            }
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const { threadId } = request.params;
        const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
        const threadDetail = await getDetailThreadUseCase.execute(threadId);

        const response = h.response({
            status: 'success',
            data: {
                thread: threadDetail,
            }
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadHandler;

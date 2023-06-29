const ThreadRequest = require('../../Domains/thread/entities/ThreadRequest');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, username) {
        const threadRequest = new ThreadRequest(useCasePayload);
        return this._threadRepository.addThread(threadRequest, username);;
    }
}

module.exports = AddThreadUseCase;

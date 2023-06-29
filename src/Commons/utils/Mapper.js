const mapCommentToResponse = ({
    id,
    username,
    date,
    content,
    is_delete,
}) => ({
    id: id,
    username: username,
    date: date,
    content: is_delete? '**komentar telah dihapus**': content,
});

const mapReplyToResponse = function ({
    id,
    thread_id,
    comment_id,
    content,
    username,
    is_delete,
    date,
}) {
    return {
        id: id,
        content: is_delete? '**balasan telah dihapus**': content,
        date: date,
        username: username,
    };
}

module.exports = { mapCommentToResponse, mapReplyToResponse };

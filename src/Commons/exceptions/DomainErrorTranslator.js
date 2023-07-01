const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require("./AuthorizationError");


const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'THREAD_REQUEST.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'THREAD_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('title dan body harus string'),
  'THREAD_REQUEST.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter title melebihi batas limit'),
  'THREAD_REQUEST.INVALID_ID': new NotFoundError('thread tidak ditemukan'),
  'COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan comment dengan content kosong'),
  'COMMENT_USE_CASE_ADD.INVALID_ID': new NotFoundError('comment gagal ditambahkan. Id tidak ditemukan'),
  'COMMENT_USE_CASE_DELETE.INVALID_ID': new NotFoundError('comment gagal dihapus. Id tidak ditemukan'),
  'COMMENT_USE_CASE.MISSING_AUTHENTICATION': new AuthorizationError('tidak diizinkan untuk menghapus comment ini'),
  'COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id harus string'),
  'COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),
  'REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'),
  'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data yang dimasukkan tidak sesuai'),
  'REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menambahkan reply dengan content kosong'),
  'REPLY_USE_CASE.INVALID_ID': new NotFoundError('reply gagal dihapus. Id tidak ditemukan'),
  'REPLY_USE_CASE.MISSING_AUTHENTICATION': new AuthorizationError('tidak diizinkan untuk melakukan aksi ini'),
  'REPLY_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('content harus string'),
  'LIKES_COMMENT_REQUEST.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menyukai comment dengan invalid thread atau comment'),
  'LIKES_COMMENT_REQUEST.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data yang dimasukkan tidak sesuai'),
};

module.exports = DomainErrorTranslator;

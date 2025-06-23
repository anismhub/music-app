class ExportsHandler {
  constructor(exportService, playlistService, validator) {
    this._exportService = exportService;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistByIdHandler(request, h) {
    this._validator.validateExportPlaylistSongPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const message = {
      userId: credentialId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._exportService.sendMessage(
      'export:playlist',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;

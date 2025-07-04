const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { collaborationService, playlistService, validator }
  ) => {
    const collaborationHandler = new CollaborationsHandler(
      collaborationService,
      playlistService,
      validator
    );

    server.route(routes(collaborationHandler));
  },
};

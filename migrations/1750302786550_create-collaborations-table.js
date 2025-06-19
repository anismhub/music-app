exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('collaborations', 'unique_collaborations', {
    unique: ['playlistId', 'userId'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};

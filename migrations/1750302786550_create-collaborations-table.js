exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('collaborations', 'unique_collaborations', {
    unique: ['playlist_id', 'user_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};

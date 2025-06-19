exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      references: 'playlists(id)',
      notNull: true,
      onDelete: 'cascade',
    },
    songid: {
      type: 'VARCHAR(50)',
      references: 'songs(id)',
      notNull: true,
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};

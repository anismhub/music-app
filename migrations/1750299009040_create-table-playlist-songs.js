exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: 'playlists(id)',
      notNull: true,
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: 'songs(id)',
      notNull: true,
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('playlist_songs', 'unique_playlist_song', {
    unique: ['playlist_id', 'song_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};

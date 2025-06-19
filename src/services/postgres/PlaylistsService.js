const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const ServerError = require('../../exceptions/ServerError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }
  // Baru mencoba buat playlist
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new ServerError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, users.username FROM playlists
        LEFT JOIN users ON users.id= playlists.owner
        WHERE playlists.owner = $1 OR users.id = $1
        `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan.');
    }
  }

  async addPlaylistSong({ playlistId, songId }) {
    await this.verifySongId(songId);
    const id = `p-songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Lagu gagal ditambahkan pada playlist. Id Playlist tidak ditemukan'
      );
    }

    if (!result.rows[0].id) {
      throw new ServerError('Lagu gagal ditambahkan pada playlist.');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `
        SELECT 
            playlists.id AS playlistid,
            playlists.name AS playlistname,
            users.username,
            songs.id AS songid,
            songs.title,
            songs.performer
        FROM playlists
        JOIN users ON playlists.owner = users.id
        JOIN playlist_songs ON playlists.id = playlist_songs.playlistid
        JOIN songs ON songs.id = playlist_songs.songid
        WHERE playlists.id = $1
        `,
      values: [playlistId],
    };

    try {
      const result = await this._pool.query(query);

      const playlist = {
        id: result.rows[0].playlistid,
        name: result.rows[0].playlistname,
        username: result.rows[0].username,
        songs: result.rows.map((row) => ({
          id: row.songid,
          title: row.title,
          performer: row.performer,
        })),
      };

      return { playlist };
    } catch {
      throw new ServerError('Terjadi kesalahan pada server');
    }
  }

  async deletePlaylistSongById(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE songid = $1 RETURNING songid',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Lagu dalam playlist gagal dihapus. Id lagu tidak ditemukan.'
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    // try {
    await this.verifyPlaylistOwner(playlistId, userId);
    // } catch (error) {
    //   throw error;
    // }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal menambahkan lagu pada playlist. Id lagu tidak ditemukan.'
      );
    }
  }
}

module.exports = SongsService;
